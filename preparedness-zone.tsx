"use client"

import { Heart, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

interface SelectedLocation {
  place: string
  mag: number
  lat: number
  lng: number
  time: string
  depth: number
}

interface PreparednessZoneProps {
  selectedLocation: SelectedLocation | null
}

const COUNTRY_EMERGENCY_DATA: Record<string, any> = {
  JP: {
    name: "Japan",
    emergencyNumber: "110 (Police) / 119 (Ambulance)",
    earthquakeHotline: "03-3211-0011",
    shelters: [
      { name: "Tokyo Metropolitan Building", lat: 35.6895, lng: 139.7671 },
      { name: "Yoyogi Park Shelter", lat: 35.6734, lng: 139.7003 },
      { name: "Odaiba Disaster Prevention Center", lat: 35.6294, lng: 139.7558 },
    ],
  },
  TR: {
    name: "Turkey",
    emergencyNumber: "112",
    earthquakeHotline: "0212-567-1234",
    shelters: [
      { name: "Istanbul Convention Center", lat: 41.077, lng: 29.0066 },
      { name: "Ümraniye Emergency Shelter", lat: 41.0275, lng: 29.1181 },
    ],
  },
  IN: {
    name: "India",
    emergencyNumber: "112 / 100",
    earthquakeHotline: "1077",
    shelters: [
      { name: "New Delhi Convention Center", lat: 28.5355, lng: 77.249 },
      { name: "Mumbai Emergency Relief Center", lat: 19.076, lng: 72.8777 },
      { name: "Ahmedabad Relief Shelter", lat: 23.0225, lng: 72.5714 },
    ],
  },
  US: {
    name: "United States",
    emergencyNumber: "911",
    earthquakeHotline: "1-800-USGS-ASK",
    shelters: [
      { name: "San Francisco Convention Center", lat: 37.7841, lng: -122.395 },
      { name: "Los Angeles Convention Center", lat: 34.4194, lng: -118.268 },
    ],
  },
  MX: {
    name: "Mexico",
    emergencyNumber: "911",
    earthquakeHotline: "5555-1435",
    shelters: [
      { name: "Mexico City Metropolitan Center", lat: 19.4343, lng: -99.1332 },
      { name: "Guadalajara Emergency Center", lat: 20.6637, lng: -103.276 },
    ],
  },
  CL: {
    name: "Chile",
    emergencyNumber: "911 / 133",
    earthquakeHotline: "1410",
    shelters: [
      { name: "Santiago Emergency Center", lat: -33.4489, lng: -70.6693 },
      { name: "Valparaíso Relief Center", lat: -33.0458, lng: -71.6196 },
    ],
  },
}

export function PreparednessZone({ selectedLocation }: PreparednessZoneProps) {
  const [selectedCountryCode, setSelectedCountryCode] = useState("US")
  const countryData = COUNTRY_EMERGENCY_DATA[selectedCountryCode] || COUNTRY_EMERGENCY_DATA.US

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20 p-4">
      <h4 className="text-sm font-semibold text-white mb-4">Preparedness & Safety</h4>
      <Tabs defaultValue="tips" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
          <TabsTrigger value="tips">Safety Tips</TabsTrigger>
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="tips" className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-slate-700/30 p-3 rounded border border-slate-600/30">
              <h5 className="font-semibold text-amber-300 text-sm mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> During Shaking
              </h5>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• DROP, COVER, and HOLD ON</li>
                <li>• Stay indoors if inside</li>
                <li>• Protect your head and neck</li>
              </ul>
            </div>
            <div className="bg-slate-700/30 p-3 rounded border border-slate-600/30">
              <h5 className="font-semibold text-green-300 text-sm mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4" /> Stay Safe
              </h5>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• Secure heavy furniture</li>
                <li>• Have emergency kit ready</li>
                <li>• Know exit routes</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="contacts" className="space-y-3">
          <div>
            <label className="text-sm text-slate-300 mb-2 block">Select Country/Region:</label>
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="w-full px-3 py-2 rounded bg-slate-700/50 border border-cyan-500/30 text-white text-sm mb-4"
            >
              {Object.entries(COUNTRY_EMERGENCY_DATA).map(([code, data]) => (
                <option key={code} value={code}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-slate-700/30 p-3 rounded border border-red-500/30">
            <h5 className="font-semibold text-red-300 text-sm mb-2">Emergency Numbers</h5>
            <p className="text-sm text-slate-200 mb-2">
              <span className="font-semibold">General Emergency:</span> {countryData.emergencyNumber}
            </p>
            <p className="text-sm text-slate-200">
              <span className="font-semibold">Earthquake Hotline:</span> {countryData.earthquakeHotline}
            </p>
          </div>
          <div className="bg-slate-700/30 p-3 rounded border border-blue-500/30">
            <h5 className="font-semibold text-blue-300 text-sm mb-2">Designated Shelters</h5>
            <div className="space-y-2">
              {countryData.shelters.map((shelter: any, idx: number) => (
                <div key={idx} className="text-xs text-slate-200">
                  <p className="font-semibold">{shelter.name}</p>
                  <p className="text-slate-400">
                    Coordinates: {shelter.lat.toFixed(4)}°, {shelter.lng.toFixed(4)}°
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="resources">
          <div className="space-y-2 text-sm">
            <a href="#" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
              Red Cross Earthquake Safety
            </a>
            <a href="#" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
              FEMA Preparedness Guide
            </a>
            <a
              href="https://earthquake.usgs.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
            >
              USGS Real-time Earthquake Data
            </a>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
