"use client"

import { Globe, Zap, TrendingUp, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroNavigation() {
  return (
    <div className="bg-black border-b border-cyan-500/20 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Live Monitoring Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/40 bg-cyan-500/10">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-cyan-400 font-medium">Live Monitoring Active</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI-Driven Seismic Analysis
            <br />
            <span className="text-cyan-400">&</span> <span className="text-cyan-400">Real-Time Response</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Advanced spatiotemporal analysis of global seismic activity. Monitor earthquakes in real-time, understand risk levels, 
            and stay prepared with AI-powered insights.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6 py-2">
            View Live Map →
          </Button>
          <Button variant="outline" className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 px-6 py-2 bg-transparent">
            Learn More
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* 24/7 Coverage */}
          <div className="bg-slate-900/40 border border-cyan-500/20 rounded-lg p-6 text-center">
            <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm text-gray-400">Global Coverage</div>
          </div>

          {/* Detection Speed */}
          <div className="bg-slate-900/40 border border-cyan-500/20 rounded-lg p-6 text-center">
            <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">&lt;2 min</div>
            <div className="text-sm text-gray-400">Avg. Detection</div>
          </div>

          {/* Major Earthquakes */}
          <div className="bg-slate-900/40 border border-cyan-500/20 rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">~15-16</div>
            <div className="text-sm text-gray-400">M7+ Annually</div>
          </div>

          {/* Active Stations */}
          <div className="bg-slate-900/40 border border-cyan-500/20 rounded-lg p-6 text-center">
            <Radio className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">2,000+</div>
            <div className="text-sm text-gray-400">Active Stations</div>
          </div>
        </div>
      </div>
    </div>
  )
}
