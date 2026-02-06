"use client"

import { useState } from "react"
import { GlobalVisualizationZone } from "@/components/zones/global-visualization-zone"
import { FooterSection } from "@/components/zones/footer-section"
import { RecentActivitySection } from "@/components/recent-activity-section"
import { HeroNavigation } from "@/components/hero-navigation"

interface SelectedLocation {
  place: string
  mag: number
  lat: number
  lng: number
  time: string
  depth: number
}

interface DashboardLayoutProps {
  selectedLocation: SelectedLocation | null
  onLocationSelect: (location: SelectedLocation | null) => void
}

export function DashboardLayout({ selectedLocation, onLocationSelect }: DashboardLayoutProps) {
  const [timeRange, setTimeRange] = useState("week")
  const [magnitudeRange, setMagnitudeRange] = useState([0, 10])
  const [searchRegion, setSearchRegion] = useState("")

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Navigation */}
      <HeroNavigation />

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4 p-4">
        {/* Global Visualization (Center - Primary) */}
        <div className="min-h-[600px] lg:min-h-[800px]">
          <GlobalVisualizationZone
            onLocationSelect={onLocationSelect}
            selectedLocation={selectedLocation}
            timeRange={timeRange}
            magnitudeRange={magnitudeRange}
            searchRegion={searchRegion}
          />
        </div>

        {/* Recent Activity Section - Directly Below Globe */}
        <RecentActivitySection 
          selectedLocation={selectedLocation} 
          onSelectEvent={onLocationSelect}
          searchRegion={searchRegion}
        />
      </div>

      {/* ZONE 7: Footer Section */}
      <FooterSection />
    </div>
  )
}
