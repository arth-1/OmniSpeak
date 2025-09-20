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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Activity, Settings, MessageSquare, TrendingUp, Users, Building2, Mail, Calculator, FileText, BarChart3, AlertTriangle, CheckCircle, Search, MapPin, Clock } from 'lucide-react';
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
      // Mock API call
      const mockAgents: Agent[] = [
        {
          id: 'financial',
          name: 'Financial Agent',
          description: 'Analyzes client financials, calculates mortgage eligibility, and generates documents.',
          isActive: true,
          lastUsed: new Date().toISOString(),
          usageCount: 45
        },
        {
          id: 'property-project',
          name: 'Property Project Agent',
          description: 'Manages project-specific tasks like demand letters, client matching, and analytics.',
          isActive: true,
          lastUsed: new Date(Date.now() - 86400000).toISOString(),
          usageCount: 68
        },
        {
          id: 'market',
          name: 'Market Analysis Agent',
          description: 'Scrapes and analyzes live market data for property valuations and investment insights.',
          isActive: false,
          lastUsed: new Date(Date.now() - 2 * 86400000).toISOString(),
          usageCount: 22
        }
      ];
      setAgents(mockAgents);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      // Mock API call
      const mockTasks: Task[] = [
        {
          id: 'task-1',
          agentId: 'financial',
          input: 'Mortgage Qualification for client with 100000 annual income',
          status: 'completed',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'task-2',
          agentId: 'property-project',
          input: 'Send demand letters for Metro Plaza project',
          status: 'processing',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          id: 'task-3',
          agentId: 'market',
          input: 'Analyze investment opportunity in Austin, TX',
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      ];
      setTasks(mockTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const toggleAgent = async (agentId: string, isActive: boolean) => {
    // Mock API call to toggle agent status
    setAgents(agents.map(a => a.id === agentId ? { ...a, isActive, lastUsed: new Date().toISOString() } : a));
  };

  const executeTask = async () => {
    if (!selectedTask) return;

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
      // Mock API call for task execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResult = {
        success: true,
        result: {
          message: `Task "${finalTask}" has been completed by the ${selectedTask.agent} agent. A detailed report has been generated and sent to your email.`,
          confidence: 0.95,
          actions: [
            { type: 'report_generated' },
            { type: 'emails_sent', data: { totalSent: 12 } }
          ],
          nextSteps: [
            'Review the generated report for key insights.',
            'Follow up with high-priority clients identified in the report.',
            'Schedule a meeting with the project team to discuss next steps.'
          ]
        }
      };
      setTaskResult(mockResult.result);
      setShowResult(true);
      fetchTasks();
      setSelectedTask(null);
      setTaskInputs({});
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
    alert('Mock workflow setup triggered!');
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-800 text-yellow-200 border-yellow-700',
      processing: 'bg-blue-800 text-blue-200 border-blue-700',
      completed: 'bg-green-800 text-green-200 border-green-700',
      failed: 'bg-red-800 text-red-200 border-red-700'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-slate-700 text-slate-200 border-slate-600';
  };

  const getAgentIcon = (agentId: string) => {
    const icons = {
      'financial': TrendingUp,
      'property-project': Building2,
      'market': BarChart3,
      'default': Bot
    };
    const IconComponent = icons[agentId as keyof typeof icons] || icons.default;
    return <IconComponent className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 bg-slate-950 text-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-slate-950 text-white min-h-screen font-sans">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">AI Agent Management</h1>
        <Button onClick={setupDemandLetterWorkflow} className="bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600">
          <Settings className="mr-2 h-4 w-4" />
          Setup Auto Workflows
        </Button>
      </header>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="bg-slate-900 border-slate-800 grid w-full md:w-fit grid-cols-3">
          <TabsTrigger value="agents" className="data-[state=active]:bg-slate-800 text-white">Active Agents</TabsTrigger>
          <TabsTrigger value="execute" className="data-[state=active]:bg-slate-800 text-white">Execute Task</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-slate-800 text-white">Task History</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.id} className="bg-slate-900 border-slate-800 text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="bg-primary/10 p-2 rounded-full text-sky-400">{getAgentIcon(agent.id)}</div>
                      <CardTitle className="text-lg text-white">{agent.name}</CardTitle>
                    </div>
                    <Switch
                      checked={agent.isActive}
                      onCheckedChange={(checked) => toggleAgent(agent.id, checked)}
                    />
                  </div>
                  <CardDescription className="text-slate-400">{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge className={`text-xs font-semibold ${agent.isActive ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'}`}>
                        {agent.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Usage Count:</span>
                      <span className="font-medium text-white">{agent.usageCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Used:</span>
                      <span className="font-medium text-white">
                        {new Date(agent.lastUsed).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="execute" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-sky-400" />
                Execute Agent Task
              </CardTitle>
              <CardDescription className="text-slate-400">
                Choose from predefined real estate automation tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="strategy" className="text-slate-200">Execution Strategy</Label>
                <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="smart-routing">Smart Routing</SelectItem>
                    <SelectItem value="sequential">Sequential Execution</SelectItem>
                    <SelectItem value="parallel">Parallel Execution</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task" className="text-slate-200">Select Task</Label>
                <Select value={selectedTask?.id || ''} onValueChange={handleTaskSelection}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Choose a predefined task..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <div className="px-2 py-1 text-xs font-semibold text-slate-400">Financial Analysis</div>
                    {PREDEFINED_TASKS.filter(t => t.category === 'Financial Analysis').map((task) => (
                      <SelectItem key={task.id} value={task.id} className="focus:bg-slate-700">
                        <div className="flex items-center space-x-2">
                          <task.icon className="h-4 w-4 text-sky-400" />
                          <span>{task.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1 text-xs font-semibold text-slate-400 mt-2">Market Analysis</div>
                    {PREDEFINED_TASKS.filter(t => t.category === 'Market Analysis').map((task) => (
                      <SelectItem key={task.id} value={task.id} className="focus:bg-slate-700">
                        <div className="flex items-center space-x-2">
                          <task.icon className="h-4 w-4 text-teal-400" />
                          <span>{task.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1 text-xs font-semibold text-slate-400 mt-2">Project Management</div>
                    {PREDEFINED_TASKS.filter(t => t.category === 'Project Management').map((task) => (
                      <SelectItem key={task.id} value={task.id} className="focus:bg-slate-700">
                        <div className="flex items-center space-x-2">
                          <task.icon className="h-4 w-4 text-purple-400" />
                          <span>{task.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTask && (
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-start space-x-3">
                    <selectedTask.icon className="h-5 w-5 text-sky-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">{selectedTask.title}</h4>
                      <p className="text-sm text-slate-400 mt-1">{selectedTask.description}</p>
                      <div className="mt-2 text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded w-fit">
                        Agent: {selectedTask.agent === 'financial' ? 'Financial Agent' : selectedTask.agent === 'property-project' ? 'Property Project Agent' : 'Market Analysis Agent'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTask?.requiresInput && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-200">Task Parameters</Label>
                  {selectedTask.requiresInput.map((input) => (
                    <div key={input.name} className="space-y-2">
                      <Label htmlFor={input.name} className="text-sm text-slate-400">
                        {input.name.charAt(0).toUpperCase() + input.name.slice(1)}
                      </Label>
                      {input.type === 'select' ? (
                        <Select
                          value={taskInputs[input.name] || ''}
                          onValueChange={(value) => handleInputChange(input.name, value)}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue placeholder={`Select ${input.name}...`} />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 text-white">
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
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
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
                  className="flex-1 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600"
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
                  {selectedTask && selectedTask.category === 'Market Analysis' ? (
                    <MarketVisualizationDashboard
                      result={taskResult}
                      taskId={selectedTask.id}
                    />
                  ) : (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <h4 className="font-semibold text-white">Task Completed Successfully</h4>
                        <Badge className="ml-auto bg-slate-700 text-slate-300 border-slate-600">
                          {Math.round(taskResult.confidence * 100)}% Confidence
                        </Badge>
                      </div>

                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm text-slate-300 bg-slate-900 p-3 rounded border border-slate-700">
                          {taskResult.message}
                        </div>
                      </div>

                      {taskResult.actions && taskResult.actions.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-semibold text-white mb-2">Actions Completed:</h5>
                          <div className="space-y-2">
                            {taskResult.actions.map((action: any, index: number) => (
                              <div key={index} className="flex items-center space-x-2 text-sm text-slate-400">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>{action.type}</span>
                                {action.type === 'emails_sent' && action.data && (
                                  <Badge className="ml-auto bg-slate-700 text-slate-300 border-slate-600">
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
                          <h5 className="font-semibold text-white mb-2">Recommended Next Steps:</h5>
                          <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
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
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-purple-400" />
                Task History
              </CardTitle>
              <CardDescription className="text-slate-400">Recent agent executions and their results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">
                    No tasks executed yet. Try executing a task above!
                  </p>
                ) : (
                  tasks.slice(0, 10).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="bg-primary/10 p-2 rounded-full text-white flex-shrink-0">
                          {getAgentIcon(task.agentId)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{task.input}</p>
                          <p className="text-sm text-slate-400 truncate">
                            Agent: {task.agentId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm flex-shrink-0">
                        <Badge className={`font-semibold ${getStatusBadge(task.status)}`}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                        <div className="flex items-center space-x-1 text-slate-400">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(task.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
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