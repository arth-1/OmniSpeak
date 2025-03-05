"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusCircle,
  MessageCircle,
  User,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react";

// Ticket Schema & Types
const ticketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["technical", "billing", "account", "general"]),
  priority: z.enum(["medium", "low", "high", "urgent"]),
});

type TicketFormData = z.infer<typeof ticketSchema>;

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "technical" | "billing" | "account" | "general";
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  isModerator: boolean;
};

// Local Storage hook
const useLocalStorage = (key: string, initialValue: Ticket[]) => {
  const [storedValue, setStoredValue] = useState<Ticket[]>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: Ticket[] | ((prev: Ticket[]) => Ticket[])) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Local storage error:", error);
    }
  };

  return [storedValue, setValue] as const;
};

export default function TicketSystem() {
  const [tickets, setTickets] = useLocalStorage("tickets", []);
  const [isModerator, setIsModerator] = useState(false);
  const [activeTab, setActiveTab] = useState<"open" | "in_progress" | "resolved" | "closed">("open");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comment, setComment] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "technical",
      priority: "medium",
    },
  });

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.status === activeTab &&
      (isModerator ? true : ticket.status !== "closed")
  );

  const handleCreateTicket: SubmitHandler<TicketFormData> = (data) => {
    const newTicket: Ticket = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    setTickets((prev) => [newTicket, ...prev]);
    reset();
  };

  const updateTicketStatus = (ticketId: string, status: Ticket["status"]) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, status, updatedAt: new Date().toISOString() }
          : ticket
      )
    );
  };

  const handleAddComment = () => {
    if (!selectedTicket || !comment.trim()) return;

    const newComment: Comment = {
      id: uuidv4(),
      content: comment,
      createdAt: new Date().toISOString(),
      isModerator,
    };

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === selectedTicket.id
          ? { ...ticket, comments: [...ticket.comments, newComment] }
          : ticket
      )
    );
    setComment("");
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Support Tickets</h2>
          <div className="flex items-center gap-2">
            <Badge variant={isModerator ? "default" : "secondary"}>
              {isModerator ? "Moderator View" : "User View"}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => setIsModerator(!isModerator)}>
              Switch to {isModerator ? "User" : "Moderator"} View
            </Button>
          </div>
        </div>
        {!isModerator && (
          <div className="flex gap-4">
            <Button onClick={handleSubmit(handleCreateTicket)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </div>
        )}
      </div>

      {/* Ticket Creation Form */}
      {!isModerator && (
        <Card className="p-6">
          <form onSubmit={handleSubmit(handleCreateTicket)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label>Title</label>
                <Input {...register("title")} placeholder="Title" />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Category</label>
                  <select {...register("category")} className="w-full p-2 border rounded">
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="account">Account</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label>Priority</label>
                  <select {...register("priority")} className="w-full p-2 border rounded">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label>Description</label>
              <Textarea {...register("description")} rows={4} placeholder="Description" />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>
            <Button type="submit">Create Ticket</Button>
          </form>
        </Card>
      )}

      {/* Tickets Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "open" | "in_progress" | "resolved" | "closed")}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="open">Open ({tickets.filter(t => t.status === "open").length})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({tickets.filter(t => t.status === "in_progress").length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({tickets.filter(t => t.status === "resolved").length})</TabsTrigger>
          {isModerator && <TabsTrigger value="closed">Closed ({tickets.filter(t => t.status === "closed").length})</TabsTrigger>}
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {filteredTickets.map(ticket => (
                <Card
                  key={ticket.id}
                  className={`cursor-pointer ${selectedTicket?.id === ticket.id ? "border-primary" : ""}`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{ticket.title}</CardTitle>
                      <Badge variant={
                        ticket.priority === "urgent" ? "destructive" :
                        ticket.priority === "high" ? "default" : "secondary"
                      }>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {ticket.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>{format(new Date(ticket.createdAt), "PPpp")}</span>
                      <span>{ticket.comments.length} comments</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Ticket Details */}
            {selectedTicket && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedTicket.title}</CardTitle>
                    <CardDescription>
                      Created: {format(new Date(selectedTicket.createdAt), "PPpp")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label>Status</label>
                      <div className="flex gap-2 flex-wrap">
                        {(["open", "in_progress", "resolved", "closed"] as const).map((status) => (
                          <Button
                            key={status}
                            variant={selectedTicket.status === status ? "default" : "outline"}
                            onClick={() => isModerator && updateTicketStatus(selectedTicket.id, status)}
                            disabled={!isModerator}
                          >
                            {status.replace("_", " ")}
                            {selectedTicket.status === status && <CheckCircle2 className="ml-2 h-4 w-4" />}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label>Comments</label>
                      <div className="space-y-4">
                        {selectedTicket.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <User className="h-5 w-5 text-muted-foreground" />
                              {comment.isModerator && (
                                <span className="text-xs text-muted-foreground">Mod</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <Card className="p-3">
                                <p>{comment.content}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {format(new Date(comment.createdAt), "PPpp")}
                                </p>
                              </Card>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add a comment..."
                        />
                        <Button onClick={handleAddComment}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}