"use client"

import { GlobalNavigation } from "@/components/global-navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { AnalyticsGraphs } from "@/components/analytics-graphs"
import { Realtime24hTimeline } from "@/components/realtime-24h-timeline"
import { GlobalRiskGauge } from "@/components/global-risk-gauge"
import { ForecastProbabilityWidget } from "@/components/forecast-probability-widget"



export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("live-monitoring")



  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <GlobalNavigation />

      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Analytics & Insights</h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Real-time monitoring, risk assessment, and seismic forecasting
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-800/50 p-1 h-auto mb-6">
              <TabsTrigger value="timeline" className="text-xs sm:text-sm">
                24h Timeline
              </TabsTrigger>
              <TabsTrigger value="risk" className="text-xs sm:text-sm">
                Risk Index
              </TabsTrigger>
              <TabsTrigger value="forecast" className="text-xs sm:text-sm">
                Forecast
              </TabsTrigger>
              <TabsTrigger value="historical" className="text-xs sm:text-sm">
                Historical
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-6">
              <Realtime24hTimeline />
            </TabsContent>

            <TabsContent value="risk" className="space-y-6">
              <GlobalRiskGauge />
            </TabsContent>

            <TabsContent value="forecast" className="space-y-6">
              <ForecastProbabilityWidget />
            </TabsContent>

            <TabsContent value="historical" className="space-y-6">
              <AnalyticsGraphs />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
