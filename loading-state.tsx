"use client"

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8" role="status" aria-live="polite" aria-label="Loading">
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-100" />
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-200" />
      </div>
      <span className="sr-only">Loading content...</span>
    </div>
  )
}

export function SkeletonLoader() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-slate-700/30 rounded w-3/4" />
      <div className="h-4 bg-slate-700/30 rounded w-1/2" />
      <div className="h-4 bg-slate-700/30 rounded w-2/3" />
    </div>
  )
}
