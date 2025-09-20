"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Not used but kept for completeness
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, ArrowUpRight, ArrowDownRight, TrendingUp, MessageSquare, Calendar, Phone, Mail, PlusCircle, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Label } from "@/components/ui/label"; // Added missing import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added missing import
import { Separator } from "@/components/ui/separator"; // Added missing import
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // Added missing import
import { useToast } from "@/hooks/use-toast";

// -----------------------------------------------------------------------------
// Data Types, Schema & Hooks
// -----------------------------------------------------------------------------

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  score: z.number().min(0).max(10),
  status: z.enum(["new", "contacted", "qualified", "proposal", "negotiation", "closed"]),
  source: z.enum(["website", "referral", "social", "event", "other"]),
  interactions: z.number().min(0),
  lastContact: z.date(),
  avatar: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  score: number;
  previousScore?: number;
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "closed";
  source: "website" | "referral" | "social" | "event" | "other";
  lastContact: string; // ISO date string
  interactions: number;
  avatar?: string;
};

const mockLeads: Lead[] = [
  { id: "L-1001", name: "John Smith", email: "john.smith@example.com", phone: "(555) 123-4567", score: 8.5, previousScore: 8.2, status: "qualified", source: "website", lastContact: new Date(2025, 3, 15).toISOString(), interactions: 12, avatar: "https://i.pravatar.cc/150?u=1001" },
  { id: "L-1002", name: "Sarah Johnson", email: "sarah.j@example.com", phone: "(555) 234-5678", score: 7.2, previousScore: 7.5, status: "contacted", source: "referral", lastContact: new Date(2025, 3, 14).toISOString(), interactions: 5, avatar: "https://i.pravatar.cc/150?u=1002" },
  { id: "L-1003", name: "David Wilson", email: "david.w@example.com", phone: "(555) 345-6789", score: 9.1, previousScore: 8.8, status: "proposal", source: "website", lastContact: new Date(2025, 3, 12).toISOString(), interactions: 18, avatar: "https://i.pravatar.cc/150?u=1003" },
  { id: "L-1004", name: "Jennifer Lee", email: "jennifer.l@example.com", phone: "(555) 456-7890", score: 5.8, previousScore: 5.8, status: "new", source: "social", lastContact: new Date(2025, 3, 16).toISOString(), interactions: 2, avatar: "https://i.pravatar.cc/150?u=1004" },
  { id: "L-1005", name: "Robert Garcia", email: "robert.g@example.com", phone: "(555) 567-8901", score: 8.0, previousScore: 7.6, status: "negotiation", source: "event", lastContact: new Date(2025, 3, 10).toISOString(), interactions: 15, avatar: "https://i.pravatar.cc/150?u=1005" },
  { id: "L-1006", name: "Emily Davis", email: "emily.d@example.com", phone: "(555) 678-9012", score: 7.5, previousScore: 7.2, status: "contacted", source: "website", lastContact: new Date(2025, 3, 8).toISOString(), interactions: 7, avatar: "https://i.pravatar.cc/150?u=1006" },
  { id: "L-1007", name: "Michael Brown", email: "michael.b@example.com", phone: "(555) 789-0123", score: 8.7, previousScore: 8.5, status: "qualified", source: "referral", lastContact: new Date(2025, 3, 7).toISOString(), interactions: 14, avatar: "https://i.pravatar.cc/150?u=1007" },
  { id: "L-1008", name: "Jessica Martinez", email: "jessica.m@example.com", phone: "(555) 890-1234", score: 6.2, previousScore: 6.5, status: "new", source: "social", lastContact: new Date(2025, 3, 16).toISOString(), interactions: 3, avatar: "https://i.pravatar.cc/150?u=1008" },
];

const scoreHistoryData = [
  { month: "Jan", score: 6.8 },
  { month: "Feb", score: 7.1 },
  { month: "Mar", score: 7.3 },
  { month: "Apr", score: 7.6 },
  { month: "May", score: 7.8 },
  { month: "Jun", score: 7.5 },
  { month: "Jul", score: 7.9 },
];

const leadSourceData = [
  { name: "Website", value: 45 },
  { name: "Referral", value: 30 },
  { name: "Social", value: 15 },
  { name: "Event", value: 8 },
  { name: "Other", value: 2 },
];

const leadStatusData = [
  { name: "New", value: 12 },
  { name: "Contacted", value: 18 },
  { name: "Qualified", value: 22 },
  { name: "Proposal", value: 15 },
  { name: "Negotiation", value: 8 },
  { name: "Closed", value: 25 },
];

// Local storage hook for leads
const useLocalStorage = (key: string, initialValue: Lead[]) => {
  const [storedValue, setStoredValue] = useState<Lead[]>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: Lead[] | ((prev: Lead[]) => Lead[])) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Local storage error:", error);
    }
  };
  return [storedValue, setValue] as const;
};

// -----------------------------------------------------------------------------
// Helper Components & Functions
// -----------------------------------------------------------------------------

interface LeadTableProps {
  leads: Lead[];
}

function getInitials(name: string): string {
  return name.split(" ").map((part) => part[0]).join("").toUpperCase();
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getScoreBadgeVariant(score: number): "default" | "secondary" | "outline" | "destructive" | null {
  if (score >= 8.0) return "default";
  if (score >= 6.0) return "secondary";
  if (score >= 4.0) return "outline";
  return "destructive";
}

function ScoreChange({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous;
  const isPositive = diff > 0;
  const isNeutral = diff === 0;
  return (
    <div className={`flex items-center text-xs ${isPositive ? "text-emerald-400" : isNeutral ? "text-zinc-500" : "text-red-400"}`}>
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
    new: { label: "New", className: "bg-teal-600 text-white hover:bg-teal-700" },
    contacted: { label: "Contacted", className: "bg-slate-700 text-white hover:bg-slate-600" },
    qualified: { label: "Qualified", className: "border border-green-400 text-green-400 bg-green-950/20 hover:bg-green-950/30" },
    proposal: { label: "Proposal", className: "bg-orange-600 text-white hover:bg-orange-700" },
    negotiation: { label: "Negotiation", className: "bg-blue-600 text-white hover:bg-blue-700" },
    closed: { label: "Closed", className: "bg-slate-800 text-slate-400 hover:bg-slate-700" },
  };
  const config = statusConfig[status];
  return <Badge className={config.className as any}>{config.label}</Badge>;
}

function SourceBadge({ source }: { source: Lead["source"] }) {
  const sourceConfig = {
    website: { label: "Website", className: "bg-teal-600 text-white hover:bg-teal-700" },
    referral: { label: "Referral", className: "bg-slate-700 text-white hover:bg-slate-600" },
    social: { label: "Social", className: "border border-sky-400 text-sky-400 bg-sky-950/20 hover:bg-sky-950/30" },
    event: { label: "Event", className: "bg-blue-600 text-white hover:bg-blue-700" },
    other: { label: "Other", className: "bg-slate-800 text-slate-400 hover:bg-slate-700" },
  };
  const config = sourceConfig[source];
  return <Badge className={config.className as any}>{config.label}</Badge>;
}

function LeadTable({ leads }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-900 border border-slate-800 rounded-md">
        <p className="text-slate-400">No leads found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-800 bg-slate-900">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-slate-800">
              <th className="h-12 px-4 text-left font-medium text-slate-400">Name</th>
              <th className="h-12 px-4 text-left font-medium text-slate-400">Score</th>
              <th className="h-12 px-4 text-left font-medium text-slate-400">Status</th>
              <th className="h-12 px-4 text-left font-medium text-slate-400">Source</th>
              <th className="h-12 px-4 text-left font-medium text-slate-400">Last Contact</th>
              <th className="h-12 px-4 text-left font-medium text-slate-400">Interactions</th>
              <th className="h-12 px-4 text-left font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-slate-800 hover:bg-slate-800 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 bg-slate-800 border-slate-700">
                      {lead.avatar ? (
                        <AvatarImage src={lead.avatar} alt={lead.name} />
                      ) : (
                        <AvatarFallback className="text-white bg-teal-600">{getInitials(lead.name)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{lead.name}</p>
                      <p className="text-xs text-slate-400">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getScoreBadgeVariant(lead.score)} className="text-xs">
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
                  <div className="flex items-center text-slate-300">
                    <Calendar className="mr-2 h-4 w-4 text-slate-500" />
                    <span>{formatDate(new Date(lead.lastContact))}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Progress value={(lead.interactions / 20) * 100} className="h-2 w-16 bg-slate-700 [&>div]:bg-teal-500" />
                    <span className="text-slate-300">{lead.interactions}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-white">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-white">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">View</Button>
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

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export default function LeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useLocalStorage("leads", mockLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "score" | "lastContact">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      score: 5,
      status: "new",
      source: "website",
      interactions: 0,
      lastContact: new Date(),
      avatar: "",
    },
  });

  const onSubmit = (data: LeadFormData) => {
    const newLead: Lead = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      score: data.score,
      previousScore: data.score,
      status: data.status,
      source: data.source,
      interactions: data.interactions,
      lastContact: data.lastContact.toISOString(),
      avatar: data.avatar || "",
    };
    setLeads((prev) => [newLead, ...prev]);
    reset();
    setDialogOpen(false);
    toast({
      title: "New Lead Created!",
      description: "A new lead has been successfully added to your list.",
    });
  };

  const filteredAndSortedLeads = useMemo(() => {
    let result = leads.filter((lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery)
    );

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "score":
          comparison = a.score - b.score;
          break;
        case "lastContact":
          comparison = new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [leads, searchQuery, sortBy, sortOrder]);


  const highLeads = filteredAndSortedLeads.filter((l) => l.score >= 8.0);
  const mediumLeads = filteredAndSortedLeads.filter((l) => l.score >= 6.0 && l.score < 8.0);
  const lowLeads = filteredAndSortedLeads.filter((l) => l.score < 6.0);

  return (
    <div className="space-y-6 p-6 bg-slate-950 text-white min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Lead Scoring</h2>
          <p className="text-slate-400">
            Analyze and prioritize your leads based on AI-powered scoring
          </p>
        </div>
        <div>
          <Button onClick={() => setDialogOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Lead
          </Button>
        </div>
      </div>

      {/* New Lead Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl bg-slate-900 text-white border-slate-800">
          <DialogHeader className="border-b border-slate-800 pb-4">
            <DialogTitle>New Lead</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Name</Label>
                <Input {...register("name")} placeholder="Name" className="bg-slate-800 text-white border-slate-700 placeholder:text-slate-500" />
                {errors.name && (<p className="text-red-400 text-sm">{errors.name.message}</p>)}
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Email</Label>
                <Input {...register("email")} placeholder="Email" className="bg-slate-800 text-white border-slate-700 placeholder:text-slate-500" />
                {errors.email && (<p className="text-red-400 text-sm">{errors.email.message}</p>)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Phone</Label>
                <Input {...register("phone")} placeholder="Phone" className="bg-slate-800 text-white border-slate-700 placeholder:text-slate-500" />
                {errors.phone && (<p className="text-red-400 text-sm">{errors.phone.message}</p>)}
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Score</Label>
                <Input type="number" {...register("score", { valueAsNumber: true })} placeholder="Score (0-10)" className="bg-slate-800 text-white border-slate-700 placeholder:text-slate-500" />
                {errors.score && (<p className="text-red-400 text-sm">{errors.score.message}</p>)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Status</Label>
                <Select {...(register("status") as any)}>
                  <SelectTrigger className="w-full bg-slate-800 text-white border-slate-700"><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent className="bg-slate-900 text-white border-slate-700">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (<p className="text-red-400 text-sm">{errors.status.message}</p>)}
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Source</Label>
                <Select {...(register("source") as any)}>
                  <SelectTrigger className="w-full bg-slate-800 text-white border-slate-700"><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent className="bg-slate-900 text-white border-slate-700">
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.source && (<p className="text-red-400 text-sm">{errors.source.message}</p>)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Interactions</Label>
                <Input type="number" {...register("interactions", { valueAsNumber: true })} placeholder="Interactions" className="bg-slate-800 text-white border-slate-700 placeholder:text-slate-500" />
                {errors.interactions && (<p className="text-red-400 text-sm">{errors.interactions.message}</p>)}
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Last Contact</Label>
                <Input type="date" {...register("lastContact", { valueAsDate: true })} className="bg-slate-800 text-white border-slate-700" />
                {errors.lastContact && (<p className="text-red-400 text-sm">{errors.lastContact.message}</p>)}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Avatar URL (optional)</Label>
              <Input {...register("avatar")} placeholder="Avatar URL" className="bg-slate-800 text-white border-slate-700 placeholder:text-slate-500" />
              {errors.avatar && (<p className="text-red-400 text-sm">{errors.avatar.message}</p>)}
            </div>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">Create Lead</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lead Score Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Average Lead Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-teal-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.6</div>
            <p className="text-xs text-green-400">+0.3 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">High Potential Leads</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highLeads.length}</div>
            <p className="text-xs text-green-400">+2 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Interactions</CardTitle>
            <MessageSquare className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.reduce((acc, lead) => acc + lead.interactions, 0)}
            </div>
            <p className="text-xs text-green-400">+12 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-green-400">+2.4% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Lead Score Trends</CardTitle>
            <CardDescription className="text-slate-400">Average lead score over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={scoreHistoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-600 opacity-50" />
                <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 10]} stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#14b8a6" fill="url(#colorUv)" strokeWidth={2} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Lead Distribution</CardTitle>
            <CardDescription className="text-slate-400">Breakdown by source and status</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="source">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                <TabsTrigger value="source" className="data-[state=active]:bg-slate-700 text-white">By Source</TabsTrigger>
                <TabsTrigger value="status" className="data-[state=active]:bg-slate-700 text-white">By Status</TabsTrigger>
              </TabsList>
              <TabsContent value="source" className="pt-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={leadSourceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-600 opacity-50" />
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#ffffff' }}
                    />
                    <Bar dataKey="value" fill="#14b8a6" className="fill-teal-600" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="status" className="pt-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={leadStatusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-600 opacity-50" />
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#ffffff' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" className="fill-blue-500" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Prioritized Leads Table */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-semibold">Prioritized Leads</h3>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search leads..."
                className="pl-8 w-full md:w-[250px] bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="sort-by" className="hidden md:block text-slate-300">Sort by:</Label>
              <Select value={sortBy} onValueChange={(value: "name" | "score" | "lastContact") => setSortBy(value)}>
                <SelectTrigger id="sort-by" className="w-[150px] bg-slate-800 text-white border-slate-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-white border-slate-700">
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="score">Lead Score</SelectItem>
                  <SelectItem value="lastContact">Last Contact</SelectItem>
                </SelectContent>
              </Select>
              <ToggleGroup type="single" value={sortOrder} onValueChange={(value: "asc" | "desc") => value && setSortOrder(value)}>
                <ToggleGroupItem value="asc" aria-label="Sort ascending" className="h-9 w-9 bg-slate-800 border-slate-700 hover:bg-slate-700 data-[state=on]:bg-teal-600 data-[state=on]:text-white">
                  <ArrowUpCircle className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="desc" aria-label="Sort descending" className="h-9 w-9 bg-slate-800 border-slate-700 hover:bg-slate-700 data-[state=on]:bg-teal-600 data-[state=on]:text-white">
                  <ArrowDownCircle className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900 border-slate-800">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-800 text-white">All Leads ({filteredAndSortedLeads.length})</TabsTrigger>
            <TabsTrigger value="high" className="data-[state=active]:bg-slate-800 text-white">High Potential ({highLeads.length})</TabsTrigger>
            <TabsTrigger value="medium" className="data-[state=active]:bg-slate-800 text-white">Medium Potential ({mediumLeads.length})</TabsTrigger>
            <TabsTrigger value="low" className="data-[state=active]:bg-slate-800 text-white">Low Potential ({lowLeads.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <LeadTable leads={filteredAndSortedLeads} />
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