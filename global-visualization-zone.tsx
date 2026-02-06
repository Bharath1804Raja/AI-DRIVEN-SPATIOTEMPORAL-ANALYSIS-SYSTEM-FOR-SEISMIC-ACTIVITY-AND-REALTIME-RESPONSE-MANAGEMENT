"use client"

import { GlobeSection } from "@/components/globe-section"
import { Card } from "@/components/ui/card"

interface SelectedLocation {
  place: string
  mag: number
  lat: number
  lng: number
  time: string
  depth: number
}

interface GlobalVisualizationZoneProps {
  onLocationSelect: (location: SelectedLocation | null) => void
  selectedLocation: SelectedLocation | null
  timeRange: string
  magnitudeRange: [number, number]
  searchRegion: string
}

export function GlobalVisualizationZone({
  onLocationSelect,
  selectedLocation,
  timeRange,
  magnitudeRange,
  searchRegion,
}: GlobalVisualizationZoneProps) {
  return (
    <Card className="bg-slate-800/50 border-cyan-500/20 p-4 h-full">
      <div className="flex flex-col h-full gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Global Seismic Activity</h3>
          <p className="text-xs text-slate-400">Real-time monitoring • 3D Interactive Globe</p>
        </div>
        <GlobeSection
          onLocationSelect={onLocationSelect}
          selectedLocation={selectedLocation}
          timeRange={timeRange}
          magnitudeRange={magnitudeRange}
          searchRegion={searchRegion}
        />
      </div>
    </Card>
  )
}
