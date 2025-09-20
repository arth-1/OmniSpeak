import React from "react";
import { Vortex } from "@/components/ui/vortex";

export default function VortexDemoSecond() {
  return (
    <div className="w-full mx-auto rounded-2xl h-[560px] overflow-hidden">
      <Vortex
        backgroundColor="transparent"
        rangeY={200}
        particleCount={400}
        baseHue={220}
        className="flex items-center flex-col justify-center px-8 md:px-12 py-8 w-full h-full"
      >
        <div className="text-center space-y-6 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20 p-8">
          <h2 className="text-white text-2xl md:text-4xl font-bold">
            Transform Client Communication
          </h2>
          <p className="text-blue-100/80 text-sm md:text-lg max-w-md mx-auto leading-relaxed">
            AI-powered conversations, instant translations, and automatic summaries 
            to help you close deals faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <a 
              href="/sign-up" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </a>
            <a 
              href="#features" 
              className="inline-flex items-center justify-center px-6 py-3 text-white border border-white/30 hover:bg-white/10 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm"
            >
              Explore Features
            </a>
          </div>
        </div>
      </Vortex>
    </div>
  );
}
