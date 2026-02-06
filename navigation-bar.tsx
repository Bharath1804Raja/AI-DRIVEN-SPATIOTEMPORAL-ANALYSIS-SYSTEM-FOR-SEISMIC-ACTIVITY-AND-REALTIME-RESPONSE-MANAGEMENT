"use client"

export interface NavigationBarProps {
  onTimeRangeChange?: (range: string) => void
  onMagnitudeChange?: (range: [number, number]) => void
  onSearchChange?: (search: string) => void
}

export function NavigationBar({}: NavigationBarProps) {
  return (
    <div className="bg-slate-900/50 backdrop-blur border-b border-cyan-500/20 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <p className="text-slate-400 text-sm">Navigation Menu</p>
      </div>
    </div>
  )
}
