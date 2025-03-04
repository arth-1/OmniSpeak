"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserButton } from "@clerk/nextjs";
import {
  Building2,
  MessageSquare,
  Headphones,
  Globe,
  FileText,
  Users,
  BarChart3,
  Settings,
  LayoutDashboard,
  Ticket,
  LogOut,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 border-r h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">RealEstateAI</h2>
        </div>
        <div className="px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserButton />
              <div className="text-sm font-medium">
                <p>Welcome back</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-3">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
            MAIN
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/dashboard"
              icon={<LayoutDashboard className="mr-2 h-4 w-4" />}
              isActive={pathname === "/dashboard"}
            >
              Dashboard
            </NavItem>
            <NavItem
              href="/dashboard/projects"
              icon={<Building2 className="mr-2 h-4 w-4" />}
              isActive={pathname.startsWith("/dashboard/projects")}
            >
              Projects
            </NavItem>
            <NavItem
              href="/dashboard/clients"
              icon={<Users className="mr-2 h-4 w-4" />}
              isActive={pathname.startsWith("/dashboard/clients")}
            >
              Clients
            </NavItem>
            <NavItem
              href="/dashboard/leads"
              icon={<BarChart3 className="mr-2 h-4 w-4" />}
              isActive={pathname.startsWith("/dashboard/leads")}
            >
              Lead Scoring
            </NavItem>
          </div>
        </div>
        <div className="px-3">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
            COMMUNICATION
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/dashboard/chat"
              icon={<MessageSquare className="mr-2 h-4 w-4" />}
              isActive={pathname.startsWith("/dashboard/chat")}
            >
              AI Chat
            </NavItem>
            <NavItem
              href="/dashboard/voice"
              icon={<Headphones className="mr-2 h-4 w-4" />}
              isActive={pathname.startsWith("/dashboard/voice")}
            >
              Voice Processing
            </NavItem>
            <NavItem
              href="/dashboard/translate"
              icon={<Globe className="mr-2 h-4 w-4" />}
              isActive={pathname.startsWith("/dashboard/translate")}
            >
              Translation
            </NavItem>
            <NavItem
              href="/dashboard/summarize"
              icon={<FileText className="mr-2 h-4 w-4" />}
              isActive={pathname.startsWith("/dashboard/summarize")}
            >
              Summarization
            </NavItem>
          </div>
        </div>
        <div className="px-3">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
            SUPPORT
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/dashboard/tickets"
              icon={<Ticket className="mr-2 h-4 w-4" />}
              isActive={pathname.startsWith("/dashboard/tickets")}
            >
              Tickets
            </NavItem>
            <NavItem
              href="/dashboard/settings"
              icon={<Settings className="mr-2 h-4 w-4" />}
              isActive={pathname.startsWith("/dashboard/settings")}
            >
              Settings
            </NavItem>
          </div>
        </div>
      </div>
      <div className="px-3 absolute bottom-4 w-full pr-8">
        <Button variant="outline" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  children: React.ReactNode;
}

function NavItem({ href, icon, isActive, children }: NavItemProps) {
  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start"
    >
      <Link href={href}>
        {icon}
        {children}
      </Link>
    </Button>
  );
}