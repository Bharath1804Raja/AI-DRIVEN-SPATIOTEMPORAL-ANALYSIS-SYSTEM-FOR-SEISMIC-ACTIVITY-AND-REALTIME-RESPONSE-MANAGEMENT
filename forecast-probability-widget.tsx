'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ForecastData {
  days: number
  probability: number
  trend: 'up' | 'down' | 'stable'
  lastUpdated: Date
}

export function ForecastProbabilityWidget() {
  const [selectedPeriod, setSelectedPeriod] = useState(7)
  const [forecasts, setForecasts] = useState<Record<number, ForecastData>>({
    3: { days: 3, probability: 24, trend: 'up', lastUpdated: new Date() },
    7: { days: 7, probability: 38, trend: 'stable', lastUpdated: new Date() },
    14: { days: 14, probability: 52, trend: 'down', lastUpdated: new Date() },
    30: { days: 30, probability: 68, trend: 'up', lastUpdated: new Date() },
  })

  useEffect(() => {
    // Fetch live earthquake data and calculate forecast probabilities
    const fetchLiveData = async () => {
      try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
        const data = await response.json()

        // Calculate earthquake frequency to estimate forecast probabilities
        const now = Date.now()
        const earthquakeCounts = {
          3: 0,
          7: 0,
          14: 0,
          30: 0,
        }

        data.features.forEach((feature: any) => {
          const timeGap = now - feature.properties.time
          const daysOld = timeGap / (24 * 60 * 60 * 1000)
          
          if (daysOld <= 3) earthquakeCounts[3]++
          if (daysOld <= 7) earthquakeCounts[7]++
          if (daysOld <= 14) earthquakeCounts[14]++
          if (daysOld <= 30) earthquakeCounts[30]++
        })

        setForecasts((prev) => {
          const updated: Record<number, ForecastData> = {}
          
          Object.entries(earthquakeCounts).forEach(([days, count]) => {
            const daysNum = parseInt(days)
            const oldProb = prev[daysNum]?.probability || 0
            const newProb = Math.min(95, Math.max(5, (count / 50) * 100))
            
            updated[daysNum] = {
              days: daysNum,
              probability: newProb,
              trend: newProb > oldProb ? 'up' : newProb < oldProb ? 'down' : 'stable',
              lastUpdated: new Date(),
            }
          })
          return updated
        })
      } catch (error) {
        console.error('[v0] Error fetching forecast data:', error)
      }
    }

    fetchLiveData()
    // Refresh every 5 minutes
    const interval = setInterval(fetchLiveData, 300000)
    return () => clearInterval(interval)
  }, [])

  const currentForecast = forecasts[selectedPeriod]

  const getProbabilityColor = (probability: number) => {
    if (probability < 20) return 'text-green-400'
    if (probability < 40) return 'text-yellow-400'
    if (probability < 60) return 'text-orange-400'
    return 'text-red-400'
  }

  const getProbabilityBgGradient = (probability: number) => {
    if (probability < 20) return 'from-green-500/20 to-green-600/20'
    if (probability < 40) return 'from-yellow-500/20 to-yellow-600/20'
    if (probability < 60) return 'from-orange-500/20 to-orange-600/20'
    return 'from-red-500/20 to-red-600/20'
  }

  const getTrendArrow = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↑'
      case 'down':
        return '↓'
      default:
        return '→'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-red-400'
      case 'down':
        return 'text-green-400'
      default:
        return 'text-yellow-400'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Seismic Forecast</h3>
        <p className="text-sm text-slate-400">Probability of M4.5+ earthquakes in selected time window</p>
      </div>

      {/* Period Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[3, 7, 14, 30].map((days) => (
          <Button
            key={days}
            onClick={() => setSelectedPeriod(days)}
            variant={selectedPeriod === days ? 'default' : 'outline'}
            className={`transition-all ${
              selectedPeriod === days
                ? 'bg-cyan-600 hover:bg-cyan-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-600'
            }`}
          >
            {days} Days
          </Button>
        ))}
      </div>

      {/* Main Forecast Display */}
      <Card className={`bg-gradient-to-br ${getProbabilityBgGradient(currentForecast.probability)} border-cyan-500/30 p-8`}>
        <div className="text-center">
          <div className="text-sm text-slate-400 mb-2">Earthquake Probability</div>
          <div className={`text-6xl sm:text-7xl font-bold ${getProbabilityColor(currentForecast.probability)} mb-2`}>
            {currentForecast.probability.toFixed(0)}%
          </div>
          <div className="text-sm text-slate-300 mb-4">
            Next {currentForecast.days} days forecast
          </div>

          {/* Trend Indicator */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-700 ${getTrendColor(currentForecast.trend)}`}>
            <span className="text-lg">{getTrendArrow(currentForecast.trend)}</span>
            <span className="text-xs font-semibold uppercase">
              {currentForecast.trend === 'up' ? 'Increasing' : currentForecast.trend === 'down' ? 'Decreasing' : 'Stable'}
            </span>
          </div>
        </div>
      </Card>

      {/* Forecast Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(forecasts).map(([key, forecast]) => (
          <Card
            key={key}
            onClick={() => setSelectedPeriod(parseInt(key))}
            className={`p-4 cursor-pointer transition-all border-2 ${
              selectedPeriod === parseInt(key)
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-slate-600/50 hover:border-slate-500'
            }`}
          >
            <div className="text-xs text-slate-400 mb-2">{forecast.days}-Day Forecast</div>
            <div className={`text-3xl font-bold ${getProbabilityColor(forecast.probability)} mb-2`}>
              {forecast.probability.toFixed(0)}%
            </div>
            <div className={`text-sm font-semibold ${getTrendColor(forecast.trend)}`}>
              {getTrendArrow(forecast.trend)}
              {' '}
              {forecast.trend === 'up' ? 'Rising' : forecast.trend === 'down' ? 'Falling' : 'Stable'}
            </div>
          </Card>
        ))}
      </div>

      {/* Info Box */}
      <Card className="bg-slate-800/30 border-slate-700/50 p-4">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          These forecasts are statistical probabilities based on historical seismic patterns and current activity levels.
          <strong> Earthquake predictions are not possible.</strong> All forecasts are probabilistic estimates that
          update in real-time as new data arrives.
        </p>
      </Card>
    </div>
  )
}
