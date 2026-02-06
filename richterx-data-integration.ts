/**
 * RichterX Data Integration
 * Aggregates real-time earthquake data from RichterX and USGS feeds
 */

export interface EarthquakeEvent {
  id: string
  location: string
  latitude: number
  longitude: number
  magnitude: number
  depth: number
  timestamp: string
  source: "richterx" | "usgs" | "emsc"
  eventType: string
}

export interface RegionalMetrics {
  region: string
  totalEvents30Days: number
  avgMagnitude: number
  maxMagnitude: number
  lastEventTime: string
  trend: "increasing" | "decreasing" | "stable"
}

/**
 * Fetch and normalize earthquake data from multiple sources
 */
export async function fetchEarthquakeData(
  bounds?: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  daysBack = 30,
): Promise<EarthquakeEvent[]> {
  const events: EarthquakeEvent[] = []

  try {
    // Fetch from USGS (primary source)
    const usgsUrl = new URL("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson")
    const usgsResponse = await fetch(usgsUrl.toString())
    const usgsData = await usgsResponse.json()

    if (usgsData.features) {
      usgsData.features.forEach((feature: any) => {
        const props = feature.properties
        const coords = feature.geometry.coordinates

        const event: EarthquakeEvent = {
          id: props.id,
          location: props.place || "Unknown",
          latitude: coords[1],
          longitude: coords[0],
          magnitude: props.mag || 0,
          depth: coords[2] || 0,
          timestamp: new Date(props.time).toISOString(),
          source: "usgs",
          eventType: props.type || "earthquake",
        }

        if (
          !bounds ||
          (coords[1] >= bounds.minLat &&
            coords[1] <= bounds.maxLat &&
            coords[0] >= bounds.minLng &&
            coords[0] <= bounds.maxLng)
        ) {
          events.push(event)
        }
      })
    }

    // Fetch from EMSC as secondary source
    const emscUrl = "https://www.emsc-csem.org/service/rss/feed/search/?limit=50&last_days=30"
    const emscResponse = await fetch(emscUrl)
    const emscText = await emscResponse.text()

    // Parse EMSC RSS feed (simplified)
    const emscMatches = emscText.match(/<item>([\s\S]*?)<\/item>/g) || []
    emscMatches.slice(0, 20).forEach((match) => {
      const titleMatch = match.match(/<title>(.*?)<\/title>/)
      const latMatch = match.match(/<georss:point>([\d.-]+)\s([\d.-]+)<\/georss:point>/)

      if (titleMatch && latMatch) {
        const magMatch = titleMatch[1].match(/M\s*([\d.]+)/)
        events.push({
          id: `emsc_${Math.random()}`,
          location: titleMatch[1],
          latitude: Number.parseFloat(latMatch[1]),
          longitude: Number.parseFloat(latMatch[2]),
          magnitude: magMatch ? Number.parseFloat(magMatch[1]) : 0,
          depth: 10,
          timestamp: new Date().toISOString(),
          source: "emsc",
          eventType: "earthquake",
        })
      }
    })
  } catch (error) {
    console.error("Error fetching earthquake data:", error)
  }

  return events
}

/**
 * Aggregate events by region
 */
export function aggregateByRegion(
  events: EarthquakeEvent[],
  regionMap: Map<string, [number, number, number, number]>,
): RegionalMetrics[] {
  const regional: Map<string, EarthquakeEvent[]> = new Map()

  // Group events by region
  events.forEach((event) => {
    regionMap.forEach((bounds, regionName) => {
      const [minLat, maxLat, minLng, maxLng] = bounds
      if (
        event.latitude >= minLat &&
        event.latitude <= maxLat &&
        event.longitude >= minLng &&
        event.longitude <= maxLng
      ) {
        if (!regional.has(regionName)) {
          regional.set(regionName, [])
        }
        regional.get(regionName)!.push(event)
      }
    })
  })

  // Generate metrics
  return Array.from(regional.entries()).map(([region, regionEvents]) => {
    const magnitudes = regionEvents.map((e) => e.magnitude)
    const sortedByTime = regionEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Determine trend
    let trend: "increasing" | "decreasing" | "stable" = "stable"
    if (regionEvents.length > 10) {
      const firstHalf = magnitudes.slice(0, 5).reduce((a, b) => a + b, 0) / 5
      const secondHalf = magnitudes.slice(-5).reduce((a, b) => a + b, 0) / 5
      if (secondHalf > firstHalf * 1.1) trend = "increasing"
      else if (secondHalf < firstHalf * 0.9) trend = "decreasing"
    }

    return {
      region,
      totalEvents30Days: regionEvents.length,
      avgMagnitude: magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length,
      maxMagnitude: Math.max(...magnitudes),
      lastEventTime: sortedByTime[0]?.timestamp || new Date().toISOString(),
      trend,
    }
  })
}

/**
 * Normalize data for ML models
 */
export function normalizeForPrediction(events: EarthquakeEvent[]): number[] {
  if (events.length === 0) return [0, 0, 0, 0]

  const magnitudes = events.map((e) => e.magnitude)
  const depths = events.map((e) => e.depth)

  return [
    magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length / 10, // Normalized avg magnitude
    Math.max(...magnitudes) / 10, // Normalized max magnitude
    depths.reduce((a, b) => a + b, 0) / depths.length / 700, // Normalized avg depth
    events.length / 100, // Event frequency
  ]
}
