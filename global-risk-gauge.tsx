'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface RegionalRisk {
  name: string
  risk: number
  events24h: number
  color: string
}

export function GlobalRiskGauge() {
  const [globalRisk, setGlobalRisk] = useState(42)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [regions, setRegions] = useState<RegionalRisk[]>([
    { name: 'Pacific Ring', risk: 68, events24h: 8, color: 'red' },
    { name: 'Mediterranean', risk: 45, events24h: 3, color: 'orange' },
    { name: 'Southeast Asia', risk: 52, events24h: 5, color: 'orange' },
    { name: 'North America', risk: 38, events24h: 2, color: 'yellow' },
    { name: 'Europe', risk: 22, events24h: 1, color: 'green' },
    { name: 'Africa', risk: 35, events24h: 2, color: 'yellow' },
    { name: 'South America', risk: 58, events24h: 6, color: 'orange' },
    { name: 'Indian Ocean', risk: 48, events24h: 4, color: 'orange' },
  ])

  useEffect(() => {
    // Fetch live earthquake data from USGS
    const fetchLiveData = async () => {
      try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
        const data = await response.json()

        // Calculate regional risk based on earthquake magnitude, location, and frequency
        const regionMap: Record<string, { count: number; maxMag: number }> = {
          'Pacific Ring': { count: 0, maxMag: 0 },
          'Mediterranean': { count: 0, maxMag: 0 },
          'Southeast Asia': { count: 0, maxMag: 0 },
          'North America': { count: 0, maxMag: 0 },
          'Europe': { count: 0, maxMag: 0 },
          'Africa': { count: 0, maxMag: 0 },
          'South America': { count: 0, maxMag: 0 },
          'Indian Ocean': { count: 0, maxMag: 0 },
        }

        // Region coordinate bounds for categorization
        data.features.forEach((feature: any) => {
          const lat = feature.geometry.coordinates[1]
          const lng = feature.geometry.coordinates[0]
          const mag = feature.properties.mag || 0

          if ((lat > 20 && lat < 45 && lng > 130 && lng < 160) || (lat > -35 && lat < -10 && lng > 140 && lng < 180)) {
            regionMap['Pacific Ring'].count++
            regionMap['Pacific Ring'].maxMag = Math.max(regionMap['Pacific Ring'].maxMag, mag)
          } else if (lat > 30 && lat < 45 && lng > -10 && lng < 45) {
            regionMap['Mediterranean'].count++
            regionMap['Mediterranean'].maxMag = Math.max(regionMap['Mediterranean'].maxMag, mag)
          } else if (lat > -10 && lat < 25 && lng > 95 && lng < 145) {
            regionMap['Southeast Asia'].count++
            regionMap['Southeast Asia'].maxMag = Math.max(regionMap['Southeast Asia'].maxMag, mag)
          } else if ((lat > 25 && lat < 50 && lng > -130 && lng < -60) || (lat > 15 && lat < 32 && lng > -120 && lng < -95)) {
            regionMap['North America'].count++
            regionMap['North America'].maxMag = Math.max(regionMap['North America'].maxMag, mag)
          } else if (lat > 35 && lat < 70 && lng > -10 && lng < 40) {
            regionMap['Europe'].count++
            regionMap['Europe'].maxMag = Math.max(regionMap['Europe'].maxMag, mag)
          } else if (lat > -35 && lat < 35 && lng > -20 && lng < 55) {
            regionMap['Africa'].count++
            regionMap['Africa'].maxMag = Math.max(regionMap['Africa'].maxMag, mag)
          } else if (lat < -10 && lat > -56 && lng > -82 && lng < -34) {
            regionMap['South America'].count++
            regionMap['South America'].maxMag = Math.max(regionMap['South America'].maxMag, mag)
          } else if ((lat > -40 && lat < 15 && lng > 35 && lng < 110)) {
            regionMap['Indian Ocean'].count++
            regionMap['Indian Ocean'].maxMag = Math.max(regionMap['Indian Ocean'].maxMag, mag)
          }
        })

        // Convert to risk scores (0-100)
        const updatedRegions = regions.map((region) => {
          const regionData = regionMap[region.name]
          const riskScore = Math.min(100, (regionData.count * 10) + (regionData.maxMag * 8))
          return { ...region, risk: riskScore, events24h: regionData.count, color: riskScore > 70 ? 'red' : riskScore > 50 ? 'orange' : riskScore > 30 ? 'yellow' : 'green' }
        })

        setRegions(updatedRegions)
      } catch (error) {
        console.error('[v0] Error fetching earthquake data:', error)
      }
    }

    fetchLiveData()
    // Refresh every 5 minutes
    const interval = setInterval(fetchLiveData, 300000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Calculate global risk from regional risks
    const avgRisk = Math.round(regions.reduce((sum, r) => sum + r.risk, 0) / regions.length)
    setGlobalRisk(avgRisk)
  }, [regions])

  const handleRegionClick = (regionName: string) => {
    setSelectedRegion(selectedRegion === regionName ? null : regionName)
  }

  const getRiskLevel = (risk: number) => {
    if (risk < 30) return 'Low'
    if (risk < 50) return 'Moderate'
    if (risk < 70) return 'Elevated'
    return 'High'
  }

  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'from-green-500 to-green-600'
    if (risk < 50) return 'from-yellow-500 to-yellow-600'
    if (risk < 70) return 'from-orange-500 to-orange-600'
    return 'from-red-500 to-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Main Risk Gauge */}
      <Card className="bg-slate-800/50 border-cyan-500/30 p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Global Risk Index</h3>
          <p className="text-sm text-slate-400">0 - 100 Scale</p>
        </div>

        <div className="flex flex-col items-center justify-center mb-6">
          {/* Circular Gauge */}
          <div className="relative w-32 h-32 mb-4">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(100, 116, 139, 0.2)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={`url(#riskGradient)`}
                strokeWidth="8"
                strokeDasharray={`${(globalRisk / 100) * (2 * Math.PI * 45)} ${2 * Math.PI * 45}`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  {globalRisk < 30 && <stop offset="0%" stopColor="rgb(34, 197, 94)" />}
                  {globalRisk < 30 && <stop offset="100%" stopColor="rgb(22, 163, 74)" />}
                  {globalRisk >= 30 && globalRisk < 50 && <stop offset="0%" stopColor="rgb(234, 179, 8)" />}
                  {globalRisk >= 30 && globalRisk < 50 && <stop offset="100%" stopColor="rgb(202, 138, 4)" />}
                  {globalRisk >= 50 && globalRisk < 70 && <stop offset="0%" stopColor="rgb(249, 115, 22)" />}
                  {globalRisk >= 50 && globalRisk < 70 && <stop offset="100%" stopColor="rgb(234, 88, 12)" />}
                  {globalRisk >= 70 && <stop offset="0%" stopColor="rgb(239, 68, 68)" />}
                  {globalRisk >= 70 && <stop offset="100%" stopColor="rgb(220, 38, 38)" />}
                </linearGradient>
              </defs>
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white">{globalRisk}</div>
              <div className="text-xs text-slate-400">Risk</div>
            </div>
          </div>

          <div className="text-center">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getRiskColor(globalRisk)} text-white`}>
              {getRiskLevel(globalRisk)}
            </div>
          </div>
        </div>
      </Card>

      {/* Regional Risk Buttons */}
      <Card className="bg-slate-800/50 border-cyan-500/30 p-6">
        <h4 className="text-sm font-semibold text-white mb-4">Regional Risk Distribution</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {regions.map((region) => (
            <button
              key={region.name}
              onClick={() => handleRegionClick(region.name)}
              className={`p-3 rounded-lg border-2 transition-all text-left text-xs ${
                selectedRegion === region.name
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-slate-600/50 hover:border-slate-500'
              }`}
            >
              <div className="font-semibold text-white mb-1">{region.name}</div>
              <div className="flex items-center justify-between">
                <span className={`font-bold ${
                  region.risk < 30 ? 'text-green-400' :
                  region.risk < 50 ? 'text-yellow-400' :
                  region.risk < 70 ? 'text-orange-400' :
                  'text-red-400'
                }`}>
                  {region.risk.toFixed(0)}
                </span>
                <span className="text-slate-400">{region.events24h}e</span>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
