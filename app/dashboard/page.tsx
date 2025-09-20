"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, MessageSquare, Users, BarChart3, TrendingUp, Clock, Lightbulb } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Type Definitions ---
interface ChartData {
  name: string;
  value: number;
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
}

// --- Sample Data ---
const clientInteractionsData: ChartData[] = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 19 },
  { name: 'Mar', value: 15 },
  { name: 'Apr', value: 27 },
  { name: 'May', value: 32 },
  { name: 'Jun', value: 24 },
  { name: 'Jul', value: 38 },
];

// --- Reusable Components within the file ---
const ActivityItem = ({ icon, title, description, timestamp }: ActivityItemProps) => {
  return (
    <div className="flex items-center space-x-4 p-3 hover:bg-slate-800 transition-colors rounded-lg">
      <div className="bg-primary/10 p-2 rounded-full flex-shrink-0 text-white">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none truncate text-white">{title}</p>
        <p className="text-sm text-slate-400 truncate">{description}</p>
      </div>
      <div className="flex items-center space-x-1 text-xs text-slate-400 flex-shrink-0">
        <Clock className="h-3 w-3" />
        <span>{timestamp}</span>
      </div>
    </div>
  );
};

const ClientChart = ({ data }: { data: ChartData[] }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-600 opacity-50" />
        <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
          labelStyle={{ color: '#ffffff' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#14b8a6"
          fill="url(#colorUv)"
          strokeWidth={2}
        />
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  );
};

// --- Main Dashboard Component ---
export default function DashboardPage() {
  return (
    <div className="space-y-8 p-6 bg-slate-950 text-white min-h-screen font-sans">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">AI Sales Dashboard</h1>
        <p className="text-sm text-slate-400 hidden md:block">
          Welcome back, your AI assistant is ready to help.
        </p>
      </header>
      
      {/* Key Metrics Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Projects</CardTitle>
            <Building2 className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-green-400">+2 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">48</div>
            <p className="text-xs text-green-400">+5 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">AI Interactions</CardTitle>
            <MessageSquare className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">342</div>
            <p className="text-xs text-green-400">+18% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Lead Score Avg.</CardTitle>
            <BarChart3 className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7.2</div>
            <p className="text-xs text-green-400">+0.3 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-900 border-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800 text-white">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-800 text-white">Analytics</TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-slate-800 text-white">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            {/* Client Interactions Chart */}
            <Card className="col-span-4 bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Client Interactions</CardTitle>
                <CardDescription className="text-slate-400">
                  AI and human interactions with clients over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientChart data={clientInteractionsData} />
              </CardContent>
            </Card>

            {/* Recent Activity & AI Insights */}
            <Card className="col-span-3 bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity & Insights</CardTitle>
                <CardDescription className="text-slate-400">
                  Latest client interactions and AI-generated insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <ActivityItem
                    icon={<Lightbulb className="h-4 w-4 text-teal-400" />}
                    title="AI Insight: High-Value Lead"
                    description="John Smith's recent activity suggests he's ready to buy. Consider a follow-up call."
                    timestamp="Just now"
                  />
                  <ActivityItem
                    icon={<MessageSquare className="h-4 w-4 text-sky-400" />}
                    title="New message from John Smith"
                    description="Regarding property viewing on Friday"
                    timestamp="2 hours ago"
                  />
                  <ActivityItem
                    icon={<TrendingUp className="h-4 w-4 text-green-400" />}
                    title="Lead score increased"
                    description="Sarah Johnson's lead score is now 8.5"
                    timestamp="5 hours ago"
                  />
                  <ActivityItem
                    icon={<Building2 className="h-4 w-4 text-blue-400" />}
                    title="New property added"
                    description="123 Main St. has been added to your listings"
                    timestamp="Yesterday"
                  />
                  <ActivityItem
                    icon={<Users className="h-4 w-4 text-purple-400" />}
                    title="New client registered"
                    description="Michael Brown has registered through the website"
                    timestamp="2 days ago"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab (placeholder) */}
        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Analytics</CardTitle>
              <CardDescription className="text-slate-400">
                Detailed analytics will be displayed here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white">Analytics content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab (placeholder) */}
        <TabsContent value="reports" className="space-y-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Reports</CardTitle>
              <CardDescription className="text-slate-400">
                Generated reports will be displayed here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white">Reports content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}