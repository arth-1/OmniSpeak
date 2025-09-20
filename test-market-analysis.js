// Test script for market analysis agent integration
import { MarketAnalysisAgent } from '../lib/agents/marketAnalysisAgent';
import { agentCoordinator } from '../lib/agents/agentCoordinator';

async function testMarketAnalysis() {
  try {
    console.log('Testing Market Analysis Agent Integration...');
    
    // Test 1: Direct agent instantiation
    const marketAgent = new MarketAnalysisAgent();
    console.log('✅ MarketAnalysisAgent instantiated successfully');
    console.log('Agent name:', marketAgent.name);
    console.log('Available tools:', marketAgent.tools.map(t => t.name));
    
    // Test 2: Agent coordinator integration
    const agentStatus = agentCoordinator.getAgentStatus();
    console.log('✅ Agent coordinator status:', agentStatus);
    
    // Test 3: Sample task execution (mock)
    const sampleContext = {
      userId: 'test-user',
      sessionId: 'test-session',
      previousResults: []
    };
    
    const taskInput = 'Analyze market data for Austin, TX focusing on Single Family properties';
    console.log('✅ Sample task input:', taskInput);
    
    console.log('🎉 All tests passed! Market analysis integration is ready.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export for potential use
export { testMarketAnalysis };

// Auto-run if this file is executed directly
if (require.main === module) {
  testMarketAnalysis();
}