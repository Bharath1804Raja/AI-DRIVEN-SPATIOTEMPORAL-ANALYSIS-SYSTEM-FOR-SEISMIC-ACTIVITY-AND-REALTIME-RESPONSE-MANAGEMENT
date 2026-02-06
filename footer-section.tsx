"use client"

import { ExternalLink } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="bg-slate-950/50 border-t border-cyan-500/10 p-4 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Data Sources */}
          <div>
            <h5 className="text-sm font-semibold text-white mb-3">Data Sources</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://earthquake.usgs.gov/"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  USGS Earthquake Hazards <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://earthquake.usgs.gov/earthquakes/map/"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  USGS Real-Time Earthquake Map <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Last Update */}
          <div>
            <h5 className="text-sm font-semibold text-white mb-3">System Status</h5>
            <p className="text-xs text-slate-400">
              Last data update: <span className="text-green-400 font-semibold">2 minutes ago</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">Forecasting Models: ARIMA + LSTM</p>
          </div>

          {/* AI Models Info */}
          <div>
            <h5 className="text-sm font-semibold text-white mb-3">Analytics Technology</h5>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>✓ ARIMA Time Series Forecasting</li>
              <li>✓ LSTM Deep Learning Models</li>
              <li>✓ Real-time Risk Assessment</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 text-center text-xs text-slate-500">
          <p>SeismoAI © 2025 | AI-Driven Spatiotemporal Seismic Analysis & Real-Time Response Management</p>
          <p className="mt-1">Data sourced from USGS. For research purposes only. Not for emergency response.</p>
        </div>
      </div>
    </footer>
  )
}
