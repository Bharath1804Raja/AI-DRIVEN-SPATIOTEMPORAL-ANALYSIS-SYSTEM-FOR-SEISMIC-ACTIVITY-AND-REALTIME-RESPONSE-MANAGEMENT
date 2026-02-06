"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface RiskForecast {
  region: string
  probability: number
  riskLevel: string
  confidence: number
}

export function ProbabilisticRiskModule() {
  const [forecasts, setForecasts] = useState<RiskForecast[]>([])
  const [loading, setLoading] = useState(true)
  const [forecastDays, setForecastDays] = useState("7")

  useEffect(() => {
    // Simulate fetching probabilistic forecasts
    setLoading(true)
    const timer = setTimeout(() => {
      const mockForecasts: RiskForecast[] = [
        {
          region: "Japan Trench",
          probability: 0.62,
          riskLevel: "Elevated",
          confidence: 0.85,
        },
        {
          region: "San Andreas",
          probability: 0.48,
          riskLevel: "Moderate",
          confidence: 0.78,
        },
        {
          region: "Himalayas",
          probability: 0.35,
          riskLevel: "Moderate",
          confidence: 0.72,
        },
        {
          region: "Cascadia",
          probability: 0.28,
          riskLevel: "Low",
          confidence: 0.68,
        },
        {
          region: "Philippine Trench",
          probability: 0.71,
          riskLevel: "High",
          confidence: 0.81,
        },
      ].sort((a, b) => b.probability - a.probability)

      setForecasts(mockForecasts)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [forecastDays])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-red-400 bg-red-500/10 border-red-500/30"
      case "Elevated":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30"
      case "Moderate":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
      default:
        return "text-green-400 bg-green-500/10 border-green-500/30"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20 p-6 h-fit sticky top-24">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Seismic Forecast
          </h3>
          <p className="text-xs text-slate-400 mb-3">Global Probabilistic Risk Outlook - Not exact prediction</p>

          {/* Forecast Window Selector */}
          <select
            value={forecastDays}
            onChange={(e) => setForecastDays(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-700/50 border border-cyan-500/30 rounded text-white"
            aria-label="Forecast window in days"
          >
            <option value="3">3 Days Ahead</option>
            <option value="7">7 Days Ahead</option>
            <option value="14">14 Days Ahead</option>
            <option value="30">30 Days Ahead</option>
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-12 bg-slate-700/30 rounded" />
            <div className="h-12 bg-slate-700/30 rounded" />
            <div className="h-12 bg-slate-700/30 rounded" />
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {forecasts.map((forecast, idx) => (
              <div key={idx} className={`border rounded p-3 ${getRiskColor(forecast.riskLevel)}`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-sm">{forecast.region}</h4>
                  <span className="text-xs font-bold">{(forecast.probability * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-1.5 mb-1">
                  <div
                    className={`h-full rounded-full transition-all ${
                      forecast.probability > 0.6
                        ? "bg-red-500"
                        : forecast.probability > 0.4
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${forecast.probability * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>{forecast.riskLevel}</span>
                  <span className="text-slate-300">Confidence: {(forecast.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-slate-700/20 border border-slate-600/30 rounded p-2 text-xs text-slate-400">
          <p className="font-semibold mb-1">Disclaimer:</p>
          <p>
            These forecasts are probabilistic estimates based on historical patterns and ML models. Earthquakes cannot
            be predicted with exact timing or location.
          </p>
        </div>
      </div>
    </Card>
  )
}
