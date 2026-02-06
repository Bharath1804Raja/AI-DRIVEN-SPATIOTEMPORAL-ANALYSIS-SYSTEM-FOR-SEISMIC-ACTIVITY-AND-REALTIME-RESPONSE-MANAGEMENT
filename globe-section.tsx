"use client"

import { useRef, useState, useEffect, useMemo, Suspense } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Html, Stars } from "@react-three/drei"
import { TextureLoader, type Mesh, type Group } from "three"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Real USGS data fetching for production
async function fetchEarthquakeData() {
  try {
    const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
    const data = await response.json()
    // Process USGS GeoJSON format and return earthquake markers
    return data.features.map((feature: any, index: number) => {
      const { geometry, properties } = feature
      const { coordinates } = geometry
      const { mag, place, time, depth } = properties
      return {
        id: index + 1,
        lat: coordinates[1],
        lng: coordinates[0],
        mag: mag,
        place: place,
        time: time,
        depth: depth,
      }
    })
  } catch (error) {
    console.error("Error fetching USGS data:", error)
    return []
  }
}

function latLngToPosition(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return [x, y, z]
}

function getMagnitudeColor(mag: number): string {
  if (mag >= 6) return "#ef4444"
  if (mag >= 5) return "#f97316"
  if (mag >= 4) return "#eab308"
  return "#22c55e"
}

function getMagnitudeSize(mag: number): number {
  return 0.008 + (mag / 10) * 0.025
}

function EarthquakeMarker({
  position,
  magnitude,
  place,
  time,
  depth,
  lat,
  lng,
  onSelect,
}: {
  position: [number, number, number]
  magnitude: number
  place: string
  time: string
  depth: number
  lat: number
  lng: number
  onSelect: (quake: any) => void
}) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<Mesh>(null)
  const color = getMagnitudeColor(magnitude)
  const size = getMagnitudeSize(magnitude)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1)
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect({ mag: magnitude, place, time, depth, lat, lng })}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      {/* Pulse ring */}
      <mesh>
        <ringGeometry args={[size * 1.2, size * 1.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={2} />
      </mesh>
      {hovered && (
        <Html distanceFactor={3} style={{ pointerEvents: "none" }}>
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl min-w-48">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-bold">M{magnitude.toFixed(1)}</span>
            </div>
            <p className="text-sm text-foreground">{place}</p>
            <p className="text-xs text-muted-foreground">{time}</p>
            <p className="text-xs text-muted-foreground mt-1">Depth: {depth} km</p>
          </div>
        </Html>
      )}
    </group>
  )
}

function Earth({
  earthquakes,
  onSelectQuake,
}: {
  earthquakes: any[]
  onSelectQuake: (quake: any) => void
}) {
  const earthRef = useRef<Group>(null)
  const texture = useLoader(TextureLoader, "/assets/3d/texture_earth.jpg")

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={earthRef}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {/* Atmosphere glow */}
      <mesh scale={1.02}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
      </mesh>
      {earthquakes.map((quake) => (
        <EarthquakeMarker
          key={quake.id}
          position={latLngToPosition(quake.lat, quake.lng, 1.02)} // Now returns tuple
          magnitude={quake.mag}
          place={quake.place}
          time={quake.time}
          depth={quake.depth}
          lat={quake.lat}
          lng={quake.lng}
          onSelect={() => onSelectQuake(quake)}
        />
      ))}
    </group>
  )
}

function GlobeScene({
  earthquakes,
  onSelectQuake,
}: {
  earthquakes: any[]
  onSelectQuake: (quake: any) => void
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1} />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <Suspense fallback={null}>
        <Earth earthquakes={earthquakes} onSelectQuake={onSelectQuake} />
      </Suspense>
      <OrbitControls enableZoom={true} enablePan={false} minDistance={1.5} maxDistance={4} autoRotate={false} />
    </>
  )
}

interface GlobeSectionProps {
  onLocationSelect: (location: any) => void
  selectedLocation: any
  timeRange: string
  magnitudeRange: [number, number]
  searchRegion: string
}

function GlobeControls({
  onSearchChange,
  onTimeRangeChange,
  onMagnitudeChange,
  searchValue,
  timeRange,
  magnitudeRange,
}: {
  onSearchChange: (value: string) => void
  onTimeRangeChange: (value: string) => void
  onMagnitudeChange: (value: [number, number]) => void
  searchValue: string
  timeRange: string
  magnitudeRange: [number, number]
}) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur border border-cyan-500/30 rounded-lg p-3 space-y-2 max-w-xs">
      <input
        type="text"
        placeholder="Search location..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-3 py-1 rounded bg-slate-700/50 border border-cyan-500/30 text-white placeholder-slate-400 text-sm"
      />
      <select
        value={timeRange}
        onChange={(e) => onTimeRangeChange(e.target.value)}
        className="w-full px-3 py-1 rounded bg-slate-700/50 border border-cyan-500/30 text-white text-sm"
      >
        <option value="hour">Last Hour</option>
        <option value="day">Last Day</option>
        <option value="week">Last Week</option>
        <option value="month">Last Month</option>
      </select>
      <div>
        <label className="text-xs text-slate-300">
          Magnitude Range: {magnitudeRange[0]} - {magnitudeRange[1]}
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={magnitudeRange[1]}
          onChange={(e) => onMagnitudeChange([magnitudeRange[0], Number.parseFloat(e.target.value)])}
          className="w-full"
        />
      </div>
    </div>
  )
}

export function GlobeSection({
  onLocationSelect,
  selectedLocation,
  timeRange,
  magnitudeRange,
  searchRegion,
}: GlobeSectionProps) {
  const [timeFilter, setTimeFilter] = useState("24h")
  const [earthquakeData, setEarthquakeData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [localSearchRegion, setLocalSearchRegion] = useState(searchRegion)
  const [localTimeRange, setLocalTimeRange] = useState(timeRange)
  const [localMagnitudeRange, setLocalMagnitudeRange] = useState(magnitudeRange)

  useEffect(() => {
    setIsLoading(true)
    const fetchEarthquakeData = async () => {
      try {
        let feedUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
        if (localTimeRange === "hour")
          feedUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
        else if (localTimeRange === "day")
          feedUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
        else if (localTimeRange === "month")
          feedUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

        const response = await fetch(feedUrl)
        const data = await response.json()
        const quakes = data.features
          .map((feature: any, index: number) => {
            const { geometry, properties } = feature
            const { coordinates } = geometry
            const { mag, place, time } = properties
            return {
              id: index + 1,
              lat: coordinates[1],
              lng: coordinates[0],
              mag: mag,
              place: place,
              time: new Date(time).toLocaleString(),
              depth: coordinates[2],
            }
          })
          .filter((q: any) => q.mag >= localMagnitudeRange[0] && q.mag <= localMagnitudeRange[1])
          .filter(
            (q: any) =>
              !localSearchRegion ||
              q.place.toLowerCase().includes(localSearchRegion.toLowerCase()) ||
              q.place.toLowerCase().includes(localSearchRegion.toLowerCase()),
          )
        setEarthquakeData(quakes)
        setIsLoading(false)
      } catch (error) {
        console.error("[v0] Error fetching quakes:", error)
        setIsLoading(false)
      }
    }
    fetchEarthquakeData()
  }, [localTimeRange, localMagnitudeRange, localSearchRegion])

  const filteredQuakes = useMemo(() => {
    // In production, filter based on actual timestamps
    return earthquakeData
  }, [earthquakeData, timeFilter])

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Interactive Global Seismic Map</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Explore real-time earthquake data on our interactive 3D globe. Hover over markers to see details, click to
            learn more about each event.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative">
            <Card className="overflow-hidden">
              <GlobeControls
                onSearchChange={setLocalSearchRegion}
                onTimeRangeChange={setLocalTimeRange}
                onMagnitudeChange={setLocalMagnitudeRange}
                searchValue={localSearchRegion}
                timeRange={localTimeRange}
                magnitudeRange={localMagnitudeRange}
              />
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg">
                    Live Earthquake Map{" "}
                    {isLoading && <span className="text-sm text-muted-foreground ml-2">(Loading...)</span>}
                  </CardTitle>
                  <Tabs value={timeFilter} onValueChange={setTimeFilter}>
                    <TabsList>
                      <TabsTrigger value="1h">1h</TabsTrigger>
                      <TabsTrigger value="24h">24h</TabsTrigger>
                      <TabsTrigger value="7d">7d</TabsTrigger>
                      <TabsTrigger value="30d">30d</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px] w-full bg-background/50">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">Loading earthquake data...</p>
                    </div>
                  ) : (
                    <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
                      <GlobeScene earthquakes={filteredQuakes} onSelectQuake={onLocationSelect} />
                    </Canvas>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { color: "#22c55e", label: "M < 4.0", desc: "Minor" },
                  { color: "#eab308", label: "M 4.0-4.9", desc: "Light" },
                  { color: "#f97316", label: "M 5.0-5.9", desc: "Moderate" },
                  { color: "#ef4444", label: "M ≥ 6.0", desc: "Strong+" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground ml-auto">{item.desc}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {selectedLocation ? (
              <Card className="border-cyan-500/50 bg-slate-800/70">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Event Details</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => onLocationSelect(null)}>
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{
                        backgroundColor: getMagnitudeColor(selectedLocation.mag) + "20",
                        color: getMagnitudeColor(selectedLocation.mag),
                      }}
                    >
                      {selectedLocation.mag.toFixed(1)}
                    </div>
                    <div>
                      <p className="font-medium">{selectedLocation.place}</p>
                      <p className="text-sm text-muted-foreground">{selectedLocation.time}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Depth</p>
                      <p className="font-medium">{selectedLocation.depth} km</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Coordinates</p>
                      <p className="font-medium font-mono text-xs">
                        {selectedLocation.lat.toFixed(2)}°, {selectedLocation.lng.toFixed(2)}°
                      </p>
                    </div>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    View Full Details
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredQuakes.slice(0, 4).map((quake) => (
                      <button
                        key={quake.id}
                        onClick={() => onLocationSelect(quake)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors text-left"
                      >
                        <Badge
                          variant="outline"
                          className="font-mono"
                          style={{ borderColor: getMagnitudeColor(quake.mag), color: getMagnitudeColor(quake.mag) }}
                        >
                          M{quake.mag.toFixed(1)}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{quake.place}</p>
                          <p className="text-xs text-muted-foreground">{quake.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
