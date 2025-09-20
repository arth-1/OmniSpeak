import { chatCompletion } from '@/lib/huggingface';

export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any) => Promise<any>;
}

export interface AgentContext {
  userId?: string;
  sessionId: string;
  conversationHistory: any[];
  userProfile?: any;
  projectContext?: any;
  previousResults?: any[];
}

export interface AgentResponse {
  message: string;
  actions?: any[];
  toolsUsed?: string[];
  nextSteps?: string[];
  confidence: number;
  needsHumanIntervention?: boolean;
  data?: any;
  visualizations?: any[];
}

export abstract class BaseAgent {
  protected name: string;
  protected description: string;
  protected tools: AgentTool[];
  protected systemPrompt: string;

  constructor(name: string, description: string, systemPrompt: string) {
    this.name = name;
    this.description = description;
    this.systemPrompt = systemPrompt;
    this.tools = [];
  }

  // Public getters for accessing protected properties
  get agentName(): string {
    return this.name;
  }

  get agentDescription(): string {
    return this.description;
  }

  abstract execute(input: string, context: AgentContext): Promise<AgentResponse>;

  protected async callLLM(messages: any[]): Promise<string> {
    try {
      const result = await chatCompletion(messages);
      if (typeof result === 'string') {
        return result;
      } else {
        console.error('Unexpected LLM response format:', result);
        return 'I apologize, but I encountered an error processing your request. Please try again.';
      }
    } catch (error) {
      console.error('LLM call failed:', error);
      return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
  }

  protected async useTool(toolName: string, params: any): Promise<any> {
    const tool = this.tools.find(t => t.name === toolName);
    if (!tool) {
      console.error(`Tool ${toolName} not found`);
      return null;
    }
    
    try {
      return await tool.execute(params);
    } catch (error) {
      console.error(`Tool ${toolName} execution failed:`, error);
      return null;
    }
  }

  protected addTool(tool: AgentTool) {
    this.tools.push(tool);
  }

  public getTools(): AgentTool[] {
    return this.tools;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }
}