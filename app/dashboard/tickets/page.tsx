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

  return (
    <div className="space-y-6 container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl bg-slate-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Support Tickets</h2>
          <div className="flex items-center gap-2">
            <Badge variant={isModerator ? "default" : "secondary"} className="bg-teal-500 hover:bg-teal-600 text-white">
              {isModerator ? "Moderator View" : "User View"}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => setIsModerator(!isModerator)} className="bg-slate-800 border-gray-700 hover:bg-slate-700 text-white">
              Switch to {isModerator ? "User" : "Moderator"} View
            </Button>
          </div>
        </div>
        {!isModerator && (
          <Button onClick={handleSubmit(handleCreateTicket)} className="bg-teal-500 hover:bg-teal-600 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        )}
      </div>

      {/* Ticket Creation Form */}
      {!isModerator && (
        <Card className="p-6 bg-slate-800 border-gray-700">
          <form onSubmit={handleSubmit(handleCreateTicket)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-gray-300">Title</label>
                <Input {...register("title")} placeholder="Title" className="bg-slate-700 text-white border-gray-600 placeholder:text-gray-500" />
                {errors.title && (
                  <p className="text-rose-400 text-sm">{errors.title.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray-300">Category</label>
                  <select {...register("category")} className="w-full p-2 rounded bg-slate-700 text-white border-gray-600">
                    <option value="technical" className="bg-slate-800">Technical</option>
                    <option value="billing" className="bg-slate-800">Billing</option>
                    <option value="account" className="bg-slate-800">Account</option>
                    <option value="general" className="bg-slate-800">General</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300">Priority</label>
                  <select {...register("priority")} className="w-full p-2 rounded bg-slate-700 text-white border-gray-600">
                    <option value="low" className="bg-slate-800">Low</option>
                    <option value="medium" className="bg-slate-800">Medium</option>
                    <option value="high" className="bg-slate-800">High</option>
                    <option value="urgent" className="bg-slate-800">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-gray-300">Description</label>
              <Textarea {...register("description")} rows={4} placeholder="Description" className="bg-slate-700 text-white border-gray-600 placeholder:text-gray-500" />
              {errors.description && (
                <p className="text-rose-400 text-sm">{errors.description.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white">Create Ticket</Button>
          </form>
        </Card>
      )}

      {/* Tickets Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setSelectedTicket(null);
          setActiveTab(value as "open" | "in_progress" | "resolved" | "closed");
        }}
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto bg-slate-800 border border-gray-700">
          <TabsTrigger value="open" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">Open ({tickets.filter(t => t.status === "open").length})</TabsTrigger>
          <TabsTrigger value="in_progress" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">In Progress ({tickets.filter(t => t.status === "in_progress").length})</TabsTrigger>
          <TabsTrigger value="resolved" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">Resolved ({tickets.filter(t => t.status === "resolved").length})</TabsTrigger>
          {isModerator && <TabsTrigger value="closed" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">Closed ({tickets.filter(t => t.status === "closed").length})</TabsTrigger>}
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                  No tickets found in this category.
                </div>
              ) : (
                filteredTickets.map(ticket => (
                  <Card
                    key={ticket.id}
                    className={`bg-slate-800 border-gray-700 shadow-lg cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? "border-teal-500 ring-2 ring-teal-500" : ""}`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white">{ticket.title}</CardTitle>
                        <Badge className={`uppercase text-xs font-semibold ${
                          ticket.priority === "urgent" ? "bg-rose-500 text-white" :
                          ticket.priority === "high" ? "bg-teal-500 text-white" :
                          "bg-gray-700 text-gray-300"
                        }`}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 text-gray-400">
                        {ticket.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-400">
                      <div className="flex justify-between">
                        <span>{format(new Date(ticket.createdAt), "PPpp")}</span>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{ticket.comments.length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Selected Ticket Details */}
            {selectedTicket && (
              <div className="space-y-4">
                <Card className="bg-slate-800 border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-white">{selectedTicket.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      Created: {format(new Date(selectedTicket.createdAt), "PPpp")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-gray-300">Status</label>
                      <div className="flex gap-2 flex-wrap">
                        {(["open", "in_progress", "resolved", "closed"] as const).map((status) => (
                          <Button
                            key={status}
                            variant={selectedTicket.status === status ? "default" : "outline"}
                            className={`${selectedTicket.status === status ? "bg-teal-500 hover:bg-teal-600 text-white" : "bg-slate-700 border-gray-600 hover:bg-slate-600 text-white"}`}
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
                      <label className="text-gray-300">Comments</label>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {selectedTicket.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <User className="h-5 w-5 text-gray-400" />
                              {comment.isModerator && (
                                <span className="text-xs text-gray-400">Mod</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <Card className="p-3 bg-slate-700 border-gray-600 text-white">
                                <p>{comment.content}</p>
                                <p className="text-xs text-gray-500 mt-1">
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
                          className="bg-slate-700 text-white border-gray-600 placeholder:text-gray-500"
                        />
                        <Button onClick={handleAddComment} className="bg-teal-500 hover:bg-teal-600 text-white">
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