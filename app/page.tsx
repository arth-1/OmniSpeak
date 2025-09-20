import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';
import React from 'react';
import { Vortex } from "@/components/ui/vortex";
import BentoGridDemo from "@/components/bento-grid-demo";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Glass Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-sm border border-white/20">
                <Building2 className="h-6 w-6 text-blue-300" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                OmniSpeak
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300">
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
          particleCount={500}
          baseHue={220}
          className="absolute inset-0 w-full h-full"
        >
          <div className="container mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                      AI-Powered Real Estate
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                      Communication Hub
                    </span>
                  </h1>
                  <p className="text-xl text-blue-100/80 leading-relaxed max-w-lg">
                    Transform conversations into insights. Transcribe calls, translate languages, 
                    and generate summaries — all powered by cutting-edge AI.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/dashboard">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Open Dashboard
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl px-8 py-3 transition-all duration-300"
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20 p-8 shadow-2xl">
                  <div className="text-center space-y-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      Transform Client Communication
                    </h3>
                    <p className="text-blue-100/80 text-lg leading-relaxed">
                      AI-powered conversations, instant translations, and automatic summaries 
                      to help you close deals faster than ever.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-300">95%</div>
                        <div className="text-sm text-blue-100/60">Accuracy Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">50+</div>
                        <div className="text-sm text-blue-100/60">Languages</div>
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
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              Powerful Features for Modern Agents
            </h2>
            <p className="text-blue-100/70 text-lg max-w-2xl mx-auto">
              Everything you need to communicate effectively and close deals faster
            </p>
          </div>
          <BentoGridDemo />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="backdrop-blur-sm bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl border border-white/20 p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              Ready to Transform Your Real Estate Business?
            </h2>
            <p className="text-xl text-blue-100/80 mb-10 leading-relaxed">
              Join thousands of agents who are saving time, improving client relationships, and closing more deals.
            </p>
            <Link href="/sign-up">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-12 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 backdrop-blur-sm bg-white/5 border-t border-white/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-sm border border-white/20">
                <Building2 className="h-5 w-5 text-blue-300" />
              </div>
              <span className="font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                OmniSpeak
              </span>
            </div>
            <p className="text-blue-100/60 text-sm">Made with love and lots of coffee</p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-blue-100/60 hover:text-blue-300 transition-colors">Terms</Link>
              <Link href="/privacy" className="text-blue-100/60 hover:text-blue-300 transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
