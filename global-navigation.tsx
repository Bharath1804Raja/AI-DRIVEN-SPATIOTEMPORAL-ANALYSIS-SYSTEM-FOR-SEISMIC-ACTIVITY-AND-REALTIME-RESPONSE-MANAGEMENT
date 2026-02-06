"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, BarChart3, AlertTriangle, Menu, X } from "lucide-react"
import { useState } from "react"
import { AdvancedSearch } from "@/components/advanced-search"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  description: string
}

export function GlobalNavigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems: NavItem[] = [
    {
      label: "Live Monitoring",
      href: "/",
      icon: <MapPin className="w-4 h-4" />,
      description: "Real-time earthquake tracking",
    },
    {
      label: "Analytics Dashboard",
      href: "/analytics",
      icon: <BarChart3 className="w-4 h-4" />,
      description: "Historical analysis",
    },
    {
      label: "Emergency & Preparedness",
      href: "/emergency",
      icon: <AlertTriangle className="w-4 h-4" />,
      description: "Safety guidance",
    },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-cyan-500/20">
        <div className="max-w-full px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-white hidden sm:inline">SeismoAI</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md">
              <AdvancedSearch />
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive(item.href)
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                      : "text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/50 border border-cyan-500/30 text-cyan-400"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-slate-800 border-b border-cyan-500/20">
              <div className="p-4 space-y-3">
                <div className="mb-4">
                  <AdvancedSearch />
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm ${
                      isActive(item.href) ? "bg-cyan-500/20 text-cyan-300" : "text-slate-300 hover:text-cyan-300"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
