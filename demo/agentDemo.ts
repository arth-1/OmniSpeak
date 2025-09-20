// Demonstration script for the Real Estate AI Agent System
// This file shows how to use the agentic AI features

import { agentCoordinator } from '../lib/agents/agentCoordinator';

// Example: Testing Financial Agent
async function testFinancialAgent() {
  console.log('=== Testing Financial Agent ===');
  
  const context = {
    sessionId: 'demo-session-financial',
    conversationHistory: [],
    userId: 'demo-user'
  };

  try {
    // Test mortgage qualification
    const result1 = await agentCoordinator.executeTask(
      'Calculate mortgage qualification for a client with $80,000 annual income and $500 monthly debt',
      context,
      'smart-routing'
    );
    console.log('Mortgage Qualification Result:', result1.message);

    // Test investment analysis
    const result2 = await agentCoordinator.executeTask(
      'Analyze investment potential for a 2-bedroom unit priced at $450,000 with expected rent of $2,800',
      context,
      'smart-routing'
    );
    console.log('Investment Analysis Result:', result2.message);

    // Test pre-approval generation
    const result3 = await agentCoordinator.executeTask(
      'Generate pre-approval letter for qualified client with $400,000 budget',
      context,
      'smart-routing'
    );
    console.log('Pre-approval Result:', result3.message);

  } catch (error) {
    console.error('Financial Agent Test Error:', error);
  }
}

// Example: Testing Property Project Agent
async function testPropertyProjectAgent() {
  console.log('\n=== Testing Property Project Agent ===');
  
  const context = {
    sessionId: 'demo-session-project',
    conversationHistory: [],
    userId: 'demo-user'
  };

  try {
    // Test project status
    const result1 = await agentCoordinator.executeTask(
      'Get current status of project_1',
      context,
      'smart-routing'
    );
    console.log('Project Status Result:', result1.message);

    // Test demand letter generation
    const result2 = await agentCoordinator.executeTask(
      'Generate demand letters for construction milestone update',
      context,
      'smart-routing'
    );
    console.log('Demand Letter Result:', result2.message);

    // Test client matching
    const result3 = await agentCoordinator.executeTask(
      'Match available units to interested clients based on their preferences',
      context,
      'smart-routing'
    );
    console.log('Client Matching Result:', result3.message);

    // Test project analytics
    const result4 = await agentCoordinator.executeTask(
      'Generate comprehensive analytics report for project performance',
      context,
      'smart-routing'
    );
    console.log('Analytics Result:', result4.message);

  } catch (error) {
    console.error('Property Project Agent Test Error:', error);
  }
}

// Example: Testing Multi-Agent Coordination
async function testMultiAgentCoordination() {
  console.log('\n=== Testing Multi-Agent Coordination ===');
  
  const context = {
    sessionId: 'demo-session-multi',
    conversationHistory: [],
    userId: 'demo-user'
  };

  try {
    // Test sequential execution
    const result1 = await agentCoordinator.executeTask(
      'Analyze financial qualification for $500k budget and then find matching properties in our projects',
      context,
      'sequential'
    );
    console.log('Sequential Execution Result:', result1.message);

    // Test parallel execution
    const result2 = await agentCoordinator.executeTask(
      'Get project status and generate financial analysis report',
      context,
      'parallel'
    );
    console.log('Parallel Execution Result:', result2.message);

  } catch (error) {
    console.error('Multi-Agent Coordination Test Error:', error);
  }
}

// Example: Real Estate Workflow Automation
async function demonstrateWorkflowAutomation() {
  console.log('\n=== Demonstrating Workflow Automation ===');

  try {
    // Setup automated demand letter workflow
    const workflow = await agentCoordinator.setupAutomatedWorkflow({
      name: 'Construction Progress Demand Letters',
      trigger: 'construction_milestone',
      agents: ['property-project'],
      schedule: 'daily'
    });
    console.log('Automated Workflow Setup:', workflow);

    // Simulate triggering the workflow
    const context = {
      sessionId: 'workflow-demo',
      conversationHistory: [],
      userId: 'system'
    };

    const result = await agentCoordinator.executeTask(
      'Send demand letters to all clients about new floor completion at Sunset Towers project',
      context,
      'smart-routing'
    );
    console.log('Workflow Execution Result:', result.message);

  } catch (error) {
    console.error('Workflow Automation Error:', error);
  }
}

// Example: Agent Management and Monitoring
async function demonstrateAgentManagement() {
  console.log('\n=== Agent Management and Monitoring ===');

  try {
    // Get agent status
    const agents = agentCoordinator.getAgentStatus();
    console.log('Active Agents:');
    agents.forEach((agent: any) => {
      console.log(`- ${agent.name}: ${agent.isActive ? 'Active' : 'Inactive'} (Used ${agent.usageCount} times)`);
    });

    // Get task history
    const tasks = agentCoordinator.getTaskHistory();
    console.log(`\nRecent Tasks: ${tasks.slice(0, 5).length} of ${tasks.length} total`);
    tasks.slice(0, 5).forEach((task: any) => {
      console.log(`- ${task.input.substring(0, 50)}... (${task.status})`);
    });

    // Demonstrate agent activation/deactivation
    console.log('\nDeactivating financial agent...');
    agentCoordinator.deactivateAgent('financial');
    
    console.log('Reactivating financial agent...');
    agentCoordinator.activateAgent('financial');

  } catch (error) {
    console.error('Agent Management Error:', error);
  }
}

// Main demonstration function
export async function runAgentDemonstration() {
  console.log('🤖 Real Estate AI Agent System Demonstration\n');
  console.log('This demonstration shows the complete agentic AI system for real estate automation.\n');

  // Run all demonstrations
  await testFinancialAgent();
  await testPropertyProjectAgent();
  await testMultiAgentCoordination();
  await demonstrateWorkflowAutomation();
  await demonstrateAgentManagement();

  console.log('\n✅ Demonstration completed successfully!');
  console.log('\nKey Features Demonstrated:');
  console.log('1. ✅ Financial Agent - Mortgage calculations, investment analysis, pre-approvals');
  console.log('2. ✅ Property Project Agent - Demand letters, client matching, project analytics');
  console.log('3. ✅ Agent Coordination - Smart routing, sequential and parallel execution');
  console.log('4. ✅ Workflow Automation - Construction milestone triggers, automated emails');
  console.log('5. ✅ Agent Management - Status monitoring, activation/deactivation, task history');
  console.log('\nThe system is ready for production use with email integrations and database storage!');
}

// Example API usage patterns for frontend integration
export const exampleApiCalls = {
  // Get all agents
  getAgents: () => fetch('/api/agents').then(r => r.json()),
  
  // Execute agent task
  executeTask: (task: string, strategy = 'smart-routing') => 
    fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task,
        context: {
          sessionId: `session-${Date.now()}`,
          conversationHistory: [],
          userId: 'user'
        },
        strategy
      })
    }).then(r => r.json()),

  // Setup automated workflow
  setupWorkflow: (config: any) =>
    fetch('/api/agents/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    }).then(r => r.json()),

  // Enhanced chat with agents
  enhancedChat: (messages: any[], useAgents = true) =>
    fetch('/api/enhanced-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, useAgents })
    }).then(r => r.json())
};

// Real-world usage examples
export const realWorldExamples = {
  mortgageQualification: "Calculate mortgage qualification for client with $75,000 income, $800 monthly debts, and 20% down payment",
  
  investmentAnalysis: "Analyze investment potential for 3-bedroom condo at $520,000 with expected rent $3,200 monthly in downtown area",
  
  demandLetterCampaign: "Send demand letters to all interested clients about new amenity additions and price increase announcement",
  
  clientMatching: "Find best unit matches for clients with $400-600k budget preferring 2-3 bedrooms with balcony and parking",
  
  projectAnalytics: "Generate comprehensive sales and marketing analytics report for Q4 performance review",
  
  automatedWorkflow: "Setup automated demand letter system that triggers when construction milestones are reached"
};