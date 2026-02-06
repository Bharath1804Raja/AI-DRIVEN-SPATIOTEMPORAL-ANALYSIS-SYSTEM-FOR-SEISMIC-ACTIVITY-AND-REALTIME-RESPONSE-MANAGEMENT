"use client"

import { AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { DangerGauge } from "@/components/danger-gauge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SelectedLocation {
  place: string
  mag: number
  lat: number
  lng: number
  time: string
  depth: number
}

interface RiskAlertZoneProps {
  selectedLocation: SelectedLocation | null
}

export function RiskAlertZone({ selectedLocation }: RiskAlertZoneProps) {
  // Mock recent alerts
  const recentAlerts = [
    { magnitude: 6.8, location: "Chile", time: "2 hours ago", severity: "high" },
    { magnitude: 5.2, location: "Japan", time: "4 hours ago", severity: "medium" },
  ]

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Risk Severity Meter */}
      <Card className="bg-slate-800/50 border-cyan-500/20 p-4">
        <h4 className="text-sm font-semibold text-white mb-4">Risk Severity Index</h4>
        <DangerGauge selectedLocation={selectedLocation} />
      </Card>

      {/* Real-Time Alerts Panel */}
      <Card className="bg-slate-800/50 border-cyan-500/20 p-4 flex-1">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          Recent Alerts
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentAlerts.map((alert, idx) => (
            <Alert key={idx} className="bg-slate-700/50 border-amber-500/30">
              <AlertDescription className="text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-amber-300">
                      M{alert.magnitude} • {alert.location}
                    </p>
                    <p className="text-xs text-slate-400">{alert.time}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      alert.severity === "high" ? "bg-red-500/20 text-red-300" : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4 border-t border-slate-700/50 pt-3">Last update: 2 minutes ago</p>
      </Card>
    </div>
  )
}
