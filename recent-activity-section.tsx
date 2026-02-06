"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Earthquake {
  place: string
  mag: number
  lat: number
  lng: number
  time: string
  depth: number
}

interface RecentActivitySectionProps {
  selectedLocation?: Earthquake | null
  onSelectEvent?: (location: Earthquake) => void
  searchRegion?: string
}

export function RecentActivitySection({ selectedLocation, onSelectEvent, searchRegion = "" }: RecentActivitySectionProps) {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        setIsLoading(true)
        // Fetch all earthquakes from last 24 hours
        const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
        const data = await response.json()
        
        const earthquakesData = data.features.map((feature: any) => ({
          place: feature.properties.place || "Unknown Location",
          mag: feature.properties.mag || 0,
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          time: new Date(feature.properties.time).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          depth: feature.geometry.coordinates[2] || 0,
        }))
        
        setEarthquakes(earthquakesData)
      } catch (error) {
        console.error("Error fetching earthquakes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEarthquakes()
    const interval = setInterval(fetchEarthquakes, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const getMagnitudeColor = (mag: number) => {
    if (mag >= 7) return "bg-red-500/20 text-red-300 border-red-500/30"
    if (mag >= 6) return "bg-orange-500/20 text-orange-300 border-orange-500/30"
    if (mag >= 5) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    if (mag >= 4) return "bg-amber-500/20 text-amber-300 border-amber-500/30"
    return "bg-green-500/20 text-green-300 border-green-500/30"
  }

  // Filter earthquakes based on search region
  const filteredEarthquakes = earthquakes.filter((eq) => {
    if (!searchRegion || searchRegion.trim() === "") return true
    return eq.place.toLowerCase().includes(searchRegion.toLowerCase())
  })

  // Split into first 20 and remaining
  const firstTwenty = filteredEarthquakes.slice(0, 20)
  const remaining = filteredEarthquakes.slice(20)

  const formatCoordinate = (value: number): string => {
    return Math.abs(value).toFixed(2)
  }

  const renderEarthquakeTable = (data: Earthquake[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700/50">
            <th className="text-left py-3 px-4 text-slate-300 font-semibold whitespace-nowrap">Location</th>
            <th className="text-center py-3 px-4 text-slate-300 font-semibold whitespace-nowrap">Magnitude</th>
            <th className="text-left py-3 px-4 text-slate-300 font-semibold whitespace-nowrap">Date & Time</th>
            <th className="text-center py-3 px-4 text-slate-300 font-semibold whitespace-nowrap">Depth (km)</th>
            <th className="text-center py-3 px-4 text-slate-300 font-semibold whitespace-nowrap">Coordinates</th>
          </tr>
        </thead>
        <tbody>
          {data.map((quake, idx) => (
            <tr
              key={idx}
              onClick={() => onSelectEvent?.(quake)}
              className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors cursor-pointer"
            >
              <td className="py-3 px-4 text-slate-200 font-medium break-words">{quake.place}</td>
              <td className="py-3 px-4 text-center">
                <Badge className={`${getMagnitudeColor(quake.mag)} border whitespace-nowrap`}>M{quake.mag.toFixed(1)}</Badge>
              </td>
              <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{quake.time}</td>
              <td className="py-3 px-4 text-slate-300 text-center whitespace-nowrap">{quake.depth.toFixed(1)}</td>
              <td className="py-3 px-4 text-slate-300 text-center whitespace-nowrap text-xs">
                {formatCoordinate(quake.lat)}°N, {formatCoordinate(quake.lng)}°E
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20 p-6 w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Recent Activity - Last 24 Hours</h2>
        <p className="text-sm text-slate-400">Total earthquakes recorded: {filteredEarthquakes.length}</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-400">Loading earthquake data...</p>
        </div>
      ) : filteredEarthquakes.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-400">{searchRegion ? `No earthquakes found for "${searchRegion}"` : "No earthquake data available"}</p>
        </div>
      ) : (
        <Tabs defaultValue="latest" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-700/30 border border-cyan-500/20">
            <TabsTrigger value="latest" className="text-sm">
              Latest 20 ({firstTwenty.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="text-sm" disabled={remaining.length === 0}>
              All 24 Hours ({remaining.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="latest" className="mt-4">
            {firstTwenty.length > 0 ? (
              <>
                {renderEarthquakeTable(firstTwenty)}
                <div className="mt-4 text-xs text-slate-500 pt-2 border-t border-slate-700/30">
                  <p>Showing {firstTwenty.length} earthquakes. Click on any row to select and view details.</p>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-400">No earthquakes in this view</div>
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            {remaining.length > 0 ? (
              <>
                {renderEarthquakeTable(remaining)}
                <div className="mt-4 text-xs text-slate-500 pt-2 border-t border-slate-700/30">
                  <p>Showing {remaining.length} additional earthquakes from the last 24 hours.</p>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-400">No additional earthquakes available</div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <div className="mt-6 text-xs text-slate-500 border-t border-slate-700/30 pt-4">
        <p>Data source: USGS Earthquake Hazards Program. Last updated: {new Date().toLocaleString()}</p>
      </div>
    </Card>
  )
}
