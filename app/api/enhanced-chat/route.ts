import { NextRequest, NextResponse } from 'next/server';
import { agentCoordinator } from '../../../lib/agents/agentCoordinator';
import { chatCompletion } from '@/lib/huggingface';

const SYSTEM_PROMPT = `
You are an AI assistant that helps coordinate real estate tasks using specialized AI agents. 
When a user asks about real estate topics, determine if the request should be handled by:

1. FinancialAgent - for mortgage calculations, loan qualifications, investment analysis, pre-approvals, tax implications, refinancing
2. PropertyProjectAgent - for project management, demand letters, client communications, construction updates, unit matching
3. Direct chat response - for general questions, explanations, or clarifications

If the request needs agent processing, suggest which agent should handle it. Otherwise, provide a helpful direct response.

Always be helpful, professional, and specific about real estate matters.
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, useAgents = false } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({
        success: false,
        error: 'Messages array is required'
      }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    
    if (useAgents && shouldUseAgents(lastMessage.content)) {
      // Use agent coordination for complex real estate tasks
      try {
        const context = {
          sessionId: `chat-${Date.now()}`,
          conversationHistory: messages,
          userId: 'chat-user'
        };

        const agentResponse = await agentCoordinator.executeTask(
          lastMessage.content,
          context,
          'smart-routing'
        );

        // Return agent response in chat format
        return NextResponse.json({
          success: true,
          message: formatAgentResponse(agentResponse),
          agentUsed: true,
          confidence: agentResponse.confidence,
          actions: agentResponse.actions,
          nextSteps: agentResponse.nextSteps
        });
      } catch (agentError) {
        console.log('Agent execution failed, falling back to chat:', agentError);
        // Fall through to regular chat if agent fails
      }
    }

    // Use regular chat completion for general conversations
    const messagesWithSystem = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    const responseText = await chatCompletion(messagesWithSystem);

    return NextResponse.json({
      success: true,
      message: responseText,
      agentUsed: false
    });

  } catch (error: any) {
    console.error('Enhanced chat error:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to process chat request'
    }, { status: 500 });
  }
}

function shouldUseAgents(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  // Financial agent keywords
  const financialKeywords = [
    'mortgage', 'loan', 'qualification', 'qualify', 'preapproval', 'pre-approval',
    'investment', 'financing', 'rate', 'payment', 'affordability', 'dti',
    'debt to income', 'refinance', 'refinancing', 'tax', 'taxes'
  ];

  // Property project agent keywords
  const projectKeywords = [
    'demand letter', 'email', 'client', 'clients', 'project', 'construction',
    'milestone', 'units', 'availability', 'match', 'floor plan', 'building',
    'development', 'amenities', 'analytics', 'report'
  ];

  // Check if message contains agent-specific keywords
  const hasFinancialKeywords = financialKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  const hasProjectKeywords = projectKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );

  // Also use agents for action-oriented requests
  const actionKeywords = [
    'calculate', 'generate', 'send', 'create', 'analyze', 'find', 'match',
    'recommend', 'suggest', 'estimate', 'determine'
  ];

  const hasActionKeywords = actionKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );

  return (hasFinancialKeywords || hasProjectKeywords) && hasActionKeywords;
}

function formatAgentResponse(agentResponse: any): string {
  let formatted = agentResponse.message;

  // Add action summaries if available
  if (agentResponse.actions && agentResponse.actions.length > 0) {
    formatted += '\n\n**Actions Completed:**\n';
    agentResponse.actions.forEach((action: any, index: number) => {
      formatted += `${index + 1}. ${action.type}: ${action.data ? 'Success' : 'Completed'}\n`;
    });
  }

  // Add next steps if available
  if (agentResponse.nextSteps && agentResponse.nextSteps.length > 0) {
    formatted += '\n\n**Recommended Next Steps:**\n';
    agentResponse.nextSteps.forEach((step: string, index: number) => {
      formatted += `${index + 1}. ${step}\n`;
    });
  }

  // Add confidence indicator
  if (agentResponse.confidence !== undefined) {
    const confidencePercent = Math.round(agentResponse.confidence * 100);
    formatted += `\n\n*Confidence: ${confidencePercent}%*`;
  }

  return formatted;
}