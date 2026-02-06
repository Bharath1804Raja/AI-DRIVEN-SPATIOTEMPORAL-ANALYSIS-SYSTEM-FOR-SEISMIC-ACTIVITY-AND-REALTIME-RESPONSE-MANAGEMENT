"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Shield, Home, Package, Phone, Heart, Building, CheckCircle2 } from "lucide-react"

const preparednessGuide = [
  {
    id: "during",
    title: "During an Earthquake",
    icon: Shield,
    priority: "Critical",
    items: [
      {
        action: "DROP to your hands and knees",
        detail: "This position prevents falling and allows you to crawl to shelter",
      },
      {
        action: "Take COVER under a sturdy desk or table",
        detail: "Protect your head and neck with your arms if no shelter is available",
      },
      { action: "HOLD ON until shaking stops", detail: "Be prepared to move with your shelter if it shifts" },
      { action: "Stay away from windows and heavy objects", detail: "Glass and falling items cause many injuries" },
      { action: "If outdoors, move to an open area", detail: "Away from buildings, power lines, and trees" },
    ],
  },
  {
    id: "before",
    title: "Before an Earthquake",
    icon: Home,
    priority: "Important",
    items: [
      {
        action: "Secure heavy furniture and appliances",
        detail: "Use straps, brackets, or anchors to prevent tipping",
      },
      { action: "Know your building's safe spots", detail: "Under sturdy tables, away from windows and heavy objects" },
      { action: "Practice Drop, Cover, Hold On drills", detail: "Do this regularly with your family or household" },
      { action: "Review your insurance coverage", detail: "Standard policies often don't cover earthquake damage" },
    ],
  },
  {
    id: "kit",
    title: "Emergency Kit Essentials",
    icon: Package,
    priority: "Essential",
    items: [
      { action: "Water: 1 gallon per person per day (3-day minimum)", detail: "Store in clean, plastic containers" },
      { action: "Non-perishable food for 3+ days", detail: "Include a manual can opener" },
      { action: "Battery-powered or hand-crank radio", detail: "For emergency broadcasts and updates" },
      { action: "Flashlight and extra batteries", detail: "Multiple light sources recommended" },
      { action: "First aid kit", detail: "Include medications and medical supplies you need" },
      {
        action: "Important documents in waterproof container",
        detail: "IDs, insurance, bank info, emergency contacts",
      },
    ],
  },
  {
    id: "after",
    title: "After an Earthquake",
    icon: Heart,
    priority: "Important",
    items: [
      { action: "Check yourself and others for injuries", detail: "Provide first aid if trained to do so" },
      { action: "Expect aftershocks", detail: "Drop, Cover, Hold On each time" },
      {
        action: "Check for structural damage before re-entering",
        detail: "Leave if you smell gas or see major damage",
      },
      { action: "Use text messages instead of calls", detail: "Phone lines may be overloaded" },
      { action: "Listen to official instructions", detail: "Via radio, emergency alerts, or official websites" },
    ],
  },
]

export function PreparednessSection() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(id)) {
      newChecked.delete(id)
    } else {
      newChecked.add(id)
    }
    setCheckedItems(newChecked)
  }

  return (
    <section id="preparedness" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Earthquake Preparedness</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Earthquakes can happen anywhere. Being prepared can save lives. These guidelines are based on
            recommendations from the Red Cross and FEMA.
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Shield, label: "Drop, Cover, Hold On", desc: "Primary safety action" },
            { icon: Package, label: "Emergency Kit", desc: "3-day supplies minimum" },
            { icon: Phone, label: "Emergency Contacts", desc: "Know your local numbers" },
            { icon: Building, label: "Safe Spots", desc: "Identify in each room" },
          ].map((item, i) => (
            <Card key={i} className="text-center p-6 hover:border-primary/50 transition-colors">
              <item.icon className="h-10 w-10 mx-auto text-primary mb-3" />
              <h3 className="font-semibold">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>

        {/* Detailed Accordion */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Preparedness Guide</CardTitle>
            <CardDescription>
              Expand each section to view detailed guidance. Check off items as you complete them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {preparednessGuide.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <section.icon className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{section.title}</span>
                      <Badge variant={section.priority === "Critical" ? "destructive" : "secondary"}>
                        {section.priority}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {section.items.map((item, i) => {
                        const itemId = `${section.id}-${i}`
                        const isChecked = checkedItems.has(itemId)
                        return (
                          <button
                            key={i}
                            onClick={() => toggleItem(itemId)}
                            className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                              isChecked
                                ? "bg-primary/10 border border-primary/30"
                                : "bg-secondary/30 hover:bg-secondary/50"
                            }`}
                          >
                            <CheckCircle2
                              className={`h-5 w-5 mt-0.5 shrink-0 ${
                                isChecked ? "text-primary" : "text-muted-foreground"
                              }`}
                            />
                            <div>
                              <p className={`font-medium ${isChecked ? "text-primary" : ""}`}>{item.action}</p>
                              <p className="text-sm text-muted-foreground">{item.detail}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Sources */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>Sources:</span>
          <a
            href="https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/earthquake.html"
            target="_blank"
            rel="noreferrer noopener"
            className="text-primary hover:underline"
          >
            American Red Cross
          </a>
          <span>•</span>
          <a
            href="https://www.fema.gov/emergency-managers/risk-management/earthquake"
            target="_blank"
            rel="noreferrer noopener"
            className="text-primary hover:underline"
          >
            FEMA
          </a>
          <span>•</span>
          <a
            href="https://earthquake.usgs.gov/learn/"
            target="_blank"
            rel="noreferrer noopener"
            className="text-primary hover:underline"
          >
            USGS
          </a>
        </div>
      </div>
    </section>
  )
}
