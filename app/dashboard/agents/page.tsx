'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, Activity, Settings, MessageSquare, TrendingUp, Users, Building2, Mail, Calculator, FileText, BarChart3, AlertTriangle, CheckCircle, Search, MapPin } from 'lucide-react';
import MarketVisualizationDashboard from '@/components/charts/market-visualization-dashboard';

interface Agent {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  lastUsed: string;
  usageCount: number;
}

interface Task {
  id: string;
  agentId: string;
  input: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

interface PredefinedTask {
  id: string;
  category: string;
  icon: any;
  title: string;
  description: string;
  task: string;
  agent: string;
  requiresInput?: {
    name: string;
    type: 'text' | 'number' | 'select';
    options?: string[];
    placeholder?: string;
  }[];
}

// Predefined tasks configuration
const PREDEFINED_TASKS: PredefinedTask[] = [
  // Financial Agent Tasks
  {
    id: 'mortgage-qualification',
    category: 'Financial Analysis',
    icon: Calculator,
    title: 'Mortgage Qualification',
    description: 'Calculate mortgage qualification for a client',
    task: 'Calculate mortgage qualification for client with ${income} annual income and ${debt} monthly debt',
    agent: 'financial',
    requiresInput: [
      { name: 'income', type: 'number', placeholder: 'Annual income (e.g., 80000)' },
      { name: 'debt', type: 'number', placeholder: 'Monthly debt (e.g., 500)' }
    ]
  },
  {
    id: 'investment-analysis',
    category: 'Financial Analysis',
    icon: TrendingUp,
    title: 'Investment Property Analysis',
    description: 'Analyze investment potential for a property',
    task: 'Analyze investment potential for ${bedrooms}-bedroom unit priced at $${price} with expected rent of $${rent}',
    agent: 'financial',
    requiresInput: [
      { name: 'bedrooms', type: 'select', options: ['1', '2', '3', '4+'] },
      { name: 'price', type: 'number', placeholder: 'Property price (e.g., 450000)' },
      { name: 'rent', type: 'number', placeholder: 'Expected monthly rent (e.g., 2800)' }
    ]
  },
  {
    id: 'preapproval-letter',
    category: 'Financial Analysis',
    icon: FileText,
    title: 'Pre-approval Letter',
    description: 'Generate pre-approval letter for qualified client',
    task: 'Generate pre-approval letter for qualified client with $${budget} budget',
    agent: 'financial',
    requiresInput: [
      { name: 'budget', type: 'number', placeholder: 'Approved budget (e.g., 400000)' }
    ]
  },
  {
    id: 'refinancing-analysis',
    category: 'Financial Analysis',
    icon: BarChart3,
    title: 'Refinancing Opportunity',
    description: 'Check refinancing opportunities for existing loan',
    task: 'Check refinancing opportunity for current loan with ${currentRate}% interest rate and ${balance} remaining balance',
    agent: 'financial',
    requiresInput: [
      { name: 'currentRate', type: 'number', placeholder: 'Current rate (e.g., 6.5)' },
      { name: 'balance', type: 'number', placeholder: 'Remaining balance (e.g., 350000)' }
    ]
  },
  // Property Project Agent Tasks
  {
    id: 'demand-letters-milestone',
    category: 'Project Management',
    icon: Mail,
    title: 'Construction Milestone Letters',
    description: 'Send demand letters about construction progress',
    task: 'Send demand letters to all clients about new construction milestone completion at ${project} project',
    agent: 'property-project',
    requiresInput: [
      { name: 'project', type: 'select', options: ['Sunset Towers', 'Metro Plaza', 'Downtown Heights', 'Riverside Commons'] }
    ]
  },
  {
    id: 'demand-letters-floor',
    category: 'Project Management',
    icon: Building2,
    title: 'Floor Completion Letters',
    description: 'Send demand letters about new floor completion',
    task: 'Send demand letters to all clients about new floor completion at ${project} project',
    agent: 'property-project',
    requiresInput: [
      { name: 'project', type: 'select', options: ['Sunset Towers', 'Metro Plaza', 'Downtown Heights', 'Riverside Commons'] }
    ]
  },
  {
    id: 'demand-letters-price',
    category: 'Project Management',
    icon: TrendingUp,
    title: 'Price Update Letters',
    description: 'Send price update notifications to clients',
    task: 'Send demand letters to all clients about price updates at ${project} project',
    agent: 'property-project',
    requiresInput: [
      { name: 'project', type: 'select', options: ['Sunset Towers', 'Metro Plaza', 'Downtown Heights', 'Riverside Commons'] }
    ]
  },
  {
    id: 'client-matching',
    category: 'Project Management',
    icon: Users,
    title: 'Client Unit Matching',
    description: 'Match available units to interested clients',
    task: 'Match available units to interested clients based on preferences for ${project} project',
    agent: 'property-project',
    requiresInput: [
      { name: 'project', type: 'select', options: ['Sunset Towers', 'Metro Plaza', 'Downtown Heights', 'Riverside Commons'] }
    ]
  },
  {
    id: 'project-analytics',
    category: 'Project Management',
    icon: BarChart3,
    title: 'Project Analytics Report',
    description: 'Generate comprehensive project analytics',
    task: 'Generate comprehensive analytics report for ${project} project performance',
    agent: 'property-project',
    requiresInput: [
      { name: 'project', type: 'select', options: ['Sunset Towers', 'Metro Plaza', 'Downtown Heights', 'Riverside Commons'] }
    ]
  },
  {
    id: 'final-units-alert',
    category: 'Project Management',
    icon: AlertTriangle,
    title: 'Final Units Alert',
    description: 'Send final units availability alerts',
    task: 'Send demand letters about final units availability at ${project} project',
    agent: 'property-project',
    requiresInput: [
      { name: 'project', type: 'select', options: ['Sunset Towers', 'Metro Plaza', 'Downtown Heights', 'Riverside Commons'] }
    ]
  },
  
  // Market Analysis Agent Tasks
  {
    id: 'scrape-market-data',
    category: 'Market Analysis',
    icon: Search,
    title: 'Real-time Market Data',
    description: 'Scrape and analyze live market data from multiple sources',
    task: 'Scrape and analyze real-time market data for ${location} focusing on ${propertyType} properties',
    agent: 'market',
    requiresInput: [
      { name: 'location', type: 'text', placeholder: 'City, State (e.g., Austin, TX)' },
      { name: 'propertyType', type: 'select', options: ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'All Types'] }
    ]
  },
  {
    id: 'investment-opportunity',
    category: 'Market Analysis',
    icon: TrendingUp,
    title: 'Investment Opportunity Analysis',
    description: 'Analyze investment opportunities with real-time data',
    task: 'Analyze investment opportunity for property at ${address} with budget of $${budget}',
    agent: 'market',
    requiresInput: [
      { name: 'address', type: 'text', placeholder: 'Property address or area' },
      { name: 'budget', type: 'number', placeholder: 'Investment budget (e.g., 500000)' }
    ]
  },
  {
    id: 'compare-markets',
    category: 'Market Analysis',
    icon: BarChart3,
    title: 'Multi-Market Comparison',
    description: 'Compare multiple markets with live data',
    task: 'Compare markets: ${locations} focusing on ${criteria}',
    agent: 'market',
    requiresInput: [
      { name: 'locations', type: 'text', placeholder: 'Cities separated by commas (e.g., Austin TX, Dallas TX, Houston TX)' },
      { name: 'criteria', type: 'select', options: ['Price Growth', 'Rental Yield', 'Population Growth', 'Job Market', 'All Factors'] }
    ]
  },
  {
    id: 'rental-market-analysis',
    category: 'Market Analysis',
    icon: Building2,
    title: 'Rental Market Analysis',
    description: 'Analyze rental yields and market conditions',
    task: 'Analyze rental market for ${propertyType} properties in ${location}',
    agent: 'market',
    requiresInput: [
      { name: 'location', type: 'text', placeholder: 'City, State (e.g., Miami, FL)' },
      { name: 'propertyType', type: 'select', options: ['Studio', '1 Bedroom', '2 Bedroom', '3+ Bedroom', 'All Types'] }
    ]
  },
  {
    id: 'market-trend-prediction',
    category: 'Market Analysis',
    icon: TrendingUp,
    title: 'Market Trend Predictions',
    description: 'Predict future market trends using live data',
    task: 'Predict market trends for ${location} over ${timeframe}',
    agent: 'market',
    requiresInput: [
      { name: 'location', type: 'text', placeholder: 'City, State (e.g., Seattle, WA)' },
      { name: 'timeframe', type: 'select', options: ['3 months', '6 months', '1 year', '2 years', '5 years'] }
    ]
  },
  {
    id: 'property-valuation',
    category: 'Market Analysis',
    icon: MapPin,
    title: 'Real-time Property Valuation',
    description: 'Estimate property values using comparative market analysis',
    task: 'Estimate property value for ${address} with details: ${propertyDetails}',
    agent: 'market',
    requiresInput: [
      { name: 'address', type: 'text', placeholder: 'Full property address' },
      { name: 'propertyDetails', type: 'text', placeholder: 'Bedrooms, bathrooms, sq ft, year built (e.g., 3bd/2ba, 1800 sqft, built 2010)' }
    ]
  }
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskInput, setTaskInput] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('smart-routing');
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedTask, setSelectedTask] = useState<PredefinedTask | null>(null);
  const [taskInputs, setTaskInputs] = useState<Record<string, string>>({});
  const [taskResult, setTaskResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetchAgents();
    fetchTasks();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      if (data.success) {
        setAgents(data.agents);
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/agents/tasks');
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const toggleAgent = async (agentId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isActive ? 'activate' : 'deactivate' })
      });

      if (response.ok) {
        fetchAgents(); // Refresh agents list
      }
    } catch (error) {
      console.error('Failed to toggle agent:', error);
    }
  };

  const executeTask = async () => {
    if (!selectedTask) return;

    // Build task string with user inputs
    let finalTask = selectedTask.task;
    if (selectedTask.requiresInput) {
      for (const input of selectedTask.requiresInput) {
        const value = taskInputs[input.name] || '';
        finalTask = finalTask.replace(`\${${input.name}}`, value);
      }
    }

    setIsExecuting(true);
    setShowResult(false);
    
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: finalTask,
          context: {
            sessionId: `session-${Date.now()}`,
            conversationHistory: [],
            userId: 'demo-user'
          },
          strategy: selectedStrategy
        })
      });

      const data = await response.json();
      if (data.success) {
        setTaskResult(data.result);
        setShowResult(true);
        fetchTasks(); // Refresh task history
        // Reset form
        setSelectedTask(null);
        setTaskInputs({});
      } else {
        alert('Task execution failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to execute task:', error);
      alert('Failed to execute task');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleTaskSelection = (taskId: string) => {
    const task = PREDEFINED_TASKS.find(t => t.id === taskId);
    setSelectedTask(task || null);
    setTaskInputs({});
    setShowResult(false);
  };

  const handleInputChange = (inputName: string, value: string) => {
    setTaskInputs(prev => ({
      ...prev,
      [inputName]: value
    }));
  };

  const isTaskReady = () => {
    if (!selectedTask) return false;
    if (!selectedTask.requiresInput) return true;
    
    return selectedTask.requiresInput.every(input => {
      const value = taskInputs[input.name];
      return value && value.trim() !== '';
    });
  };

  const setupDemandLetterWorkflow = async () => {
    try {
      const response = await fetch('/api/agents/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Construction Milestone Demand Letters',
          trigger: 'construction_milestone',
          agents: ['property-project'],
          schedule: 'daily'
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Automated demand letter workflow setup successfully!');
      }
    } catch (error) {
      console.error('Failed to setup workflow:', error);
      alert('Failed to setup workflow');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  const getAgentIcon = (agentId: string) => {
    const icons = {
      'financial': TrendingUp,
      'property-project': Building2,
      'default': Bot
    };
    const IconComponent = icons[agentId as keyof typeof icons] || icons.default;
    return <IconComponent className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Agent Management</h1>
          <p className="text-muted-foreground">
            Manage and coordinate your AI agents for real estate automation
          </p>
        </div>
        <Button onClick={setupDemandLetterWorkflow} className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Settings className="mr-2 h-4 w-4" />
          Setup Auto Workflows
        </Button>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">Active Agents</TabsTrigger>
          <TabsTrigger value="execute">Execute Task</TabsTrigger>
          <TabsTrigger value="history">Task History</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.id} className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getAgentIcon(agent.id)}
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                    </div>
                    <Switch
                      checked={agent.isActive}
                      onCheckedChange={(checked) => toggleAgent(agent.id, checked)}
                    />
                  </div>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={agent.isActive ? "default" : "secondary"}>
                        {agent.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Usage Count:</span>
                      <span className="font-medium">{agent.usageCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Used:</span>
                      <span className="font-medium">
                        {new Date(agent.lastUsed).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="execute" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Execute Agent Task
              </CardTitle>
              <CardDescription>
                Choose from predefined real estate automation tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="strategy">Execution Strategy</Label>
                <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smart-routing">Smart Routing</SelectItem>
                    <SelectItem value="sequential">Sequential Execution</SelectItem>
                    <SelectItem value="parallel">Parallel Execution</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task">Select Task</Label>
                <Select value={selectedTask?.id || ''} onValueChange={handleTaskSelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a predefined task..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Financial Analysis</div>
                    {PREDEFINED_TASKS.filter(t => t.category === 'Financial Analysis').map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        <div className="flex items-center space-x-2">
                          <task.icon className="h-4 w-4" />
                          <span>{task.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-2">Market Analysis</div>
                    {PREDEFINED_TASKS.filter(t => t.category === 'Market Analysis').map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        <div className="flex items-center space-x-2">
                          <task.icon className="h-4 w-4" />
                          <span>{task.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-2">Project Management</div>
                    {PREDEFINED_TASKS.filter(t => t.category === 'Project Management').map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        <div className="flex items-center space-x-2">
                          <task.icon className="h-4 w-4" />
                          <span>{task.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTask && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <selectedTask.icon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">{selectedTask.title}</h4>
                      <p className="text-sm text-blue-700 mt-1">{selectedTask.description}</p>
                      <div className="mt-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Agent: {selectedTask.agent === 'financial' ? 'Financial Agent' : 'Property Project Agent'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTask?.requiresInput && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Task Parameters</Label>
                  {selectedTask.requiresInput.map((input) => (
                    <div key={input.name} className="space-y-2">
                      <Label htmlFor={input.name} className="text-sm">
                        {input.name.charAt(0).toUpperCase() + input.name.slice(1)}
                      </Label>
                      {input.type === 'select' ? (
                        <Select 
                          value={taskInputs[input.name] || ''} 
                          onValueChange={(value) => handleInputChange(input.name, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${input.name}...`} />
                          </SelectTrigger>
                          <SelectContent>
                            {input.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={input.name}
                          type={input.type}
                          placeholder={input.placeholder}
                          value={taskInputs[input.name] || ''}
                          onChange={(e) => handleInputChange(input.name, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  onClick={executeTask} 
                  disabled={isExecuting || !isTaskReady()}
                  className="flex-1"
                >
                  {isExecuting ? (
                    <>
                      <Activity className="mr-2 h-4 w-4 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Execute Task
                    </>
                  )}
                </Button>
              </div>

              {showResult && taskResult && (
                <div className="mt-6 space-y-4">
                  {/* Check if this is a market analysis task */}
                  {selectedTask && selectedTask.category === 'Market Analysis' ? (
                    <MarketVisualizationDashboard 
                      result={taskResult} 
                      taskId={selectedTask.id} 
                    />
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-green-900">Task Completed Successfully</h4>
                        <Badge variant="secondary" className="ml-auto">
                          {Math.round(taskResult.confidence * 100)}% Confidence
                        </Badge>
                      </div>
                      
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm text-gray-800 bg-white p-3 rounded border">
                          {taskResult.message}
                        </div>
                      </div>

                      {taskResult.actions && taskResult.actions.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-semibold text-green-900 mb-2">Actions Completed:</h5>
                          <div className="space-y-2">
                            {taskResult.actions.map((action: any, index: number) => (
                              <div key={index} className="flex items-center space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>{action.type}</span>
                                {action.type === 'emails_sent' && action.data && (
                                  <Badge variant="outline" className="ml-auto">
                                    {action.data.totalSent} emails sent
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {taskResult.nextSteps && taskResult.nextSteps.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-semibold text-green-900 mb-2">Recommended Next Steps:</h5>
                          <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                            {taskResult.nextSteps.map((step: string, index: number) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Task History
              </CardTitle>
              <CardDescription>Recent agent executions and their results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No tasks executed yet. Try executing a task above!
                  </p>
                ) : (
                  tasks.slice(0, 10).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{task.input}</p>
                        <p className="text-sm text-muted-foreground">
                          Agent: {task.agentId} • {new Date(task.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge className={getStatusBadge(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}