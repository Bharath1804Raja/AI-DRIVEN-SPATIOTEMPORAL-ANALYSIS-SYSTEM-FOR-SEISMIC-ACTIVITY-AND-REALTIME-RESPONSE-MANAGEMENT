"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RiskZone {
  lat: number
  lng: number
  probability: number
  radius: number
  magnitude: [number, number]
}

interface RiskVisualizationMapProps {
  riskZones: RiskZone[]
  width?: string
  height?: string
}

export function RiskVisualizationMap({ riskZones, width = "100%", height = "500px" }: RiskVisualizationMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || riskZones.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Draw background (world map outline simplified)
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#1e3a4a"
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 180; i += 30) {
      const x = (i / 180) * canvas.width
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    for (let i = 0; i <= 90; i += 30) {
      const y = (i / 90) * canvas.height
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw risk zones
    riskZones.forEach((zone) => {
      const x = ((zone.lng + 180) / 360) * canvas.width
      const y = ((90 - zone.lat) / 180) * canvas.height
      const radiusPixels = (zone.radius / 20000) * canvas.width

      // Color based on probability
      let color = "#22c55e" // Green
      if (zone.probability > 0.7)
        color = "#dc2626" // Red
      else if (zone.probability > 0.5)
        color = "#f97316" // Orange
      else if (zone.probability > 0.3)
        color = "#eab308" // Yellow
      else if (zone.probability > 0.15) color = "#84cc16" // Lime

      // Draw zone circle with glow
      ctx.fillStyle = color + "30" // Semi-transparent
      ctx.beginPath()
      ctx.arc(x, y, radiusPixels, 0, Math.PI * 2)
      ctx.fill()

      // Draw glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radiusPixels * 1.5)
      gradient.addColorStop(0, color + "60")
      gradient.addColorStop(1, color + "00")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radiusPixels * 1.5, 0, Math.PI * 2)
      ctx.fill()

      // Draw border
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, radiusPixels, 0, Math.PI * 2)
      ctx.stroke()

      // Draw label
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${(zone.probability * 100).toFixed(0)}%`, x, y)
    })
  }, [riskZones])

  return (
    <Card className="border-cyan-500/30 bg-slate-900/50">
      <CardHeader>
        <CardTitle>Global Earthquake Risk Visualization</CardTitle>
        <CardDescription>Predicted high-risk zones for seismic activity</CardDescription>
      </CardHeader>
      <CardContent>
        <canvas ref={canvasRef} style={{ width, height }} className="border border-cyan-500/30 rounded bg-slate-950" />
        <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded" />
            <span>Low Risk (&lt;15%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-lime-500 rounded" />
            <span>Moderate (15-30%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span>Elevated (30-50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded" />
            <span>High (50-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded" />
            <span>Critical (&gt;70%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
