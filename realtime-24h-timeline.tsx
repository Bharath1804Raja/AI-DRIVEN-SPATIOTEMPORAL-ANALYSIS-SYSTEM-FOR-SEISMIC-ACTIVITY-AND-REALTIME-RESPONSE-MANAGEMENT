'use client'

import { useEffect, useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { MapPin, Clock, Zap } from 'lucide-react'

interface EarthquakeEvent {
  id: string
  magnitude: number
  location: string
  timestamp: Date
  depth: number
  lat: number
  lng: number
}

export function Realtime24hTimeline() {
  const [events, setEvents] = useState<EarthquakeEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EarthquakeEvent | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch live earthquake data from USGS
    const fetchLiveData = async () => {
      try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
        const data = await response.json()

        const newEvents = data.features.slice(0, 12).map((feature: any, idx: number) => ({
          id: `eq-${feature.id}`,
          magnitude: feature.properties.mag,
          location: feature.properties.place,
          timestamp: new Date(feature.properties.time),
          depth: feature.geometry.coordinates[2],
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
        }))

        setEvents(newEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()))
      } catch (error) {
        console.error('[v0] Error fetching earthquake data:', error)
      }
    }

    fetchLiveData()

    // Refresh live data every 5 minutes
    const interval = setInterval(fetchLiveData, 300000)
    return () => clearInterval(interval)
  }, [])

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude < 4.5) return 'bg-green-500/20 border-green-500/50'
    if (magnitude < 5.5) return 'bg-yellow-500/20 border-yellow-500/50'
    if (magnitude < 6.5) return 'bg-orange-500/20 border-orange-500/50'
    return 'bg-red-500/20 border-red-500/50'
  }

  const getMagnitudeTextColor = (magnitude: number) => {
    if (magnitude < 4.5) return 'text-green-400'
    if (magnitude < 5.5) return 'text-yellow-400'
    if (magnitude < 6.5) return 'text-orange-400'
    return 'text-red-400'
  }

  const timeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">24-Hour Timeline</h3>
        <p className="text-sm text-slate-400">Real-time earthquake events from the past 24 hours</p>
      </div>

      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto pb-4 scrollbar-hide"
      >
        <div className="flex gap-3 min-w-max px-4">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`flex-shrink-0 p-3 rounded-lg border transition-all cursor-pointer hover:scale-105 ${getMagnitudeColor(event.magnitude)} ${selectedEvent?.id === event.id ? 'ring-2 ring-cyan-400' : ''}`}
            >
              <div className="w-40 space-y-2">
                <div className={`text-lg font-bold ${getMagnitudeTextColor(event.magnitude)}`}>
                  M{event.magnitude.toFixed(1)}
                </div>
                <div className="text-xs text-slate-300">{event.location}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeAgo(event.timestamp)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <Card className="bg-slate-800/50 border-cyan-500/30 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-slate-400 mb-1">Magnitude</div>
              <div className={`text-2xl font-bold ${getMagnitudeTextColor(selectedEvent.magnitude)}`}>
                {selectedEvent.magnitude.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Location</div>
              <div className="text-sm font-semibold text-white">{selectedEvent.location}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Depth</div>
              <div className="text-sm font-semibold text-white">{selectedEvent.depth.toFixed(1)} km</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Time</div>
              <div className="text-sm font-semibold text-white">{selectedEvent.timestamp.toLocaleTimeString()}</div>
            </div>
            <div className="col-span-2 sm:col-span-4">
              <div className="text-xs text-slate-400 mb-1">Coordinates</div>
              <div className="text-sm text-white font-mono">{selectedEvent.lat.toFixed(3)}°, {selectedEvent.lng.toFixed(3)}°</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
