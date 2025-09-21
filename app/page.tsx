import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';
import React from 'react';
import { Vortex } from "@/components/ui/vortex";
import BentoGridDemo from "@/components/bento-grid-demo";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Glass Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                <Building2 className="h-6 w-6 text-teal-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
                OmniSpeak
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button 
                  variant="outline" 
                  className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 backdrop-blur-sm rounded-xl transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Full Vortex Background */}
      <section className="relative pt-20 pb-16 px-6 min-h-screen">
        <Vortex
          backgroundColor="transparent"
          rangeY={400}
          particleCount={300}
          baseHue={180}
          className="absolute inset-0 w-full h-full"
        >
          <div className="container mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      Agentic AI Real Estate
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
                      Communication Hub
                    </span>
                  </h1>
                  <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                    Multi-agent AI system transforming conversations into actionable insights. 
                    Automate analysis, generate documents, and accelerate decision-making.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/dashboard">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Open Dashboard
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 backdrop-blur-sm rounded-xl px-8 py-3 transition-all duration-300"
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="backdrop-blur-sm bg-slate-900/90 rounded-2xl border border-slate-800 p-8 shadow-2xl">
                  <div className="text-center space-y-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      Autonomous AI Agents
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      Financial analysis, market intelligence, project automation, and 
                      voice communication — all powered by specialized AI agents.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-teal-400">4+</div>
                        <div className="text-sm text-slate-400">AI Agents</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-sky-400">95%</div>
                        <div className="text-sm text-slate-400">Accuracy Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Vortex>
      </section>

      {/* Features Section with Bento Grid */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Powerful AI Agents for Modern Real Estate
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Specialized agents handling every aspect of your real estate workflow
            </p>
          </div>
          <BentoGridDemo />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="backdrop-blur-sm bg-slate-900/90 rounded-3xl border border-slate-800 p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Ready to Transform Your Real Estate Business?
            </h2>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Join professionals who are automating workflows, improving client relationships, and closing more deals with AI.
            </p>
            <Link href="/sign-up">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white rounded-xl px-12 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 backdrop-blur-sm bg-slate-900/80 border-t border-slate-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                <Building2 className="h-5 w-5 text-teal-400" />
              </div>
              <span className="font-bold bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
                OmniSpeak
              </span>
            </div>
            <p className="text-slate-400 text-sm">Powered by AI, Built for Real Estate</p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-slate-400 hover:text-teal-400 transition-colors">Terms</Link>
              <Link href="/privacy" className="text-slate-400 hover:text-teal-400 transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
