import { Activity } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">SeismoAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-driven spatiotemporal analysis of seismic activity and real-time response management.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#globe" className="hover:text-foreground transition-colors">
                  Live Map
                </Link>
              </li>
              <li>
                <Link href="#dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#forecasts" className="hover:text-foreground transition-colors">
                  Forecasts
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  API Access
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#preparedness" className="hover:text-foreground transition-colors">
                  Preparedness Guide
                </Link>
              </li>
              <li>
                <a
                  href="https://earthquake.usgs.gov"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-foreground transition-colors"
                >
                  USGS Data
                </a>
              </li>
              <li>
                <a
                  href="https://www.redcross.org"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-foreground transition-colors"
                >
                  Red Cross
                </a>
              </li>
              <li>
                <a
                  href="https://www.fema.gov"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-foreground transition-colors"
                >
                  FEMA
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Data Sources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://earthquake.usgs.gov"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-foreground transition-colors"
                >
                  USGS Earthquake Hazards
                </a>
              </li>
              <li>
                <a
                  href="https://www.emsc-csem.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-foreground transition-colors"
                >
                  EMSC
                </a>
              </li>
              <li>
                <a
                  href="https://earthquake.usgs.gov/earthquakes/events/shake-alert/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-foreground transition-colors"
                >
                  ShakeAlert
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} SeismoAI. Data provided by USGS, EMSC, and ShakeAlert. Earthquake predictions are not possible. All forecasts are statistical probabilities based on historical data.
          </p>
        </div>
      </div>
    </footer>
  )
}
