"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
} from "recharts"
import { DangerGauge } from "@/components/danger-gauge"
import { AlertTriangle, TrendingUp, Activity } from "lucide-react"

// Historical M7+ earthquake data (USGS data)
const yearlyM7Data = [
  { year: "2018", count: 16 },
  { year: "2019", count: 13 },
  { year: "2020", count: 14 },
  { year: "2021", count: 19 },
  { year: "2022", count: 12 },
  { year: "2023", count: 19 },
  { year: "2024", count: 15 },
]

// Monthly activity data
const monthlyActivityData = [
  { month: "Jul", m4: 890, m5: 120, m6: 12, m7: 1 },
  { month: "Aug", m4: 920, m5: 135, m6: 15, m7: 2 },
  { month: "Sep", m4: 850, m5: 110, m6: 10, m7: 1 },
  { month: "Oct", m4: 910, m5: 125, m6: 14, m7: 2 },
  { month: "Nov", m4: 880, m5: 118, m6: 11, m7: 1 },
  { month: "Dec", m4: 940, m5: 142, m6: 16, m7: 2 },
]

interface DashboardSectionProps {
  selectedLocation?: {
    place: string
    mag: number
    lat: number
    lng: number
    time: string
    depth: number
  } | null
}

function getLocationYearlyData(location: any) {
  if (!location) return yearlyM7Data

  // Simulate location-specific data based on tectonic zone
  const isHighRiskZone =
    (location.lat > 35 && location.lng > 120) || // Japan/Pacific Ring of Fire
    (location.lat > 30 && location.lat < 40 && location.lng > 70 && location.lng < 90) // Himalayan region

  if (isHighRiskZone) {
    return [
      { year: "2018", count: 22 },
      { year: "2019", count: 18 },
      { year: "2020", count: 21 },
      { year: "2021", count: 25 },
      { year: "2022", count: 19 },
      { year: "2023", count: 28 },
      { year: "2024", count: 23 },
    ]
  }
  return yearlyM7Data
}

function getLocationMonthlyData(location: any) {
  if (!location) return monthlyActivityData

  const isHighRiskZone =
    (location.lat > 35 && location.lng > 120) ||
    (location.lat > 30 && location.lat < 40 && location.lng > 70 && location.lng < 90)

  if (isHighRiskZone) {
    return [
      { month: "Jul", m4: 1240, m5: 185, m6: 22, m7: 3 },
      { month: "Aug", m4: 1350, m5: 210, m6: 28, m7: 4 },
      { month: "Sep", m4: 1180, m5: 165, m6: 18, m7: 2 },
      { month: "Oct", m4: 1320, m5: 195, m6: 25, m7: 3 },
      { month: "Nov", m4: 1210, m5: 175, m6: 20, m7: 2 },
      { month: "Dec", m4: 1400, m5: 220, m6: 30, m7: 4 },
    ]
  }
  return monthlyActivityData
}

function getLocationRiskValue(location: any) {
  if (!location) return 42

  const magFactor = Math.min((location.mag / 8) * 40, 40)
  const depthFactor = location.depth < 70 ? 20 : 10
  const isHighRiskZone =
    (location.lat > 35 && location.lng > 120) ||
    (location.lat > 30 && location.lat < 40 && location.lng > 70 && location.lng < 90)
  const zoneFactor = isHighRiskZone ? 15 : 5

  return Math.round(magFactor + depthFactor + zoneFactor)
}

function generateForecastData(selectedLocation: any) {
  const baseData = [
    { year: "2018", count: 16, forecast: 15, lstm: 16 },
    { year: "2019", count: 13, forecast: 14, lstm: 13 },
    { year: "2020", count: 14, forecast: 15, lstm: 14 },
    { year: "2021", count: 19, forecast: 18, lstm: 19 },
    { year: "2022", count: 12, forecast: 14, lstm: 13 },
    { year: "2023", count: 19, forecast: 17, lstm: 18 },
    { year: "2024", count: 15, forecast: 16, lstm: 15 },
    { year: "2025*", count: null, forecast: 15, lstm: 16 },
  ]

  if (selectedLocation?.mag >= 7) {
    return baseData.map((d) => ({
      ...d,
      forecast: (d.forecast || 0) * 1.3,
      lstm: (d.lstm || 0) * 1.25,
    }))
  }
  return baseData
}

export function DashboardSection({ selectedLocation }: DashboardSectionProps) {
  const currentRiskValue = getLocationRiskValue(selectedLocation)
  const locationYearlyData = generateForecastData(selectedLocation)
  const locationMonthlyData = getLocationMonthlyData(selectedLocation)
  const averageM7 = 15.5

  return (
    <section id="dashboard" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Seismic Activity Dashboard</h2>
          {selectedLocation && (
            <div className="mt-2 p-3 bg-primary/10 border border-primary/20 rounded-lg inline-block">
              <p className="text-sm font-medium">
                Showing data for: <span className="text-primary">{selectedLocation.place}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                M{selectedLocation.mag.toFixed(1)} • {selectedLocation.depth} km deep
              </p>
            </div>
          )}
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {selectedLocation
              ? "Location-specific seismic analysis and historical trends"
              : "Real-time risk assessment and historical trend analysis. Click on a globe location to see regional data."}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Risk Gauge */}
          <Card className="lg:row-span-2 bg-slate-800/50 border-cyan-500/20 p-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent" />
                {selectedLocation ? "Regional" : "Global"} Risk Index
              </CardTitle>
              <CardDescription>
                {selectedLocation
                  ? `Risk level for ${selectedLocation.place}`
                  : "Current seismic activity level relative to historical averages"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <DangerGauge value={currentRiskValue} />
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Note:</strong> Seismic activity naturally fluctuates year-to-year. This index shows current
                  activity relative to long-term averages, not a prediction of future events.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-muted-foreground">7-Day M5+ Events</p>
                    <p className="text-xl font-bold">{selectedLocation ? "12" : "23"}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-muted-foreground">30-Day Average</p>
                    <p className="text-xl font-bold">{selectedLocation ? "8" : "18"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* M7+ Yearly Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                M7+ Earthquakes Per Year {selectedLocation && `(${selectedLocation.place})`}
              </CardTitle>
              <CardDescription>
                Historical count of magnitude 7.0+ earthquakes. Average: ~{averageM7}/year (USGS)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationYearlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} domain={[0, "dataMax + 5"]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      itemStyle={{ color: "hsl(180, 100%, 50%)" }}
                      formatter={(value: number) => [`${value} earthquakes`, "M7+ Count"]}
                    />
                    <ReferenceLine
                      y={averageM7}
                      stroke="hsl(180, 100%, 50%)"
                      strokeDasharray="5 5"
                      label={{ value: "Avg", position: "right", fill: "hsl(180, 100%, 50%)", fontSize: 12 }}
                    />
                    <Bar dataKey="count" fill="hsl(180, 100%, 50%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="forecast" fill="hsl(180, 70%, 50%)" fillOpacity={0.5} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="lstm" fill="hsl(180, 50%, 50%)" fillOpacity={0.3} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                {selectedLocation
                  ? `Selected region shows ${selectedLocation.mag > 7 ? "elevated" : "typical"} earthquake frequency`
                  : "2023 saw 19 M7+ events vs the long-term average of ~15. This variation is normal."}
              </p>
            </CardContent>
          </Card>

          {/* Monthly Activity Breakdown */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-400" />
                Monthly Activity Breakdown {selectedLocation && `(${selectedLocation.place})`}
              </CardTitle>
              <CardDescription>Earthquakes by magnitude range over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={locationMonthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(value: number, name: string) => {
                        const labels: Record<string, string> = {
                          m4: "M4-4.9",
                          m5: "M5-5.9",
                          m6: "M6-6.9",
                          m7: "M7+",
                        }
                        return [value, labels[name] || name]
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="m4"
                      stackId="1"
                      stroke="hsl(142, 76%, 36%)"
                      fill="hsl(142, 76%, 36%)"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="m5"
                      stackId="1"
                      stroke="hsl(47, 100%, 50%)"
                      fill="hsl(47, 100%, 50%)"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="m6"
                      stackId="1"
                      stroke="hsl(0, 84%, 60%)"
                      fill="hsl(0, 84%, 60%)"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="m7"
                      stackId="1"
                      stroke="hsl(0, 100%, 30%)"
                      fill="hsl(0, 100%, 30%)"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
