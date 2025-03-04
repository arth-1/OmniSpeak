"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Search, Building2, Users, Calendar, MoreHorizontal } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "pending" | "completed";
  progress: number;
  clientCount: number;
  startDate: Date;
  endDate?: Date;
  image?: string;
}

const mockProjects: Project[] = [
  {
    id: "P-1001",
    name: "Oakridge Residences",
    description: "Luxury condominium development with 45 units in downtown area",
    status: "active",
    progress: 65,
    clientCount: 12,
    startDate: new Date(2025, 1, 15),
    endDate: new Date(2025, 7, 30),
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "P-1002",
    name: "Riverside Estates",
    description: "Single-family home development with 28 properties along the river",
    status: "active",
    progress: 40,
    clientCount: 8,
    startDate: new Date(2025, 2, 10),
    endDate: new Date(2025, 10, 15),
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "P-1003",
    name: "Sunset Towers",
    description: "High-rise apartment complex with 120 units and premium amenities",
    status: "pending",
    progress: 10,
    clientCount: 3,
    startDate: new Date(2025, 4, 1),
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "P-1004",
    name: "Maple Grove Community",
    description: "Mixed-use development with residential and commercial spaces",
    status: "completed",
    progress: 100,
    clientCount: 32,
    startDate: new Date(2024, 8, 5),
    endDate: new Date(2025, 2, 28),
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "P-1005",
    name: "Parkview Heights",
    description: "Townhouse development with 36 units adjacent to city park",
    status: "active",
    progress: 75,
    clientCount: 18,
    startDate: new Date(2024, 11, 10),
    endDate: new Date(2025, 5, 15),
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "P-1006",
    name: "Harbor View Condos",
    description: "Waterfront condominiums with premium finishes and amenities",
    status: "pending",
    progress: 5,
    clientCount: 2,
    startDate: new Date(2025, 5, 1),
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  
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
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
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
          <TabsTrigger value="all">
            All Projects ({filteredProjects.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeProjects.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingProjects.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedProjects.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <ProjectGrid projects={filteredProjects} />
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          <ProjectGrid projects={activeProjects} />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <ProjectGrid projects={pendingProjects} />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <ProjectGrid projects={completedProjects} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ProjectGridProps {
  projects: Project[];
}

function ProjectGrid({ projects }: ProjectGridProps) {
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
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <img
          src={project.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <StatusBadge status={project.status} />
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{project.name}</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
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
            <span>Project #{project.id}</span>
          </div>
          
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>{project.clientCount} Clients</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex items-center text-sm text-muted-foreground w-full">
          <Calendar className="mr-1 h-4 w-4" />
          <span>
            {formatDate(project.startDate)} 
            {project.endDate && ` - ${formatDate(project.endDate)}`}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const statusConfig = {
    "active": { label: "Active", variant: "default" },
    "pending": { label: "Pending", variant: "secondary" },
    "completed": { label: "Completed", variant: "outline" },
  };
  
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant as any}>
      {config.label}
    </Badge>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}