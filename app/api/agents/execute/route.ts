import { NextRequest, NextResponse } from 'next/server';
import { FinancialAgent } from '@/lib/agents/financialAgent';
import { PropertyProjectAgent } from '@/lib/agents/propertyProjectAgent';
import { MarketAnalysisAgent } from '@/lib/agents/marketAnalysisAgent';
import { AgentContext } from '@/lib/agents/baseAgent';

// Initialize agents on the server side where env vars are available
const agents = {
  financial: new FinancialAgent(),
  'property-project': new PropertyProjectAgent(),
  market: new MarketAnalysisAgent()
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentType, task, context } = body;

    // Validate request
    if (!agentType || !task) {
      return NextResponse.json(
        { error: 'Missing required fields: agentType, task' },
        { status: 400 }
      );
    }

    // Get the appropriate agent
    const agent = agents[agentType as keyof typeof agents];
    if (!agent) {
      return NextResponse.json(
        { error: `Agent type '${agentType}' not found` },
        { status: 400 }
      );
    }

    // Create agent context
    const agentContext: AgentContext = {
      sessionId: context?.sessionId || `session-${Date.now()}`,
      conversationHistory: context?.conversationHistory || [],
      userProfile: context?.userProfile || {},
      projectContext: context?.projectContext || {},
      previousResults: context?.previousResults || []
    };

    // Execute the task
    console.log(`Executing ${agentType} agent with task: ${task}`);
    const result = await agent.execute(task, agentContext);

    return NextResponse.json({
      success: true,
      result: result
    });

  } catch (error) {
    console.error('Agent execution error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        result: {
          message: 'Agent execution failed. Please try again.',
          confidence: 0.1,
          actions: [],
          nextSteps: ['Try again with different parameters', 'Contact support if the issue persists'],
          needsHumanIntervention: true
        }
      },
      { status: 500 }
    );
  }
}