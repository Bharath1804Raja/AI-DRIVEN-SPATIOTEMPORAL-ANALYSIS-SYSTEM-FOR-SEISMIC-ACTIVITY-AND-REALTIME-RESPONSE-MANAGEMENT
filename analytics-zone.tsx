"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardSection } from "@/components/dashboard-section"

interface SelectedLocation {
  place: string
  mag: number
  lat: number
  lng: number
  time: string
  depth: number
}

interface AnalyticsZoneProps {
  selectedLocation: SelectedLocation | null
  timeRange: string
}

export function AnalyticsZone({ selectedLocation, timeRange }: AnalyticsZoneProps) {
  return (
    <Card className="bg-slate-800/50 border-cyan-500/20 p-4 h-full">
      <h4 className="text-sm font-semibold text-white mb-4">Analytics & Insights</h4>
      <Tabs defaultValue="continental" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
          <TabsTrigger value="continental">Continental</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
        </TabsList>
        <TabsContent value="continental" className="space-y-4">
          <DashboardSection selectedLocation={selectedLocation} />
        </TabsContent>
        <TabsContent value="regional">
          <div className="p-4 text-slate-400 text-sm">
            {selectedLocation ? (
              <div>
                <p className="font-semibold text-white mb-2">{selectedLocation.place}</p>
                <p>Region-specific insights for {selectedLocation.place}</p>
                <div className="mt-4 bg-slate-700/30 p-3 rounded text-xs space-y-2">
                  <p>📊 Magnitude: {selectedLocation.mag}</p>
                  <p>📍 Depth: {selectedLocation.depth} km</p>
                  <p>⏰ Time: {selectedLocation.time}</p>
                </div>
              </div>
            ) : (
              "Select a location on the globe to view regional insights"
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
