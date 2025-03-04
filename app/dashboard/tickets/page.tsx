"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Filter, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
  client: {
    name: string;
    email: string;
    avatar?: string;
  };
  assignee?: {
    name: string;
    avatar?: string;
  };
}

const mockTickets: Ticket[] = [
  {
    id: "T-1001",
    title: "Unable to schedule property viewing",
    description: "Client is trying to schedule a viewing for 123 Main St but the system shows an error.",
    status: "open",
    priority: "high",
    createdAt: new Date(2025, 3, 15, 10, 30),
    updatedAt: new Date(2025, 3, 15, 10, 30),
    client: {
      name: "John Smith",
      email: "john.smith@example.com",
    },
  },
  {
    id: "T-1002",
    title: "Question about mortgage pre-approval",
    description: "Client needs information about the mortgage pre-approval process for first-time buyers.",
    status: "in-progress",
    priority: "medium",
    createdAt: new Date(2025, 3, 14, 15, 45),
    updatedAt: new Date(2025, 3, 15, 9, 20),
    client: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
    },
    assignee: {
      name: "Michael Brown",
    },
  },
  {
    id: "T-1003",
    title: "Property listing photos not displaying",
    description: "The photos for the property at 456 Oak Ave are not showing up on the listing page.",
    status: "resolved",
    priority: "medium",
    createdAt: new Date(2025, 3, 12, 11, 15),
    updatedAt: new Date(2025, 3, 14, 16, 30),
    client: {
      name: "David Wilson",
      email: "david.w@example.com",
    },
    assignee: {
      name: "Emma Davis",
    },
  },
  {
    id: "T-1004",
    title: "Need assistance with offer letter",
    description: "Client needs help drafting an offer letter for 789 Pine St.",
    status: "open",
    priority: "high",
    createdAt: new Date(2025, 3, 15, 8, 0),
    updatedAt: new Date(2025, 3, 15, 8, 0),
    client: {
      name: "Jennifer Lee",
      email: "jennifer.l@example.com",
    },
  },
  {
    id: "T-1005",
    title: "Request for market analysis report",
    description: "Client is requesting a detailed market analysis for the downtown area.",
    status: "closed",
    priority: "low",
    createdAt: new Date(2025, 3, 10, 14, 20),
    updatedAt: new Date(2025, 3, 13, 11, 45),
    client: {
      name: "Robert Garcia",
      email: "robert.g@example.com",
    },
    assignee: {
      name: "Emma Davis",
    },
  },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.client.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  const openTickets = filteredTickets.filter(t => t.status === "open");
  const inProgressTickets = filteredTickets.filter(t => t.status === "in-progress");
  const resolvedTickets = filteredTickets.filter(t => t.status === "resolved");
  const closedTickets = filteredTickets.filter(t => t.status === "closed");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Support Tickets</h2>
          <p className="text-muted-foreground">
            Manage and respond to client support requests
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tickets..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({filteredTickets.length})
          </TabsTrigger>
          <TabsTrigger value="open">
            Open ({openTickets.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressTickets.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({resolvedTickets.length})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({closedTickets.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <TicketList 
            tickets={filteredTickets} 
            onSelectTicket={setSelectedTicket}
            selectedTicket={selectedTicket}
          />
        </TabsContent>
        
        <TabsContent value="open" className="mt-6">
          <TicketList 
            tickets={openTickets} 
            onSelectTicket={setSelectedTicket}
            selectedTicket={selectedTicket}
          />
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-6">
          <TicketList 
            tickets={inProgressTickets} 
            onSelectTicket={setSelectedTicket}
            selectedTicket={selectedTicket}
          />
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-6">
          <TicketList 
            tickets={resolvedTickets} 
            onSelectTicket={setSelectedTicket}
            selectedTicket={selectedTicket}
          />
        </TabsContent>
        
        <TabsContent value="closed" className="mt-6">
          <TicketList 
            tickets={closedTickets} 
            onSelectTicket={setSelectedTicket}
            selectedTicket={selectedTicket}
          />
        </TabsContent>
      </Tabs>
      
      {selectedTicket && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedTicket.title}</CardTitle>
                <CardDescription>Ticket #{selectedTicket.id}</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge status={selectedTicket.status} />
                <PriorityBadge priority={selectedTicket.priority} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Client</p>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(selectedTicket.client.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{selectedTicket.client.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedTicket.client.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Assignee</p>
                {selectedTicket.assignee ? (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(selectedTicket.assignee.name)}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{selectedTicket.assignee.name}</p>
                  </div>
                ) : (
                  <Button variant="outline" size="sm">Assign</Button>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm">{formatDate(selectedTicket.createdAt)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm">{formatDate(selectedTicket.updatedAt)}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Description</p>
              <div className="p-4 bg-muted rounded-lg">
                <p>{selectedTicket.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Reply</p>
              <Textarea placeholder="Type your response..." className="min-h-[100px]" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Change Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Send Response</Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

interface TicketListProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  selectedTicket: Ticket | null;
}

function TicketList({ tickets, onSelectTicket, selectedTicket }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No tickets found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Card 
          key={ticket.id}
          className={`cursor-pointer hover:bg-muted/50 transition-colors ${
            selectedTicket?.id === ticket.id ? "border-primary" : ""
          }`}
          onClick={() => onSelectTicket(ticket)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{ticket.title}</h3>
                  <p className="text-xs text-muted-foreground">#{ticket.id}</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{ticket.description}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{getInitials(ticket.client.name)}</AvatarFallback>
                </Avatar>
                <p className="text-xs">{ticket.client.name}</p>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {formatTimeAgo(ticket.updatedAt)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: Ticket["status"] }) {
  const statusConfig = {
    "open": { label: "Open", variant: "default", icon: AlertCircle },
    "in-progress": { label: "In Progress", variant: "secondary", icon: Clock },
    "resolved": { label: "Resolved", variant: "success", icon: CheckCircle },
    "closed": { label: "Closed", variant: "outline", icon: XCircle },
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant as any} className="flex items-center space-x-1">
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: Ticket["priority"] }) {
  const priorityConfig = {
    "low": { label: "Low", variant: "outline" },
    "medium": { label: "Medium", variant: "secondary" },
    "high": { label: "High", variant: "destructive" },
  };
  
  const config = priorityConfig[priority];
  
  return (
    <Badge variant={config.variant as any} className="text-xs">
      {config.label}
    </Badge>
  );
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
    year: "numeric",
  });
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return "just now";
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }
  
  return formatDate(date);
}