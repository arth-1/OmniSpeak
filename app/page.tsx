import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, MessageSquare, Headphones, Globe, FileText, Users, BarChart3 } from 'lucide-react';
import React from 'react';

// app/dashboard/page.tsx
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary/15 via-background to-primary/10 border-b">
        <div className="container mx-auto px-4 py-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Omni Speak
            </span>
          </div>
          <div className="space-x-4">
            <Link href="/sign-in">
              <Button variant="outline" className="rounded-full px-6 shadow-sm hover:shadow-md transition-shadow">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="rounded-full px-6 shadow-lg hover:shadow-xl transition-shadow">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full border">
              <span className="text-sm font-medium text-primary">AI Powered Real Estate Solutions</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-6 text-gray-200">
  Revolutionize Your Real Estate Communication
</h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Our AI-powered assistant helps real estate professionals communicate effectively, 
              manage clients, and close deals faster with advanced language processing and analytics.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-shadow">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-200">
  Powerful Features for Real Estate Professionals
</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<MessageSquare className="h-8 w-8" />}
                title="AI Chat Assistant"
                description="Intelligent chat system that can answer client questions, schedule viewings, and provide property information."
              />
              <FeatureCard 
                icon={<Headphones className="h-8 w-8" />}
                title="Voice Processing"
                description="Convert voice to text, transcribe calls, and analyze conversations for better client understanding."
              />
              <FeatureCard 
                icon={<Globe className="h-8 w-8" />}
                title="Multi-language Support"
                description="Translate communications in real-time to serve international clients in their preferred language."
              />
              <FeatureCard 
                icon={<FileText className="h-8 w-8" />}
                title="Smart Summarization"
                description="Automatically generate summaries of long conversations, documents, and property details."
              />
              <FeatureCard 
                icon={<Users className="h-8 w-8" />}
                title="Client Management"
                description="Organize clients, track interactions, and manage communication all in one place."
              />
              <FeatureCard 
                icon={<BarChart3 className="h-8 w-8" />}
                title="Lead Scoring"
                description="Analyze client interactions to identify high-potential leads and prioritize your efforts."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-r from-primary to-primary/90">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6 text-primary-foreground">
              Ready to Transform Your Real Estate Business?
            </h2>
            <p className="text-xl mb-10 text-primary-foreground/90">
              Join thousands of real estate professionals who are saving time, improving client relationships, and closing more deals.
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-shadow">
                Get Started Today
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="p-2 rounded-full bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Omni Speak
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Omni Speak. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// FeatureCard Component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group bg-card rounded-xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
      <div className="mb-6 flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary">
        {React.cloneElement(icon as React.ReactElement, { className: "h-8 w-8" })}
      </div>
      <h3 className="text-xl font-semibold mb-4 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}