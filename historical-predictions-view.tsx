"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Calendar, TrendingDown, MapPin } from "lucide-react"

export function HistoricalPredictionsView() {
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    // Simulate fetching 45 days of historical predictions
    const generateHistoricalData = () => {
      const data = []
      for (let i = 44; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        data.push({
          date: date.toISOString().split("T")[0],
          regions: [
            { name: "Japan Trench", probability: 0.6 + Math.random() * 0.3 },
            { name: "San Andreas", probability: 0.45 + Math.random() * 0.25 },
            { name: "Chile Trench", probability: 0.55 + Math.random() * 0.3 },
            { name: "Cascadia", probability: 0.35 + Math.random() * 0.25 },
            { name: "Himalayas", probability: 0.4 + Math.random() * 0.3 },
          ],
        })
      }
      return data
    }

    setHistoricalData(generateHistoricalData())
  }, [])

  const selectedData = historicalData.find((d) => d.date === selectedDate)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Historical Predictions</h2>
        <p className="text-xs sm:text-sm text-gray-400">View up to 45 days of historical prediction data</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full px-3 sm:px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg text-white text-sm sm:text-base"
          />
        </div>
      </div>

      {selectedData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {selectedData.regions.map((region: any, idx: number) => (
            <Card
              key={idx}
              className="p-3 sm:p-4 border-l-4 border-l-slate-600 hover:border-l-cyan-500 transition-all bg-slate-800/50 hover:bg-slate-800/80"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-semibold text-white text-sm sm:text-base">{region.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-2xl font-bold text-cyan-400">
                    {(region.probability * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-400">Probability</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">No data available for this date</div>
      )}
    </div>
  )
}
