"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface SelectedLocation {
  place: string
  mag: number
  lat: number
  lng: number
  time: string
  depth: number
}

interface RecentEventsPanelProps {
  selectedLocation: SelectedLocation | null
  onSelectEvent: (location: SelectedLocation) => void
  timeRange: string
}

export function RecentEventsPanel({ selectedLocation, onSelectEvent, timeRange }: RecentEventsPanelProps) {
  const [recentQuakes, setRecentQuakes] = useState<SelectedLocation[]>([])

  useEffect(() => {
    // Fetch real quakes from USGS
    const fetchQuakes = async () => {
      try {
        const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
        const data = await response.json()
        const quakes = data.features.slice(0, 10).map((feature: any) => ({
          place: feature.properties.place,
          mag: feature.properties.mag,
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          time: new Date(feature.properties.time).toLocaleString(),
          depth: feature.geometry.coordinates[2],
        }))
        setRecentQuakes(quakes)
      } catch (error) {
        console.log("[v0] Error fetching quakes:", error)
      }
    }
    fetchQuakes()
  }, [timeRange])

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20 p-4 h-full flex flex-col">
      <h4 className="text-sm font-semibold text-white mb-4">Latest Earthquakes</h4>
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-4">
          {recentQuakes.map((quake, idx) => (
            <button
              key={idx}
              onClick={() => onSelectEvent(quake)}
              className={`w-full text-left p-3 rounded border transition-all ${
                selectedLocation?.place === quake.place
                  ? "bg-cyan-500/20 border-cyan-400/50"
                  : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 hover:border-cyan-500/30"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{quake.place}</p>
                  <p className="text-xs text-slate-400 mt-1">{quake.time}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`ml-2 flex-shrink-0 ${
                    quake.mag >= 7
                      ? "bg-red-500/20 text-red-300"
                      : quake.mag >= 6
                        ? "bg-orange-500/20 text-orange-300"
                        : quake.mag >= 5
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-green-500/20 text-green-300"
                  }`}
                >
                  M{quake.mag}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
