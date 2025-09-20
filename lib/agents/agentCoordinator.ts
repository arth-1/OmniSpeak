import { BaseAgent, AgentContext, AgentResponse } from './baseAgent';
import { FinancialAgent } from './financialAgent';
import { PropertyProjectAgent } from './propertyProjectAgent';
import { MarketAnalysisAgent } from './marketAnalysisAgent';

interface AgentRegistration {
  id: string;
  name: string;
  description: string;
  agent: BaseAgent;
  isActive: boolean;
  lastUsed: Date;
  usageCount: number;
}

interface AgentTask {
  id: string;
  agentId: string;
  input: string;
  context: AgentContext;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: AgentResponse;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

interface CoordinationStrategy {
  name: string;
  description: string;
  execute: (task: string, context: AgentContext) => Promise<AgentResponse>;
}

export class AgentCoordinator {
  private agents: Map<string, AgentRegistration> = new Map();
  private tasks: Map<string, AgentTask> = new Map();
  private strategies: Map<string, CoordinationStrategy> = new Map();

  constructor() {
    this.initializeAgents();
    this.setupCoordinationStrategies();
  }

  private initializeAgents() {
    // Register Financial Agent
    const financialAgent = new FinancialAgent();
    this.registerAgent('financial', financialAgent);

    // Register Property Project Agent
    const propertyAgent = new PropertyProjectAgent();
    this.registerAgent('property-project', propertyAgent);

    // Register Market Analysis Agent
    const marketAgent = new MarketAnalysisAgent();
    this.registerAgent('market-analysis', marketAgent);
  }

  private registerAgent(id: string, agent: BaseAgent) {
    this.agents.set(id, {
      id,
      name: agent.agentName,
      description: agent.agentDescription,
      agent,
      isActive: true,
      lastUsed: new Date(),
      usageCount: 0
    });
  }

  private setupCoordinationStrategies() {
    // Sequential execution strategy
    this.strategies.set('sequential', {
      name: 'Sequential Execution',
      description: 'Execute agents one after another in a specific order',
      execute: async (task: string, context: AgentContext) => {
        const responses: AgentResponse[] = [];
        const relevantAgents = this.determineRelevantAgents(task);

        for (const agentId of relevantAgents) {
          const agent = this.agents.get(agentId);
          if (agent?.isActive) {
            try {
              const response = await agent.agent.execute(task, context);
              responses.push(response);
              
              // Update context with previous results
              context.previousResults = responses;
              
              agent.lastUsed = new Date();
              agent.usageCount++;
            } catch (error) {
              console.error(`Agent ${agentId} failed:`, error);
            }
          }
        }

        return this.combineResponses(responses);
      }
    });

    // Parallel execution strategy
    this.strategies.set('parallel', {
      name: 'Parallel Execution',
      description: 'Execute multiple agents simultaneously and combine results',
      execute: async (task: string, context: AgentContext) => {
        const relevantAgents = this.determineRelevantAgents(task);
        const promises = relevantAgents.map(async (agentId) => {
          const agent = this.agents.get(agentId);
          if (agent?.isActive) {
            try {
              const response = await agent.agent.execute(task, context);
              agent.lastUsed = new Date();
              agent.usageCount++;
              return response;
            } catch (error) {
              console.error(`Agent ${agentId} failed:`, error);
              return null;
            }
          }
          return null;
        });

        const responses = (await Promise.all(promises)).filter(r => r !== null) as AgentResponse[];
        return this.combineResponses(responses);
      }
    });

    // Smart routing strategy
    this.strategies.set('smart-routing', {
      name: 'Smart Routing',
      description: 'Intelligently route tasks to the most appropriate agent',
      execute: async (task: string, context: AgentContext) => {
        const bestAgent = this.selectBestAgent(task);
        if (bestAgent) {
          const agent = this.agents.get(bestAgent);
          if (agent?.isActive) {
            const response = await agent.agent.execute(task, context);
            agent.lastUsed = new Date();
            agent.usageCount++;
            return response;
          }
        }

        throw new Error('No suitable agent found for the task');
      }
    });
  }

  async executeTask(
    task: string, 
    context: AgentContext, 
    strategy: string = 'smart-routing'
  ): Promise<AgentResponse> {
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create task record
    const agentTask: AgentTask = {
      id: taskId,
      agentId: 'coordinator',
      input: task,
      context,
      status: 'pending',
      createdAt: new Date()
    };
    
    this.tasks.set(taskId, agentTask);

    try {
      agentTask.status = 'processing';
      
      const coordinationStrategy = this.strategies.get(strategy);
      if (!coordinationStrategy) {
        throw new Error(`Unknown coordination strategy: ${strategy}`);
      }

      const result = await coordinationStrategy.execute(task, context);
      
      agentTask.status = 'completed';
      agentTask.result = result;
      agentTask.completedAt = new Date();

      return result;
    } catch (error: any) {
      agentTask.status = 'failed';
      agentTask.error = error?.message || 'Unknown error';
      agentTask.completedAt = new Date();
      
      throw error;
    }
  }

  private determineRelevantAgents(task: string): string[] {
    const lowerTask = task.toLowerCase();
    const relevantAgents: string[] = [];

    // Financial agent keywords
    if (lowerTask.includes('mortgage') || lowerTask.includes('loan') || 
        lowerTask.includes('financial') || lowerTask.includes('qualification') ||
        lowerTask.includes('preapproval') || lowerTask.includes('pre-approval') ||
        lowerTask.includes('tax') || lowerTask.includes('refinanc')) {
      relevantAgents.push('financial');
    }

    // Property project agent keywords
    if (lowerTask.includes('project') || lowerTask.includes('demand letter') ||
        lowerTask.includes('client') || lowerTask.includes('email') ||
        lowerTask.includes('construction') || lowerTask.includes('unit') ||
        lowerTask.includes('building')) {
      relevantAgents.push('property-project');
    }

    // Market analysis agent keywords
    if (lowerTask.includes('market') || lowerTask.includes('analysis') ||
        lowerTask.includes('investment') || lowerTask.includes('scrape') ||
        lowerTask.includes('data') || lowerTask.includes('trend') ||
        lowerTask.includes('comparison') || lowerTask.includes('valuation') ||
        lowerTask.includes('rental') || lowerTask.includes('property value') ||
        lowerTask.includes('roi') || lowerTask.includes('cap rate')) {
      relevantAgents.push('market-analysis');
    }

    // If no specific agents identified, include all active agents
    if (relevantAgents.length === 0) {
      relevantAgents.push(...Array.from(this.agents.keys()));
    }

    return relevantAgents;
  }

  private selectBestAgent(task: string): string | null {
    const relevantAgents = this.determineRelevantAgents(task);
    
    if (relevantAgents.length === 1) {
      return relevantAgents[0];
    }

    // Score agents based on task relevance
    const scores = relevantAgents.map(agentId => {
      const agent = this.agents.get(agentId);
      if (!agent) return { agentId, score: 0 };

      let score = 0;
      const lowerTask = task.toLowerCase();
      const agentKeywords = this.getAgentKeywords(agentId);

      // Calculate keyword match score
      agentKeywords.forEach(keyword => {
        if (lowerTask.includes(keyword)) {
          score += 10;
        }
      });

      // Boost score for recently used agents (they might have relevant context)
      const hoursSinceLastUse = (Date.now() - agent.lastUsed.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastUse < 1) score += 5;

      return { agentId, score };
    });

    // Return agent with highest score
    const bestMatch = scores.reduce((best, current) => 
      current.score > best.score ? current : best
    );

    return bestMatch.score > 0 ? bestMatch.agentId : relevantAgents[0];
  }

  private getAgentKeywords(agentId: string): string[] {
    const keywordMap: Record<string, string[]> = {
      'financial': ['mortgage', 'loan', 'financial', 'qualification', 'preapproval', 'tax', 'refinancing'],
      'property-project': ['project', 'demand', 'letter', 'client', 'email', 'construction', 'unit', 'building'],
      'market-analysis': ['market', 'analysis', 'investment', 'scrape', 'data', 'trend', 'comparison', 'valuation', 'rental', 'roi', 'cap rate']
    };

    return keywordMap[agentId] || [];
  }

  private combineResponses(responses: AgentResponse[]): AgentResponse {
    if (responses.length === 0) {
      return {
        message: 'No agent responses received',
        actions: [],
        toolsUsed: [],
        confidence: 0,
        needsHumanIntervention: true,
        nextSteps: ['Review task and try again']
      };
    }

    if (responses.length === 1) {
      return responses[0];
    }

    // Combine multiple responses
    const combinedActions = responses.flatMap(r => r.actions || []);
    const combinedTools = Array.from(new Set(responses.flatMap(r => r.toolsUsed).filter((tool): tool is string => typeof tool === 'string')));
    const combinedNextSteps = Array.from(new Set(responses.flatMap(r => r.nextSteps).filter((step): step is string => typeof step === 'string')));
    const averageConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;
    const needsIntervention = responses.some(r => r.needsHumanIntervention);

    const combinedMessage = responses.map((r, i) => 
      `**Agent ${i + 1}:** ${r.message}`
    ).join('\n\n');

    return {
      message: combinedMessage,
      actions: combinedActions,
      toolsUsed: combinedTools,
      confidence: averageConfidence,
      needsHumanIntervention: needsIntervention,
      nextSteps: combinedNextSteps
    };
  }

  // Agent management methods
  getAgentStatus(): AgentRegistration[] {
    return Array.from(this.agents.values());
  }

  getAgent(id: string): AgentRegistration | undefined {
    return this.agents.get(id);
  }

  activateAgent(id: string): boolean {
    const agent = this.agents.get(id);
    if (agent) {
      agent.isActive = true;
      return true;
    }
    return false;
  }

  deactivateAgent(id: string): boolean {
    const agent = this.agents.get(id);
    if (agent) {
      agent.isActive = false;
      return true;
    }
    return false;
  }

  getTaskHistory(): AgentTask[] {
    return Array.from(this.tasks.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  getTask(id: string): AgentTask | undefined {
    return this.tasks.get(id);
  }

  // Automated workflow methods
  async setupAutomatedWorkflow(workflowConfig: {
    name: string;
    trigger: string;
    agents: string[];
    schedule?: string;
  }) {
    // This would integrate with a job scheduler in production
    console.log('Setting up automated workflow:', workflowConfig);
    
    // Mock implementation for demand letter automation
    if (workflowConfig.trigger === 'construction_milestone') {
      return this.scheduleConstructionMilestoneWorkflow(workflowConfig);
    }

    return { success: true, workflowId: `workflow-${Date.now()}` };
  }

  private async scheduleConstructionMilestoneWorkflow(config: any) {
    // This would integrate with a real scheduler (cron, bull queue, etc.)
    console.log('Scheduling construction milestone workflow');
    
    // Mock: Set up recurring check for construction progress
    const workflowId = `construction-workflow-${Date.now()}`;
    
    // In production, this would:
    // 1. Monitor construction database for progress updates
    // 2. Trigger demand letter generation when milestones are reached
    // 3. Send emails to interested clients automatically
    // 4. Track engagement and follow-up actions
    
    return { 
      success: true, 
      workflowId,
      scheduledTasks: [
        'Monitor construction progress',
        'Generate demand letters on milestones',
        'Send automated emails',
        'Track client engagement'
      ]
    };
  }
}

// Singleton instance
export const agentCoordinator = new AgentCoordinator();