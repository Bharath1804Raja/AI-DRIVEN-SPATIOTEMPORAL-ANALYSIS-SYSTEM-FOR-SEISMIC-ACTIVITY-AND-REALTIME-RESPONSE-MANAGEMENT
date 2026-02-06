"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { PredictionWebSocket, type PredictionUpdate } from "@/lib/websocket-predictions"
import { AlertTriangle, TrendingUp, MapPin, Gauge } from "lucide-react"

interface TopPredictionsDisplayProps {
  riskZones: Array<{
    lat: number
    lng: number
    probability: number
    radius: number
    magnitude: [number, number]
  }>
}

export function TopPredictionsDisplay({ riskZones }: TopPredictionsDisplayProps) {
  const [predictions, setPredictions] = useState<PredictionUpdate[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const ws = new PredictionWebSocket()
    setIsConnected(true)
    setIsLoading(false)

    ws.connect(
      (updates) => {
        // Sort by probability and take top 10
        const top10 = updates.sort((a, b) => b.probability - a.probability).slice(0, 10)
        setPredictions(top10)
      },
      (error) => {
        console.error("WebSocket error:", error)
        setIsConnected(false)
      }
    )

    return () => {
      ws.disconnect()
    }
  }, [])

  const getRiskLevel = (probability: number) => {
    if (probability > 0.7) return "Critical"
    if (probability > 0.5) return "High"
    if (probability > 0.3) return "Moderate"
    return "Low"
  }

  const getRiskColor = (probability: number) => {
    if (probability > 0.7) return "border-red-500/50 bg-red-500/10"
    if (probability > 0.5) return "border-orange-500/50 bg-orange-500/10"
    if (probability > 0.3) return "border-yellow-500/50 bg-yellow-500/10"
    return "border-green-500/50 bg-green-500/10"
  }

  const getRiskTextColor = (probability: number) => {
    if (probability > 0.7) return "text-red-400"
    if (probability > 0.5) return "text-orange-400"
    if (probability > 0.3) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Top 10 Risk Regions</h2>
          <p className="text-xs sm:text-sm text-gray-400">Real-time predictions updated every 5 seconds</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400 mx-auto mb-2"></div>
            <p className="text-gray-400 text-sm">Loading predictions...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {predictions.map((pred, index) => (
            <Card
              key={pred.id}
              className={`p-3 sm:p-4 border-l-4 border-l-cyan-500 cursor-pointer transition-all hover:shadow-lg hover:shadow-cyan-500/20 ${getRiskColor(pred.probability)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                    <h3 className="text-sm sm:text-base font-semibold text-white truncate">{pred.region}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 text-gray-300">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                      <span>{pred.latitude.toFixed(2)}°, {pred.longitude.toFixed(2)}°</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300">
                      <Gauge className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                      <span>{pred.radius.toFixed(0)} km</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg sm:text-xl font-bold ${getRiskTextColor(pred.probability)}`}>
                    {(pred.probability * 100).toFixed(0)}%
                  </div>
                  <p className={`text-xs sm:text-sm font-medium ${getRiskTextColor(pred.probability)}`}>
                    {getRiskLevel(pred.probability)}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400">Magnitude: </span>
                  <span className="text-white font-semibold">
                    {pred.magnitude[0].toFixed(1)} - {pred.magnitude[1].toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-cyan-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>{(pred.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
