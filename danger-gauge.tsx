"use client"

import { useEffect, useState } from "react"

interface DangerGaugeProps {
  selectedLocation: {
    place: string
    mag: number
    lat: number
    lng: number
    time: string
    depth: number
  } | null
}

export function DangerGauge({ selectedLocation }: DangerGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(42)

  useEffect(() => {
    let value = 42 // Global baseline
    if (selectedLocation) {
      const magFactor = Math.min((selectedLocation.mag / 8) * 40, 40)
      const depthFactor = selectedLocation.depth < 70 ? 20 : 10
      const isHighRiskZone =
        (selectedLocation.lat > 35 && selectedLocation.lng > 120) ||
        (selectedLocation.lat > 30 &&
          selectedLocation.lat < 40 &&
          selectedLocation.lng > 70 &&
          selectedLocation.lng < 90)
      const zoneFactor = isHighRiskZone ? 15 : 5
      value = Math.round(magFactor + depthFactor + zoneFactor)
    }
    setAnimatedValue(value)
  }, [selectedLocation])

  const getColorForValue = (val: number) => {
    if (val < 25) return { color: "#22c55e", label: "Low", desc: "Below average activity" }
    if (val < 50) return { color: "#eab308", label: "Moderate", desc: "Normal range" }
    if (val < 75) return { color: "#f97316", label: "Elevated", desc: "Above average activity" }
    return { color: "#ef4444", label: "High", desc: "Significantly elevated" }
  }

  const { color, label, desc } = getColorForValue(animatedValue)
  const radius = 80
  const strokeWidth = 12
  const circumference = Math.PI * radius
  const progress = (animatedValue / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Colored segments */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="33%" stopColor="#eab308" />
            <stop offset="66%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
        {/* Needle */}
        <g
          transform={`rotate(${-90 + (animatedValue / 100) * 180}, 100, 100)`}
          style={{ transition: "transform 1s ease-out" }}
        >
          <line x1="100" y1="100" x2="100" y2="35" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="8" fill={color} />
        </g>
        {/* Value text */}
        <text x="100" y="90" textAnchor="middle" className="fill-foreground text-2xl font-bold">
          {animatedValue}
        </text>
      </svg>
      <div className="text-center mt-2">
        <span
          className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
          style={{ backgroundColor: color + "20", color: color }}
        >
          {label}
        </span>
        <p className="text-sm text-muted-foreground mt-2">{desc}</p>
      </div>
    </div>
  )
}
