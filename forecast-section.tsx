"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Info, AlertTriangle, Bell, MapPin } from "lucide-react"

const hazardZones = [
  { region: "Pacific Ring of Fire", probability: 95, timeframe: "M6+ in 30 years", risk: "Very High" },
  { region: "San Andreas Fault, CA", probability: 72, timeframe: "M6.7+ in 30 years", risk: "High" },
  { region: "Cascadia Subduction Zone", probability: 37, timeframe: "M9+ in 50 years", risk: "Moderate" },
  { region: "New Madrid Seismic Zone", probability: 25, timeframe: "M6+ in 50 years", risk: "Moderate" },
]

const aftershockForecasts = [
  {
    mainEvent: "M7.3 Vanuatu (Dec 2024)",
    forecasts: [
      { magnitude: "M5+", probability: 85, timeframe: "7 days" },
      { magnitude: "M6+", probability: 35, timeframe: "7 days" },
      { magnitude: "M7+", probability: 5, timeframe: "30 days" },
    ],
  },
]

export function ForecastSection() {
  return (
    <section id="forecasts" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Forecasts & Probabilities</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Statistical hazard assessments based on USGS seismic models. These are probabilities, not predictions.
          </p>
        </div>

        <Alert className="mb-8 border-primary/50 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> No technology can predict the exact time, location, or magnitude of future
            earthquakes. These probabilities are based on historical patterns and geological studies, representing
            statistical likelihood over long time periods.
            <a
              href="https://usgs.gov"
              className="text-primary hover:underline ml-1"
              target="_blank"
              rel="noreferrer noopener"
            >
              Learn more (USGS)
            </a>
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Regional Hazard Probabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Regional Hazard Probabilities
              </CardTitle>
              <CardDescription>Long-term earthquake probability estimates from seismic hazard models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {hazardZones.map((zone, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{zone.region}</p>
                      <p className="text-sm text-muted-foreground">{zone.timeframe}</p>
                    </div>
                    <Badge
                      variant={
                        zone.risk === "Very High" ? "destructive" : zone.risk === "High" ? "default" : "secondary"
                      }
                    >
                      {zone.risk}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={zone.probability} className="flex-1" />
                    <span className="text-sm font-medium w-12 text-right">{zone.probability}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Aftershock Forecasts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent" />
                Active Aftershock Forecasts
              </CardTitle>
              <CardDescription>
                Probability of aftershocks following recent major earthquakes (USGS model)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aftershockForecasts.map((event, i) => (
                <div key={i} className="space-y-4">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="font-medium text-sm">{event.mainEvent}</p>
                  </div>
                  <div className="space-y-3">
                    {event.forecasts.map((forecast, j) => (
                      <div key={j} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                        <div>
                          <p className="font-medium">{forecast.magnitude} aftershock</p>
                          <p className="text-sm text-muted-foreground">Within {forecast.timeframe}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{forecast.probability}%</p>
                          <p className="text-xs text-muted-foreground">probability</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 gap-2 bg-transparent">
                <Bell className="h-4 w-4" />
                Subscribe to Aftershock Alerts
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Early Warning Notice */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Earthquake Early Warning Systems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">How Early Warning Works</h4>
                <p className="text-sm text-muted-foreground">
                  Early warning systems like ShakeAlert detect earthquakes after they begin and send alerts before
                  strong shaking arrives. This provides <strong>seconds to tens of seconds</strong> of warning—enough
                  time to Drop, Cover, and Hold On.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Get Alerts</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Enable notifications to receive alerts when significant earthquakes occur in your region or areas you
                  monitor.
                </p>
                <Button>Enable Push Notifications</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
