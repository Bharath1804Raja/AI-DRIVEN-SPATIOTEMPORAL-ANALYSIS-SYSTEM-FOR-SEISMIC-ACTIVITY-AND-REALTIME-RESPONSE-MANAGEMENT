"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, ArrowUpRight, AlertCircle } from "lucide-react"

const significantQuakes = [
  {
    id: 1,
    place: "Turkey-Syria Border",
    date: "Feb 6, 2023",
    magnitude: 7.8,
    depth: 17.9,
    impact: "Devastating impact, 50,000+ casualties",
    isHighlight: true,
  },
  {
    id: 2,
    place: "Noto Peninsula, Japan",
    date: "Jan 1, 2024",
    magnitude: 7.5,
    depth: 10,
    impact: "Triggered tsunamis, significant damage",
    isHighlight: true,
  },
  {
    id: 3,
    place: "Morocco",
    date: "Sep 8, 2023",
    magnitude: 6.8,
    depth: 18.5,
    impact: "2,900+ casualties, historic villages damaged",
    isHighlight: false,
  },
  {
    id: 4,
    place: "Papua New Guinea",
    date: "Nov 17, 2024",
    magnitude: 7.0,
    depth: 58,
    impact: "Remote area, limited damage reports",
    isHighlight: false,
  },
  {
    id: 5,
    place: "Vanuatu",
    date: "Dec 17, 2024",
    magnitude: 7.3,
    depth: 43,
    impact: "Infrastructure damage, evacuation orders",
    isHighlight: false,
  },
  {
    id: 6,
    place: "Afghanistan",
    date: "Oct 7, 2023",
    magnitude: 6.3,
    depth: 14,
    impact: "Series of quakes, 2,000+ casualties",
    isHighlight: false,
  },
]

function getMagnitudeStyle(mag: number) {
  if (mag >= 7) return { bg: "bg-destructive/20", text: "text-destructive", border: "border-destructive/50" }
  if (mag >= 6) return { bg: "bg-accent/20", text: "text-accent", border: "border-accent/50" }
  return { bg: "bg-primary/20", text: "text-primary", border: "border-primary/50" }
}

export function RecentQuakesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Recent Significant Earthquakes</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Notable seismic events from recent years. These highlights provide context for understanding global seismic
            patterns.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {significantQuakes.map((quake) => {
            const style = getMagnitudeStyle(quake.magnitude)
            return (
              <Card
                key={quake.id}
                className={`relative overflow-hidden transition-all hover:shadow-lg hover:border-primary/30 ${
                  quake.isHighlight ? "ring-1 ring-destructive/30" : ""
                }`}
              >
                {quake.isHighlight && (
                  <div className="absolute top-0 right-0 px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-bl-lg">
                    Major Event
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {quake.place}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {quake.date}
                      </div>
                    </div>
                    <div className={`px-3 py-2 rounded-lg ${style.bg} ${style.border} border`}>
                      <span className={`text-2xl font-bold ${style.text}`}>M{quake.magnitude.toFixed(1)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Depth:</span>{" "}
                        <span className="font-medium">{quake.depth} km</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      {quake.impact}
                    </p>
                    <Button variant="ghost" size="sm" className="w-full mt-2 gap-2">
                      View Details
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            View All Earthquakes
          </Button>
        </div>
      </div>
    </section>
  )
}
