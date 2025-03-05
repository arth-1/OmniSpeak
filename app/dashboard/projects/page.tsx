"use client";

import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import Image from "next/image";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Search, Building2, Users, Calendar as CalendarIcon, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const projectFormSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["active", "pending", "completed"]),
  progress: z.number().min(0).max(100),
  clientCount: z.number().min(0),
  startDate: z.date(),
  endDate: z.date().optional(),
  image: z.string().url().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "pending" | "completed";
  progress: number;
  clientCount: number;
  startDate: string;
  endDate?: string;
  image?: string;
}

const useLocalStorage = (key: string, initialValue: Project[]) => {
  const [storedValue, setStoredValue] = useState<Project[]>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: Project[] | ((prev: Project[]) => Project[])) => {
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

function StatusBadge({ status }: { status: "active" | "pending" | "completed" }) {
  const statusConfig = {
    active: { label: "Active", variant: "default" },
    pending: { label: "Pending", variant: "secondary" },
    completed: { label: "Completed", variant: "outline" },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant as any}>{config.label}</Badge>;
}

function ProjectCard({ project, onEdit, onDelete }: {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={project.image || "/placeholder-project.jpg"}
          alt={project.name}
          className="w-full h-full object-cover"
          width={400}
          height={200}
          priority
        />
        <div className="absolute top-2 right-2">
          <StatusBadge status={project.status} />
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{project.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onEdit(project)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(project.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 pb-2">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <Building2 className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>{project.id}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>{project.clientCount} Clients</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex items-center text-sm text-muted-foreground w-full">
          <CalendarIcon className="mr-1 h-4 w-4" />
          <span>
            {format(new Date(project.startDate), 'MMM dd, yyyy')} 
            {project.endDate && ` - ${format(new Date(project.endDate), 'MMM dd, yyyy')}`}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

function ProjectGrid({ projects, onEdit, onDelete }: {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No projects found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useLocalStorage("projects", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      progress: 0,
      clientCount: 0,
      startDate: new Date(),
      endDate: undefined,
      image: "",
    }
  });

  useEffect(() => {
    if (editProject) {
      form.reset({
        ...editProject,
        startDate: new Date(editProject.startDate),
        endDate: editProject.endDate ? new Date(editProject.endDate) : undefined
      });
    } else {
      form.reset({
        name: "",
        description: "",
        status: "active",
        progress: 0,
        clientCount: 0,
        startDate: new Date(),
        endDate: undefined,
        image: "",
      });
    }
  }, [editProject, form]);

  const handleSubmit = (values: ProjectFormValues) => {
    const projectData: Project = {
      id: editProject?.id || `P-${Date.now()}`,
      name: values.name,
      description: values.description,
      status: values.status,
      progress: values.progress,
      clientCount: values.clientCount,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate?.toISOString(),
      image: values.image,
    };

    setProjects(prev => 
      editProject 
        ? prev.map(p => p.id === editProject.id ? projectData : p)
        : [...prev, projectData]
    );

    setOpenDialog(false);
    setEditProject(null);
    toast({
      title: `Project ${editProject ? "Updated" : "Created"}`,
      description: "Your project details have been saved successfully.",
    });
  };

  const handleDelete = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    toast({ title: "Project Deleted", description: "Project removed successfully." });
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeProjects = filteredProjects.filter(p => p.status === "active");
  const pendingProjects = filteredProjects.filter(p => p.status === "pending");
  const completedProjects = filteredProjects.filter(p => p.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your real estate development projects
          </p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editProject ? "Edit Project" : "New Project"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Project Name</label>
                  <Input {...form.register("name")} />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label>Status</label>
                  <select
                    {...form.register("status")}
                    className="w-full p-2 border rounded"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label>Description</label>
                <Input {...form.register("description")} />
                {form.formState.errors.description && (
                  <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Progress (%)</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    {...form.register("progress", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <label>Number of Clients</label>
                  <Input
                    type="number"
                    min={0}
                    {...form.register("clientCount", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Start Date</label>
                  <Controller
                    name="startDate"
                    control={form.control}
                    render={({ field }) => (
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="rounded-md border"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label>End Date</label>
                  <Controller
                    name="endDate"
                    control={form.control}
                    render={({ field }) => (
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="rounded-md border"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label>Image URL</label>
                <Input {...form.register("image")} />
              </div>

              <Button type="submit" className="w-full">
                {editProject ? "Save Changes" : "Create Project"}
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
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Projects ({filteredProjects.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeProjects.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingProjects.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedProjects.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ProjectGrid projects={filteredProjects} onEdit={setEditProject} onDelete={handleDelete} />
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          <ProjectGrid projects={activeProjects} onEdit={setEditProject} onDelete={handleDelete} />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <ProjectGrid projects={pendingProjects} onEdit={setEditProject} onDelete={handleDelete} />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <ProjectGrid projects={completedProjects} onEdit={setEditProject} onDelete={handleDelete} />
        </TabsContent>
      </Tabs>
    </div>
  );
}