"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, MessageSquare, Users, BarChart3, TrendingUp, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ClientChart } from "@/components/charts/client-chart";
import { ActivityItem } from "@/components/dashboard/activity-item";
import { auth } from "@clerk/nextjs/server";

const data = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 19 },
  { name: 'Mar', value: 15 },
  { name: 'Apr', value: 27 },
  { name: 'May', value: 32 },
  { name: 'Jun', value: 24 },
  { name: 'Jul', value: 38 },
];

export default function DashboardPage() {
  // const { userId } = auth();

  // if (!userId) {
  //   // Handle unauthenticated state
  //   return <div>Redirecting to login...</div>;
  // }
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Score Avg.</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2</div>
            <p className="text-xs text-muted-foreground">+0.3 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Client Interactions</CardTitle>
                <CardDescription>
                  AI and human interactions with clients over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <CardContent className="pl-2">
                      <ClientChart data={data} />
                    </CardContent>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest client interactions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ActivityItem
                    icon={<MessageSquare className="h-4 w-4" />}
                    title="New message from John Smith"
                    description="Regarding property viewing on Friday"
                    timestamp="2 hours ago"
                  />
                  <ActivityItem
                    icon={<TrendingUp className="h-4 w-4" />}
                    title="Lead score increased"
                    description="Sarah Johnson's lead score is now 8.5"
                    timestamp="5 hours ago"
                  />
                  <ActivityItem
                    icon={<Building2 className="h-4 w-4" />}
                    title="New property added"
                    description="123 Main St. has been added to your listings"
                    timestamp="Yesterday"
                  />
                  <ActivityItem
                    icon={<Users className="h-4 w-4" />}
                    title="New client registered"
                    description="Michael Brown has registered through the website"
                    timestamp="2 days ago"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Detailed analytics will be displayed here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generated reports will be displayed here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Reports content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// interface ActivityItemProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   timestamp: string;
// }

// function ActivityItem({ icon, title, description, timestamp }: ActivityItemProps) {
//   return (
//     <div className="flex items-start space-x-4">
//       <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
//       <div className="flex-1 space-y-1">
//         <p className="text-sm font-medium leading-none">{title}</p>
//         <p className="text-sm text-muted-foreground">{description}</p>
//       </div>
//       <div className="flex items-center">
//         <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
//         <span className="text-xs text-muted-foreground">{timestamp}</span>
//       </div>
//     </div>
//   );
// }