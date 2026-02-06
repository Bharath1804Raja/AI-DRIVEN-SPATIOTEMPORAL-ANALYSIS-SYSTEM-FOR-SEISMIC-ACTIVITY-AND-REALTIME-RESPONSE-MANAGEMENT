"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function AnalyticsGraphs() {
  const [dailyData, setDailyData] = useState<any[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [yearlyData, setYearlyData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch live earthquake data from USGS
    const fetchLiveData = async () => {
      try {
        // Fetch last 30 days of data
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
        const data = await response.json()

        // Process daily data (last 90 days)
        const dailyMap: Record<string, { count: number; totalMag: number; events: number }> = {}
        for (let i = 89; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          dailyMap[dateStr] = { count: 0, totalMag: 0, events: 0 }
        }

        data.features.forEach((feature: any) => {
          const eventDate = new Date(feature.properties.time)
          const dateStr = eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          if (dailyMap[dateStr]) {
            dailyMap[dateStr].count++
            dailyMap[dateStr].totalMag += feature.properties.mag || 0
            dailyMap[dateStr].events++
          }
        })

        const processedDaily = Object.entries(dailyMap).map(([date, data]) => ({
          date,
          count: data.count,
          magnitude: data.events > 0 ? (data.totalMag / data.events).toFixed(1) : "0",
        }))

        // Process weekly data
        const weeklyMap: Record<number, { count: number; totalMag: number }> = {}
        for (let i = 0; i < 52; i++) {
          weeklyMap[i] = { count: 0, totalMag: 0 }
        }

        data.features.forEach((feature: any) => {
          const eventDate = new Date(feature.properties.time)
          const now = new Date()
          const daysOld = (now.getTime() - eventDate.getTime()) / (24 * 60 * 60 * 1000)
          if (daysOld < 365) {
            const week = Math.floor(daysOld / 7)
            weeklyMap[week].count++
            weeklyMap[week].totalMag += feature.properties.mag || 0
          }
        })

        const processedWeekly = Object.entries(weeklyMap)
          .filter(([, data]) => data.count > 0)
          .map(([week, data]) => ({
            week: `W${52 - parseInt(week)}`,
            count: data.count,
            avgMagnitude: (data.totalMag / data.count).toFixed(1),
          }))

        // Process yearly data
        const yearlyMap: Record<number, { count: number; count7plus: number }> = {}
        for (let i = 2015; i <= 2024; i++) {
          yearlyMap[i] = { count: 0, count7plus: 0 }
        }

        data.features.forEach((feature: any) => {
          const eventDate = new Date(feature.properties.time)
          const year = eventDate.getFullYear()
          if (year >= 2015 && year <= 2024) {
            yearlyMap[year].count++
            if ((feature.properties.mag || 0) >= 7) {
              yearlyMap[year].count7plus++
            }
          }
        })

        const processedYearly = Object.entries(yearlyMap).map(([year, data]) => ({
          year,
          count: data.count,
          magnitude7plus: data.count7plus,
        }))

        setDailyData(processedDaily)
        setWeeklyData(processedWeekly.slice(-52))
        setYearlyData(processedYearly)
      } catch (error) {
        console.error('[v0] Error fetching analytics data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLiveData()
    // Refresh every 5 minutes
    const interval = setInterval(fetchLiveData, 300000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white">10-Year Earthquake Analytics</h2>
        <p className="text-xs sm:text-sm text-gray-400">Comprehensive historical data visualization and trends</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400 mx-auto mb-2"></div>
            <p className="text-gray-400 text-sm">Loading analytics...</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="daily" className="text-xs sm:text-sm">
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-xs sm:text-sm">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="yearly" className="text-xs sm:text-sm">
              Yearly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4 mt-4">
            <Card className="p-4 bg-slate-800/50 border-slate-700/50">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-1">Daily Earthquake Activity (Last 90 Days)</h3>
                <p className="text-sm text-gray-400">Real-time and recorded earthquake events per day</p>
              </div>
              <div className="w-full h-80 overflow-x-auto">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                      labelStyle={{ color: "#e2e8f0" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#06b6d4"
                      name="Event Count"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4 mt-4">
            <Card className="p-4 bg-slate-800/50 border-slate-700/50">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-1">Weekly Earthquake Trends (Last Year)</h3>
                <p className="text-sm text-gray-400">Aggregated weekly activity and average magnitudes</p>
              </div>
              <div className="w-full h-80 overflow-x-auto">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="week" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                      labelStyle={{ color: "#e2e8f0" }}
                    />
                    <Legend />
                    <Bar dataKey="count" fill="#06b6d4" name="Weekly Events" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="yearly" className="space-y-4 mt-4">
            <Card className="p-4 bg-slate-800/50 border-slate-700/50">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-1">Yearly Earthquake Trends (10 Years)</h3>
                <p className="text-sm text-gray-400">Annual counts and magnitude 7+ earthquake frequency</p>
              </div>
              <div className="w-full h-80 overflow-x-auto">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                      labelStyle={{ color: "#e2e8f0" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#06b6d4"
                      name="Total Events"
                      strokeWidth={2}
                      dot={{ fill: "#06b6d4", r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="magnitude7plus"
                      stroke="#ef4444"
                      name="M7+ Events"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
