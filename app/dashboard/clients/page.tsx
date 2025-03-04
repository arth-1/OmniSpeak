"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Search, Mail, Phone, MapPin, Building2, Calendar, MoreHorizontal } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: "buyer" | "seller" | "both";
  status: "active" | "inactive";
  leadScore: number;
  projectId?: string;
  projectName?: string;
  lastContact: Date;
  avatar?: string;
}

const mockClients: Client[] = [
  {
    id: "C-1001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, CA 90210",
    type: "buyer",
    status: "active",
    leadScore: 8.5,
    projectId: "P-1001",
    projectName: "Oakridge Residences",
    lastContact: new Date(2025, 3, 15),
  },
  {
    id: "C-1002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 234-5678",
    address: "456 Oak Ave, Somewhere, NY 10001",
    type: "seller",
    status: "active",
    leadScore: 7.2,
    projectId: "P-1002",
    projectName: "Riverside Estates",
    lastContact: new Date(2025, 3, 14),
  },
  {
    id: "C-1003",
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "(555) 345-6789",
    address: "789 Pine St, Elsewhere, TX 75001",
    type: "both",
    status: "active",
    leadScore: 9.1,
    projectId: "P-1001",
    projectName: "Oakridge Residences",
    lastContact: new Date(2025, 3, 12),
  },
  {
    id: "C-1004",
    name: "Jennifer Lee",
    email: "jennifer.l@example.com",
    phone: "(555) 456-7890",
    address: "101 Maple Dr, Nowhere, FL 33101",
    type: "buyer",
    status: "inactive",
    leadScore: 5.8,
    lastContact: new Date(2025, 3, 1),
  },
  {
    id: "C-1005",
    name: "Robert Garcia",
    email: "robert.g@example.com",
    phone: "(555) 567-8901",
    address: "202 Cedar Ln, Anywhere, WA 98101",
    type: "seller",
    status: "active",
    leadScore: 8.0,
    projectId: "P-1005",
    projectName: "Parkview Heights",
    lastContact: new Date(2025, 3, 10),
  },
  {
    id: "C-1006",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "(555) 678-9012",
    address: "303 Birch Rd, Someplace, IL 60601",
    type: "buyer",
    status: "active",
    leadScore: 7.5,
    projectId: "P-1002",
    projectName: "Riverside Estates",
    lastContact: new Date(2025, 3, 8),
  },
  {
    id: "C-1007",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "(555) 789-0123",
    address: "404 Elm St, Othertown, GA 30301",
    type: "both",
    status: "active",
    leadScore: 8.7,
    projectId: "P-1005",
    projectName: "Parkview Heights",
    lastContact: new Date(2025, 3, 7),
  },
  {
    id: "C-1008",
    name: "Jessica Martinez",
    email: "jessica.m@example.com",
    phone: "(555) 890-1234",
    address: "505 Walnut Ave, Somewhere Else, MA 02101",
    type: "seller",
    status: "inactive",
    leadScore: 6.2,
    lastContact: new Date(2025, 2, 20),
  },
];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredClients = clients.filter((client) => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery) ||
    client.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.projectName && client.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const activeClients = filteredClients.filter(c => c.status === "active");
  const inactiveClients = filteredClients.filter(c => c.status === "inactive");
  const buyerClients = filteredClients.filter(c => c.type === "buyer" || c.type === "both");
  const sellerClients = filteredClients.filter(c => c.type === "seller" || c.type === "both");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
          <p className="text-muted-foreground">
            Manage your client relationships
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All Clients ({filteredClients.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeClients.length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive ({inactiveClients.length})
          </TabsTrigger>
          <TabsTrigger value="buyers">
            Buyers ({buyerClients.length})
          </TabsTrigger>
          <TabsTrigger value="sellers">
            Sellers ({sellerClients.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <ClientGrid clients={filteredClients} />
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          <ClientGrid clients={activeClients} />
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-6">
          <ClientGrid clients={inactiveClients} />
        </TabsContent>
        
        <TabsContent value="buyers" className="mt-6">
          <ClientGrid clients={buyerClients} />
        </TabsContent>
        
        <TabsContent value="sellers" className="mt-6">
          <ClientGrid clients={sellerClients} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ClientGridProps {
  clients: Client[];
}

function ClientGrid({ clients }: ClientGridProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No clients found</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}

interface ClientCardProps {
  client: Client;
}

function ClientCard({ client }: ClientCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{client.name}</CardTitle>
              <CardDescription>Client #{client.id}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TypeBadge type={client.type} />
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{client.email}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{client.phone}</span>
          </div>
          
          <div className="flex items-start text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="line-clamp-2">{client.address}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t flex justify-between items-center">
          <div className="flex items-center text-sm">
            <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{client.projectName || "No Project Assigned"}</span>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Lead Score:</span>
            <Badge variant={getLeadScoreBadgeVariant(client.leadScore)}>
              {client.leadScore.toFixed(1)}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>Last Contact: {formatDate(client.lastContact)}</span>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Phone className="mr-2 h-4 w-4" />
            Call
          </Button>
          <Button size="sm" className="flex-1">
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TypeBadge({ type }: { type: Client["type"] }) {
  const typeConfig = {
    "buyer": { label: "Buyer", variant: "default" },
    "seller": { label: "Seller", variant: "secondary" },
    "both": { label: "Buyer & Seller", variant: "outline" },
  };
  
  const config = typeConfig[type];
  
  return (
    <Badge variant={config.variant as any}>
      {config.label}
    </Badge>
  );
}

function getLeadScoreBadgeVariant(score: number): "default" | "secondary" | "outline" | "destructive" {
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
    year: "numeric",
  });
}