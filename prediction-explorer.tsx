"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface PredictionParams {
  region: string
  radiusKm: number
  minMagnitude: number
  timeHorizon: "7days" | "30days" | "1year"
  model: "ensemble" | "gnn" | "lstm" | "rf"
}

export function PredictionExplorer() {
  const [params, setParams] = useState<PredictionParams>({
    region: "Japan Trench",
    radiusKm: 150,
    minMagnitude: 4.5,
    timeHorizon: "30days",
    model: "ensemble",
  })

  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleGeneratePrediction = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/predictions/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })
      const data = await response.json()
      setPrediction(data)
    } catch (error) {
      console.error("Prediction error:", error)
    }
    setLoading(false)
  }

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      Low: "bg-green-900",
      Moderate: "bg-yellow-900",
      Elevated: "bg-orange-900",
      High: "bg-red-900",
      Critical: "bg-red-950",
    }
    return colors[level] || "bg-gray-900"
  }

  return (
    <div className="space-y-6">
      <Card className="border-cyan-500/30 bg-slate-900/50">
        <CardHeader>
          <CardTitle>Earthquake Prediction Explorer</CardTitle>
          <CardDescription>Configure parameters and generate AI-powered forecasts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Region Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Seismic Region</label>
            <Select value={params.region} onValueChange={(v) => setParams({ ...params, region: v })}>
              <SelectTrigger className="bg-slate-800 border-cyan-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Japan Trench">Japan Trench</SelectItem>
                <SelectItem value="San Andreas">San Andreas Fault</SelectItem>
                <SelectItem value="Himalayas">Himalayas</SelectItem>
                <SelectItem value="Ring of Fire">Ring of Fire</SelectItem>
                <SelectItem value="Mid-Atlantic">Mid-Atlantic Ridge</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Radius Selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">Search Radius: {params.radiusKm} km</label>
            <Slider
              min={30}
              max={300}
              step={10}
              value={[params.radiusKm]}
              onValueChange={(v) => setParams({ ...params, radiusKm: v[0] })}
              className="w-full"
            />
          </div>

          {/* Magnitude Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Minimum Magnitude: {params.minMagnitude.toFixed(1)}
            </label>
            <Slider
              min={3.0}
              max={7.0}
              step={0.1}
              value={[params.minMagnitude]}
              onValueChange={(v) => setParams({ ...params, minMagnitude: v[0] })}
              className="w-full"
            />
          </div>

          {/* Time Horizon */}
          <div>
            <label className="text-sm font-medium mb-2 block">Forecast Window</label>
            <Select value={params.timeHorizon} onValueChange={(v: any) => setParams({ ...params, timeHorizon: v })}>
              <SelectTrigger className="bg-slate-800 border-cyan-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 Days (Short-term)</SelectItem>
                <SelectItem value="30days">30 Days (Short-term)</SelectItem>
                <SelectItem value="1year">1 Year (Long-term)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Model Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">AI Model</label>
            <Select value={params.model} onValueChange={(v: any) => setParams({ ...params, model: v })}>
              <SelectTrigger className="bg-slate-800 border-cyan-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ensemble">Ensemble (GNN + LSTM + RF)</SelectItem>
                <SelectItem value="gnn">Graph Neural Network</SelectItem>
                <SelectItem value="lstm">LSTM Temporal</SelectItem>
                <SelectItem value="rf">Random Forest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGeneratePrediction}
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            {loading ? "Generating..." : "Generate Prediction"}
          </Button>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {prediction && (
        <Card className={`border-cyan-500/30 ${getRiskColor(prediction.riskLevel)}`}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{prediction.region}</CardTitle>
                <CardDescription>Prediction Results</CardDescription>
              </div>
              <Badge className="bg-cyan-600">{prediction.riskLevel}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800/50 rounded border border-cyan-500/20">
                <p className="text-xs text-gray-400">7-Day Probability</p>
                <p className="text-2xl font-bold text-cyan-400">{(prediction.probability7Days * 100).toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded border border-cyan-500/20">
                <p className="text-xs text-gray-400">30-Day Probability</p>
                <p className="text-2xl font-bold text-yellow-400">{(prediction.probability30Days * 100).toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded border border-cyan-500/20">
                <p className="text-xs text-gray-400">Expected Magnitude</p>
                <p className="text-2xl font-bold text-orange-400">
                  {prediction.expectedMagnitudeRange[0].toFixed(1)}-{prediction.expectedMagnitudeRange[1].toFixed(1)}
                </p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded border border-cyan-500/20">
                <p className="text-xs text-gray-400">Confidence</p>
                <p className="text-2xl font-bold text-green-400">{(prediction.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Top Contributing Factors:</p>
              <div className="flex flex-wrap gap-2">
                {prediction.topFactors.map((factor: string, i: number) => (
                  <Badge key={i} variant="outline" className="border-cyan-500/50">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              ⚠️ Note: These are probabilistic forecasts based on historical patterns and AI models. Exact time and
              location prediction is not possible. Always follow official earthquake alerts.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
