import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Globe2 } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Live Monitoring Active
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl text-balance">
            AI-Driven Seismic Analysis & <span className="text-primary">Real-Time Response</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl text-pretty">
            Advanced spatiotemporal analysis of global seismic activity. Monitor earthquakes in real-time, understand
            risk levels, and stay prepared with AI-powered insights.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-2">
              View Live Map
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
            {[
              { icon: Globe2, label: "Global Coverage", value: "24/7" },
              { icon: Zap, label: "Avg. Detection", value: "<2 min" },
              { icon: Shield, label: "M7+ Annually", value: "~15-16" },
              { icon: Shield, label: "Active Stations", value: "2,000+" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-6 rounded-xl border border-border/50 bg-card/50">
                <stat.icon className="h-6 w-6 text-primary mb-3" />
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
