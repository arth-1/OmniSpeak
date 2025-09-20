"use client";

import { useState, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Search, Mail, Phone, MapPin, Building2, Calendar as CalendarIcon, MoreHorizontal, X, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";

// --- Data and Schema Definitions ---
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
  lastContact: string; // ISO string format
  avatar?: string;
}

const clientFormSchema = z.object({
  name: z.string().min(2, "Client name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number too short").regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format"),
  address: z.string().min(5, "Address is too short"),
  type: z.enum(["buyer", "seller", "both"]),
  status: z.enum(["active", "inactive"]),
  leadScore: z.number().min(0).max(10, "Lead score must be between 0 and 10"),
  projectId: z.string().optional(),
  projectName: z.string().optional(),
  lastContact: z.date(),
  avatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

// --- Custom Hooks ---
const useLocalStorage = (key: string, initialValue: Client[]) => {
  const [storedValue, setStoredValue] = useState<Client[]>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Local storage read error:", error);
      return initialValue;
    }
  });

  const setValue = (value: Client[] | ((prev: Client[]) => Client[])) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Local storage write error:", error);
    }
  };

  return [storedValue, setValue] as const;
};

const useClientManagement = (initialClients: Client[]) => {
  const [clients, setClients] = useLocalStorage("clients", initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"name" | "leadScore" | "lastContact">("name");

  const filteredAndSortedClients = useMemo(() => {
    let result = [...clients];

    // 1. Filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(client =>
        Object.values(client).some(value =>
          String(value).toLowerCase().includes(lowerCaseQuery)
        )
      );
    }

    // 2. Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "leadScore":
          comparison = a.leadScore - b.leadScore;
          break;
        case "lastContact":
          comparison = new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [clients, searchQuery, sortBy, sortOrder]);

  const handleDelete = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  return {
    clients,
    setClients,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredAndSortedClients,
    handleDelete,
  };
};

// --- Components ---
function TypeBadge({ type }: { type: Client["type"] }) {
  const typeConfig = {
    buyer: { label: "Buyer", variant: "default" },
    seller: { label: "Seller", variant: "secondary" },
    both: { label: "Buyer & Seller", variant: "outline" },
  };
  return <Badge variant={typeConfig[type].variant as any}>{typeConfig[type].label}</Badge>;
}

function ClientDetailDialog({ client, onClose }: { client: Client | null; onClose: () => void; }) {
  if (!client) return null;
  return (
    <Dialog open={!!client} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 text-white border border-gray-700">
        <DialogHeader>
          <DialogTitle>Client Details</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-teal-500">
            {client.avatar ? (
              <AvatarImage src={client.avatar} alt={client.name} />
            ) : (
              <AvatarFallback className="bg-teal-500 text-white">{client.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{client.name}</h3>
            <p className="text-sm text-gray-400">Client #{client.id}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Contact Information</h4>
            <div className="flex items-center text-gray-300"><Mail className="mr-2 h-4 w-4 text-gray-400" /><span>{client.email}</span></div>
            <div className="flex items-center text-gray-300"><Phone className="mr-2 h-4 w-4 text-gray-400" /><span>{client.phone}</span></div>
            <div className="flex items-center text-gray-300"><MapPin className="mr-2 h-4 w-4 text-gray-400" /><span>{client.address}</span></div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Professional Details</h4>
            <div className="flex items-center text-gray-300"><Building2 className="mr-2 h-4 w-4 text-gray-400" /><span>Project: {client.projectName || "N/A"}</span></div>
            <div className="flex items-center text-gray-300"><Badge variant="outline">Type: <TypeBadge type={client.type} /></Badge></div>
            <div className="flex items-center text-gray-300"><Badge variant="outline">Status: {client.status}</Badge></div>
          </div>
        </div>
        <Separator className="bg-gray-700" />
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-400"><CalendarIcon className="mr-2 h-4 w-4" /><span>Last Contact: {format(new Date(client.lastContact), "MMM dd, yyyy")}</span></div>
          <div className="flex items-center"><Badge variant={client.leadScore >= 8 ? "default" : client.leadScore >= 6 ? "secondary" : "outline"}>Lead Score: {client.leadScore.toFixed(1)}</Badge></div>
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-teal-500 hover:bg-teal-600 text-white">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ClientCard({ client, onEdit, onDelete, onDetails }: { client: Client; onEdit: (client: Client) => void; onDelete: (clientId: string) => void; onDetails: (client: Client) => void; }) {
  return (
    <Card className="bg-slate-800 text-white border-none shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-4" onClick={() => onDetails(client)}>
          <Avatar className="h-14 w-14 border-2 border-teal-500">
            {client.avatar ? (
              <AvatarImage src={client.avatar} alt={client.name} />
            ) : (
              <AvatarFallback className="bg-teal-500 text-white">{client.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold">{client.name}</CardTitle>
            <CardDescription className="text-sm text-gray-400">Client #{client.id}</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TypeBadge type={client.type} />
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(client); }}>
            <MoreHorizontal className="h-4 w-4 text-teal-400" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center"><Mail className="mr-2 h-4 w-4 text-gray-400" /><span>{client.email}</span></div>
          <div className="flex items-center"><Phone className="mr-2 h-4 w-4 text-gray-400" /><span>{client.phone}</span></div>
          <div className="flex items-start"><MapPin className="mr-2 h-4 w-4 text-gray-400 shrink-0" /><span className="line-clamp-2">{client.address}</span></div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between items-center text-sm border-t border-gray-700 pt-4">
        <div className="flex items-center mb-2 sm:mb-0">
          <Building2 className="mr-2 h-4 w-4 text-gray-400" />
          <span className="text-gray-400">{client.projectName || "No Project"}</span>
        </div>
        <div className="flex items-center mb-2 sm:mb-0">
          <Badge variant={client.leadScore >= 8 ? "default" : client.leadScore >= 6 ? "secondary" : "outline"} className="text-sm">
            Score: {client.leadScore.toFixed(1)}
          </Badge>
        </div>
        <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(client.id); }} className="hover:bg-red-600 transition-colors">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

function ClientGrid({ clients, onEdit, onDelete, onDetails }: { clients: Client[]; onEdit: (client: Client) => void; onDelete: (clientId: string) => void; onDetails: (client: Client) => void; }) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">No clients found</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {clients.map(client => (
        <ClientCard
          key={client.id}
          client={client}
          onEdit={onEdit}
          onDelete={onDelete}
          onDetails={onDetails}
        />
      ))}
    </div>
  );
}

export default function ClientsPage() {
  const { toast } = useToast();
  const {
    clients,
    setClients,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredAndSortedClients,
    handleDelete
  } = useClientManagement([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [detailClient, setDetailClient] = useState<Client | null>(null);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      type: "buyer",
      status: "active",
      leadScore: 0,
      projectId: "",
      projectName: "",
      lastContact: new Date(),
      avatar: "",
    },
  });

  const handleOpenEdit = (client: Client) => {
    setEditClient(client);
    form.reset({
      ...client,
      lastContact: new Date(client.lastContact),
    });
    setOpenDialog(true);
  };

  const handleOpenNew = () => {
    setEditClient(null);
    form.reset({
      name: "",
      email: "",
      phone: "",
      address: "",
      type: "buyer",
      status: "active",
      leadScore: 0,
      projectId: "",
      projectName: "",
      lastContact: new Date(),
      avatar: "",
    });
    setOpenDialog(true);
  };

  const handleSubmit = (values: ClientFormValues) => {
    const clientData: Client = {
      id: editClient?.id || `C-${Date.now()}`,
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      type: values.type,
      status: values.status,
      leadScore: values.leadScore,
      projectId: values.projectId,
      projectName: values.projectName,
      lastContact: values.lastContact.toISOString(),
      avatar: values.avatar,
    };

    setClients(prev =>
      editClient
        ? prev.map(c => (c.id === editClient.id ? clientData : c))
        : [...prev, clientData]
    );

    setOpenDialog(false);
    setEditClient(null);
    toast({
      title: `Client ${editClient ? "Updated" : "Created"}`,
      description: "Client details saved successfully.",
    });
  };

  const activeClients = filteredAndSortedClients.filter(c => c.status === "active");
  const inactiveClients = filteredAndSortedClients.filter(c => c.status === "inactive");
  const buyerClients = filteredAndSortedClients.filter(c => c.type === "buyer" || c.type === "both");
  const sellerClients = filteredAndSortedClients.filter(c => c.type === "seller" || c.type === "both");

  return (
    <div className="space-y-8 container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl bg-slate-900 text-white min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Clients</h2>
          <p className="text-lg text-gray-400">Manage your client relationships</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew} className="bg-teal-500 hover:bg-teal-600 text-white shadow-lg">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-slate-800 text-white border border-gray-700">
            <DialogHeader>
              <DialogTitle>{editClient ? "Edit Client" : "New Client"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Client Name</Label>
                      <Input id="name" {...form.register("name")} placeholder="John Doe" className="bg-slate-700 text-white border-gray-600" />
                      {form.formState.errors.name && (<p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>)}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input id="email" {...form.register("email")} placeholder="john.doe@example.com" className="bg-slate-700 text-white border-gray-600" />
                      {form.formState.errors.email && (<p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>)}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                      <Input id="phone" {...form.register("phone")} placeholder="(123) 456-7890" className="bg-slate-700 text-white border-gray-600" />
                      {form.formState.errors.phone && (<p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>)}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-gray-300">Address</Label>
                      <Input id="address" {...form.register("address")} placeholder="1234 Main St, Anytown, USA" className="bg-slate-700 text-white border-gray-600" />
                      {form.formState.errors.address && (<p className="text-red-500 text-sm">{form.formState.errors.address.message}</p>)}
                    </div>
                  </div>
                </div>

                {/* Professional Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Professional Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-gray-300">Type</Label>
                      <Controller
                        name="type"
                        control={form.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="bg-slate-700 text-white border-gray-600"><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent className="bg-slate-800 text-white border-gray-600">
                              <SelectItem value="buyer">Buyer</SelectItem>
                              <SelectItem value="seller">Seller</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-gray-300">Status</Label>
                      <Controller
                        name="status"
                        control={form.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="bg-slate-700 text-white border-gray-600"><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent className="bg-slate-800 text-white border-gray-600">
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leadScore" className="text-gray-300">Lead Score</Label>
                      <Input type="number" min={0} max={10} id="leadScore" {...form.register("leadScore", { valueAsNumber: true })} className="bg-slate-700 text-white border-gray-600" />
                      {form.formState.errors.leadScore && (<p className="text-red-500 text-sm">{form.formState.errors.leadScore.message}</p>)}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectName" className="text-gray-300">Project Name</Label>
                      <Input id="projectName" {...form.register("projectName")} placeholder="e.g., Pine Ridge Residence" className="bg-slate-700 text-white border-gray-600" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastContact" className="text-gray-300">Last Contact Date</Label>
                      <Controller
                        name="lastContact"
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            type="date"
                            id="lastContact"
                            value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                            className="bg-slate-700 text-white border-gray-600"
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar" className="text-gray-300">Avatar URL</Label>
                      <Input id="avatar" {...form.register("avatar")} placeholder="https://example.com/avatar.jpg" className="bg-slate-700 text-white border-gray-600" />
                      {form.formState.errors.avatar && (<p className="text-red-500 text-sm">{form.formState.errors.avatar.message}</p>)}
                    </div>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                {editClient ? "Save Changes" : "Create Client"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter Section */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-8 bg-slate-800 text-white border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button variant="ghost" size="icon" className="absolute right-2.5 top-1.5" onClick={() => setSearchQuery("")}>
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="sort" className="hidden md:block">Sort by:</Label>
          <Select value={sortBy} onValueChange={(value: "name" | "leadScore" | "lastContact") => setSortBy(value)}>
            <SelectTrigger id="sort" className="w-[150px] bg-slate-800 text-white border-gray-700">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 text-white border-gray-700">
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="leadScore">Lead Score</SelectItem>
              <SelectItem value="lastContact">Last Contact</SelectItem>
            </SelectContent>
          </Select>
          <ToggleGroup type="single" value={sortOrder} onValueChange={(value: "asc" | "desc") => value && setSortOrder(value)}>
            <ToggleGroupItem value="asc" aria-label="Sort ascending" className="h-9 w-9 bg-slate-800 border-gray-700 hover:bg-slate-700 data-[state=on]:bg-teal-500 data-[state=on]:text-white">
              <ArrowUpCircle className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="desc" aria-label="Sort descending" className="h-9 w-9 bg-slate-800 border-gray-700 hover:bg-slate-700 data-[state=on]:bg-teal-500 data-[state=on]:text-white">
              <ArrowDownCircle className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Tabs and Client Grid */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto bg-slate-800 border border-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">All ({filteredAndSortedClients.length})</TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">Active ({activeClients.length})</TabsTrigger>
          <TabsTrigger value="inactive" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">Inactive ({inactiveClients.length})</TabsTrigger>
          <TabsTrigger value="buyers" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">Buyers ({buyerClients.length})</TabsTrigger>
          <TabsTrigger value="sellers" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">Sellers ({sellerClients.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <ClientGrid clients={filteredAndSortedClients} onEdit={handleOpenEdit} onDelete={handleDelete} onDetails={setDetailClient} />
        </TabsContent>
        <TabsContent value="active" className="mt-6">
          <ClientGrid clients={activeClients} onEdit={handleOpenEdit} onDelete={handleDelete} onDetails={setDetailClient} />
        </TabsContent>
        <TabsContent value="inactive" className="mt-6">
          <ClientGrid clients={inactiveClients} onEdit={handleOpenEdit} onDelete={handleDelete} onDetails={setDetailClient} />
        </TabsContent>
        <TabsContent value="buyers" className="mt-6">
          <ClientGrid clients={buyerClients} onEdit={handleOpenEdit} onDelete={handleDelete} onDetails={setDetailClient} />
        </TabsContent>
        <TabsContent value="sellers" className="mt-6">
          <ClientGrid clients={sellerClients} onEdit={handleOpenEdit} onDelete={handleDelete} onDetails={setDetailClient} />
        </TabsContent>
      </Tabs>
      <ClientDetailDialog client={detailClient} onClose={() => setDetailClient(null)} />
    </div>
  );
}