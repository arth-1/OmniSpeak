import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, MessageSquare, Headphones, Globe, FileText, Users, BarChart3 } from 'lucide-react';


// app/dashboard/page.tsx
export const dynamic = "force-dynamic";

export default function Home() {
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">RealEstateAI</span>
          </div>
          <div className="space-x-4">
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Revolutionize Your Real Estate Communication
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Our AI-powered assistant helps real estate professionals communicate effectively, 
              manage clients, and close deals faster with advanced language processing and analytics.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="px-8">Start Free Trial</Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="px-8">Explore Features</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Powerful Features for Real Estate Professionals</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<MessageSquare className="h-10 w-10 text-primary" />}
                title="AI Chat Assistant"
                description="Intelligent chat system that can answer client questions, schedule viewings, and provide property information."
              />
              <FeatureCard 
                icon={<Headphones className="h-10 w-10 text-primary" />}
                title="Voice Processing"
                description="Convert voice to text, transcribe calls, and analyze conversations for better client understanding."
              />
              <FeatureCard 
                icon={<Globe className="h-10 w-10 text-primary" />}
                title="Multi-language Support"
                description="Translate communications in real-time to serve international clients in their preferred language."
              />
              <FeatureCard 
                icon={<FileText className="h-10 w-10 text-primary" />}
                title="Smart Summarization"
                description="Automatically generate summaries of long conversations, documents, and property details."
              />
              <FeatureCard 
                icon={<Users className="h-10 w-10 text-primary" />}
                title="Client Management"
                description="Organize clients, track interactions, and manage communication all in one place."
              />
              <FeatureCard 
                icon={<BarChart3 className="h-10 w-10 text-primary" />}
                title="Lead Scoring"
                description="Analyze client interactions to identify high-potential leads and prioritize your efforts."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Real Estate Business?</h2>
            <p className="text-xl mb-10 opacity-90">
              Join thousands of real estate professionals who are saving time, improving client relationships, and closing more deals.
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="px-8">Get Started Today</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">RealEstateAI</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 RealEstateAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}