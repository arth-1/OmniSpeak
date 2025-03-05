"use client";

import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Search, Mail, Phone, MapPin, Building2, Calendar as CalendarIcon, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  phone: z.string().min(10, "Phone number too short"),
  address: z.string().min(5, "Address is too short"),
  type: z.enum(["buyer", "seller", "both"]),
  status: z.enum(["active", "inactive"]),
  leadScore: z.number().min(0).max(10),
  projectId: z.string().optional(),
  projectName: z.string().optional(),
  lastContact: z.date(),
  avatar: z.string().url().optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

const useLocalStorage = (key: string, initialValue: Client[]) => {
  const [storedValue, setStoredValue] = useState<Client[]>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
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
      console.error("Local storage error:", error);
    }
  };

  return [storedValue, setValue] as const;
};

function TypeBadge({ type }: { type: Client["type"] }) {
  const typeConfig = {
    buyer: { label: "Buyer", variant: "default" },
    seller: { label: "Seller", variant: "secondary" },
    both: { label: "Buyer & Seller", variant: "outline" },
  };
  return <Badge variant={typeConfig[type].variant as any}>{typeConfig[type].label}</Badge>;
}

function ClientCard({ client, onEdit, onDelete }: { client: Client; onEdit: (client: Client) => void; onDelete: (clientId: string) => void; }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              {client.avatar ? (
                <AvatarImage src={client.avatar} alt={client.name} />
              ) : (
                <AvatarFallback>{client.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-lg">{client.name}</CardTitle>
              <CardDescription>Client #{client.id}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TypeBadge type={client.type} />
            <Button variant="ghost" size="icon" onClick={() => onEdit(client)}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{client.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{client.phone}</span>
          </div>
          <div className="flex items-start">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
            <span className="line-clamp-2">{client.address}</span>
          </div>
        </div>
        <CardFooter className="pt-2 flex justify-between items-center text-sm">
          <div className="flex items-center">
            <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{client.projectName || "No Project"}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Lead Score:</span>
            <Badge variant={client.leadScore >= 8 ? "default" : client.leadScore >= 6 ? "secondary" : "outline"}>
              {client.leadScore.toFixed(1)}
            </Badge>
          </div>
        </CardFooter>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>Last Contact: {format(new Date(client.lastContact), "MMM dd, yyyy")}</span>
        </div>
        <div className="flex justify-end">
          <Button variant="destructive" size="sm" onClick={() => onDelete(client.id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ClientGrid({ clients, onEdit, onDelete }: { clients: Client[]; onEdit: (client: Client) => void; onDelete: (clientId: string) => void; }) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No clients found</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map(client => (
        <ClientCard key={client.id} client={client} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default function ClientsPage() {
  const { toast } = useToast();
  const [clients, setClients] = useLocalStorage("clients", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);

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

  useEffect(() => {
    if (editClient) {
      form.reset({
        ...editClient,
        lastContact: new Date(editClient.lastContact),
      });
    } else {
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
    }
  }, [editClient, form]);

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

  const handleDelete = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    toast({ title: "Client Deleted", description: "Client removed successfully." });
  };

  const filteredClients = clients.filter(client =>
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
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              {editClient ? "Edit Client" : "New Client"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editClient ? "Edit Client" : "New Client"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Client Name</label>
                  <Input {...form.register("name")} />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label>Email</label>
                  <Input {...form.register("email")} />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Phone</label>
                  <Input {...form.register("phone")} />
                  {form.formState.errors.phone && (
                    <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label>Address</label>
                  <Input {...form.register("address")} />
                  {form.formState.errors.address && (
                    <p className="text-red-500 text-sm">{form.formState.errors.address.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Type</label>
                  <select {...form.register("type")} className="w-full p-2 border rounded">
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label>Status</label>
                  <select {...form.register("status")} className="w-full p-2 border rounded">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Lead Score</label>
                  <Input type="number" min={0} max={10} {...form.register("leadScore", { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <label>Project Name</label>
                  <Input {...form.register("projectName")} />
                </div>
              </div>
              <div className="space-y-2">
                <label>Last Contact Date</label>
                <Controller
                  name="lastContact"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      type="date"
                      value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <label>Avatar URL</label>
                <Input {...form.register("avatar")} />
              </div>
              <Button type="submit" className="w-full">
                {editClient ? "Save Changes" : "Create Client"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
          <TabsTrigger value="all">All Clients ({filteredClients.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeClients.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveClients.length})</TabsTrigger>
          <TabsTrigger value="buyers">Buyers ({buyerClients.length})</TabsTrigger>
          <TabsTrigger value="sellers">Sellers ({sellerClients.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <ClientGrid clients={filteredClients} onEdit={setEditClient} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value="active" className="mt-6">
          <ClientGrid clients={activeClients} onEdit={setEditClient} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value="inactive" className="mt-6">
          <ClientGrid clients={inactiveClients} onEdit={setEditClient} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value="buyers" className="mt-6">
          <ClientGrid clients={buyerClients} onEdit={setEditClient} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value="sellers" className="mt-6">
          <ClientGrid clients={sellerClients} onEdit={setEditClient} onDelete={handleDelete} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
