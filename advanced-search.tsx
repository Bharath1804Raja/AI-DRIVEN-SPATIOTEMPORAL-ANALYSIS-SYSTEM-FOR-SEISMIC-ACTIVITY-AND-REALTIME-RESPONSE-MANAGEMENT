"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

const REGIONS_DATABASE = [
  "Japan Trench",
  "Kuril-Kamchatka Trench",
  "San Andreas Fault",
  "Himalayas",
  "Cascadia Subduction Zone",
  "Alpine Fault",
  "Mid-Ocean Ridges",
  "Philippine Trench",
  "Mariana Trench",
  "Tonga Trench",
  "Kermadec Trench",
  "Chile-Peru Trench",
  "Central American Seismic Zone",
]

interface SearchResult {
  region: string
  lastActivity: string
  recentMagnitude: number
}

export function AdvancedSearch() {
  const [query, setQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h")
  const [selectedMagnitude, setSelectedMagnitude] = useState("0")

  const filteredResults: SearchResult[] = useMemo(() => {
    if (!query.trim()) return []

    return REGIONS_DATABASE.filter((region) => region.toLowerCase().includes(query.toLowerCase())).map((region) => ({
      region,
      lastActivity: `${Math.random() > 0.5 ? "1" : Math.floor(Math.random() * 24)} hours ago`,
      recentMagnitude: Number((Math.random() * 7 + 2).toFixed(1)),
    }))
  }, [query])

  return (
    <div className="w-full relative">
      <div className="flex flex-col gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400" />
          <Input
            placeholder="Search countries, regions..."
            className="pl-10 bg-slate-800 border-cyan-500/30 text-white placeholder-slate-400 w-full"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowResults(true)
            }}
            onFocus={() => setShowResults(true)}
            aria-label="Search regions"
            aria-autocomplete="list"
            aria-expanded={showResults && filteredResults.length > 0}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("")
                setShowResults(false)
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 gap-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-800 border border-cyan-500/30 rounded text-white"
            aria-label="Time range filter"
          >
            <option value="1h">Last 1 hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>

          <select
            value={selectedMagnitude}
            onChange={(e) => setSelectedMagnitude(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-800 border border-cyan-500/30 rounded text-white"
            aria-label="Magnitude filter"
          >
            <option value="0">All Magnitudes</option>
            <option value="3">3.0+</option>
            <option value="4">4.0+</option>
            <option value="5">5.0+</option>
            <option value="6">6.0+</option>
          </select>
        </div>
      </div>

      {/* Results Dropdown */}
      {showResults && filteredResults.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-cyan-500/30 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          role="listbox"
        >
          {filteredResults.map((result, idx) => (
            <div
              key={idx}
              className="px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/50 cursor-pointer transition flex justify-between items-center"
              role="option"
              onClick={() => {
                setQuery(result.region)
                setShowResults(false)
              }}
            >
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{result.region}</p>
                <p className="text-slate-400 text-xs">{result.lastActivity}</p>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-bold ${
                    result.recentMagnitude > 6
                      ? "text-red-400"
                      : result.recentMagnitude > 4
                        ? "text-yellow-400"
                        : "text-green-400"
                  }`}
                >
                  M{result.recentMagnitude}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showResults && query && filteredResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-cyan-500/30 rounded-lg p-3 z-50">
          <p className="text-slate-400 text-sm">No regions found matching "{query}"</p>
        </div>
      )}
    </div>
  )
}
