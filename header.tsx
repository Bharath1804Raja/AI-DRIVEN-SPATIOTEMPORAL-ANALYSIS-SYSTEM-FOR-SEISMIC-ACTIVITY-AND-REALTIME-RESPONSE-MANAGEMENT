"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Activity, Bell, Menu, X } from "lucide-react"
import Link from "next/link"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">SeismoAI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#globe" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Live Map
            </Link>
            <Link href="#dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="#forecasts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Forecasts
            </Link>
            <Link
              href="#preparedness"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Preparedness
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
            </Button>
            <Button className="hidden sm:flex">Get Alerts</Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="flex flex-col p-4 gap-2">
            <Link href="#globe" className="px-4 py-2 text-sm hover:bg-secondary rounded-lg">
              Live Map
            </Link>
            <Link href="#dashboard" className="px-4 py-2 text-sm hover:bg-secondary rounded-lg">
              Dashboard
            </Link>
            <Link href="#forecasts" className="px-4 py-2 text-sm hover:bg-secondary rounded-lg">
              Forecasts
            </Link>
            <Link href="#preparedness" className="px-4 py-2 text-sm hover:bg-secondary rounded-lg">
              Preparedness
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
