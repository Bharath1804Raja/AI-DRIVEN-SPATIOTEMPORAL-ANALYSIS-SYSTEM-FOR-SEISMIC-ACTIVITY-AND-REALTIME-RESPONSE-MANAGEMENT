"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function useMobileResponsive() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  return (
    <div role="main" className="min-h-screen">
      {children}
    </div>
  )
}
