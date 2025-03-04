"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Search, ArrowUpRight, ArrowDownRight, TrendingUp, MessageSquare, Calendar, Phone, Mail } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  score: number;
  previousScore?: number;
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "closed";
  source: "website" | "referral" | "social" | "event" | "other";
  lastContact: Date;
  interactions: number;
  avatar?: string;
}

const mockLeads: Lead[] = [
  {
    id: "L-1001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    score: 8.5,
    previousScore: 8.2,
    status: "qualified",
    source: "website",
    lastContact: new Date(2025, 3, 15),
    interactions: 12,
  },
  {
    id: "L-1002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 234-5678",
    score: 7.2,
    previousScore: 7.5,
    status: "contacted",
    source: "referral",
    lastContact: new Date(2025, 3, 14),
    interactions: 5,
  },
  {
    id: "L-1003",
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "(555) 345-6789",
    score: 9.1,
    previousScore: 8.8,
    status: "proposal",
    source: "website",
    lastContact: new Date(2025, 3, 12),
    interactions: 18,
  },
  {
    id: "L-1004",
    name: "Jennifer Lee",
    email: "jennifer.l@example.com",
    phone: "(555) 456-7890",
    score: 5.8,
    previousScore: 5.8,
    status: "new",
    source: "social",
    lastContact: new Date(2025, 3, 16),
    interactions: 2,
  },
  {
    id: "L-1005",
    name: "Robert Garcia",
    email: "robert.g@example.com",
    phone: "(555) 567-8901",
    score: 8.0,
    previousScore: 7.6,
    status: "negotiation",
    source: "event",
    lastContact: new Date(2025, 3, 10),
    interactions: 15,
  },
  {
    id: "L-1006",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "(555) 678-9012",
    score: 7.5,
    previousScore: 7.2,
    status: "contacted",
    source: "website",
    lastContact: new Date(2025, 3, 8),
    interactions: 7,
  },
  {
    id: "L-1007",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "(555) 789-0123",
    score: 8.7,
    previousScore: 8.5,
    status: "qualified",
    source: "referral",
    lastContact: new Date(2025, 3, 7),
    interactions: 14,
  },
  {
    id: "L-1008",
    name: "Jessica Martinez",
    email: "jessica.m@example.com",
    phone: "(555) 890-1234",
    score: 6.2,
    previousScore: 6.5,
    status: "new",
    source: "social",
    lastContact: new Date(2025, 3, 16),
    interactions: 3,
  },
];

const scoreHistoryData = [
  { month: 'Jan', score: 6.8 },
  { month: 'Feb', score: 7.1 },
  { month: 'Mar', score: 7.3 },
  { month: 'Apr', score: 7.6 },
  { month: 'May', score: 7.8 },
  { month: 'Jun', score: 7.5 },
  { month: 'Jul', score: 7.9 },
];

const leadSourceData = [
  { name: 'Website', value: 45 },
  { name: 'Referral', value: 30 },
  { name: 'Social', value: 15 },
  { name: 'Event', value: 8 },
  { name: 'Other', value: 2 },
];

const leadStatusData = [
  { name: 'New', value: 12 },
  { name: 'Contacted', value: 18 },
  { name: 'Qualified', value: 22 },
  { name: 'Proposal', value: 15 },
  { name: 'Negotiation', value: 8 },
  { name: 'Closed', value: 25 },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredLeads = leads.filter((lead) => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.includes(searchQuery)
  );
  
  // Sort leads by score (highest first)
  const sortedLeads = [...filteredLeads].sort((a, b) => b.score - a.score);
  
  const highLeads = sortedLeads.filter(l => l.score >= 8.0);
  const mediumLeads = sortedLeads.filter(l => l.score >= 6.0 && l.score < 8.0);
  const lowLeads = sortedLeads.filter(l => l.score < 6.0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Lead Scoring</h2>
          <p className="text-muted-foreground">
            Analyze and prioritize your leads based on AI-powered scoring
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Lead Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.6</div>
            <p className="text-xs text-muted-foreground">+0.3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Potential Leads</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highLeads.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-muted-foreground">+2.4% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead Score Trends</CardTitle>
            <CardDescription>
              Average lead score over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={scoreHistoryData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Lead Distribution</CardTitle>
            <CardDescription>
              Breakdown by source and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="source">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="source">By Source</TabsTrigger>
                <TabsTrigger value="status">By Status</TabsTrigger>
              </TabsList>
              <TabsContent value="source" className="pt-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={leadSourceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="status" className="pt-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={leadStatusData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--chart-3))" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Prioritized Leads</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search leads..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All Leads ({sortedLeads.length})
            </TabsTrigger>
            <TabsTrigger value="high">
              High Potential ({highLeads.length})
            </TabsTrigger>
            <TabsTrigger value="medium">
              Medium Potential ({mediumLeads.length})
            </TabsTrigger>
            <TabsTrigger value="low">
              Low Potential ({lowLeads.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <LeadTable leads={sortedLeads} />
          </TabsContent>
          
          <TabsContent value="high" className="mt-6">
            <LeadTable leads={highLeads} />
          </TabsContent>
          
          <TabsContent value="medium" className="mt-6">
            <LeadTable leads={mediumLeads} />
          </TabsContent>
          
          <TabsContent value="low" className="mt-6">
            <LeadTable leads={lowLeads} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface LeadTableProps {
  leads: Lead[];
}

function LeadTable({ leads }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No leads found</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left font-medium">Name</th>
              <th className="h-12 px-4 text-left font-medium">Score</th>
              <th className="h-12 px-4 text-left font-medium">Status</th>
              <th className="h-12 px-4 text-left font-medium">Source</th>
              <th className="h-12 px-4 text-left font-medium">Last Contact</th>
              <th className="h-12 px-4 text-left font-medium">Interactions</th>
              <th className="h-12 px-4 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-muted/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(lead.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getScoreBadgeVariant(lead.score)}>
                      {lead.score.toFixed(1)}
                    </Badge>
                    {lead.previousScore !== undefined && (
                      <ScoreChange current={lead.score} previous={lead.previousScore} />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="p-4">
                  <SourceBadge source={lead.source} />
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(lead.lastContact)}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Progress value={(lead.interactions / 20) * 100} className="h-2 w-16" />
                    <span>{lead.interactions}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button size="sm">View</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ScoreChangeProps {
  current: number;
  previous: number;
}

function ScoreChange({ current, previous }: ScoreChangeProps) {
  const diff = current - previous;
  const isPositive = diff > 0;
  const isNeutral = diff === 0;
  
  return (
    <div className={`flex items-center text-xs ${isPositive ? 'text-emerald-500' : isNeutral ? 'text-muted-foreground' : 'text-red-500'}`}>
      {isPositive ? (
        <ArrowUpRight className="h-3 w-3 mr-1" />
      ) : isNeutral ? (
        <span className="mx-1">—</span>
      ) : (
        <ArrowDownRight className="h-3 w-3 mr-1" />
      )}
      <span>{Math.abs(diff).toFixed(1)}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: Lead["status"] }) {
  const statusConfig = {
    "new": { label: "New", variant: "default" },
    "contacted": { label: "Contacted", variant: "secondary" },
    "qualified": { label: "Qualified", variant: "outline" },
    "proposal": { label: "Proposal", variant: "default" },
    "negotiation": { label: "Negotiation", variant: "secondary" },
    "closed": { label: "Closed", variant: "outline" },
  };
  
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant as any}>
      {config.label}
    </Badge>
  );
}

function SourceBadge({ source }: { source: Lead["source"] }) {
  const sourceConfig = {
    "website": { label: "Website", variant: "default" },
    "referral": { label: "Referral", variant: "secondary" },
    "social": { label: "Social", variant: "outline" },
    "event": { label: "Event", variant: "default" },
    "other": { label: "Other", variant: "secondary" },
  };
  
  const config = sourceConfig[source];
  
  return (
    <Badge variant={config.variant as any}>
      {config.label}
    </Badge>
  );
}

function getScoreBadgeVariant(score: number): "default" | "secondary" | "outline" | "destructive" {
  if (score >= 8.0) return "default";
  if (score >= 6.0) return "secondary";
  if (score >= 4.0) return "outline";
  return "destructive";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}