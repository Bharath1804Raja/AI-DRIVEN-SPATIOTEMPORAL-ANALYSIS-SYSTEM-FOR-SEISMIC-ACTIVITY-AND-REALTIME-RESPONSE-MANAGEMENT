// WebSocket Real-Time Predictions Manager
export interface PredictionUpdate {
  id: string
  region: string
  latitude: number
  longitude: number
  probability: number
  magnitude: [number, number]
  radius: number
  confidence: number
  lastUpdated: Date
}

export class PredictionWebSocket {
  private ws: WebSocket | null = null
  private url: string
  private listeners: Map<string, (data: PredictionUpdate[]) => void> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  constructor(url: string = "wss://api.seismoai.local/ws/predictions") {
    this.url = url
  }

  connect(onUpdate: (data: PredictionUpdate[]) => void, onError?: (error: Error) => void) {
    try {
      // For production, use actual WebSocket
      // For now, simulate with interval updates
      this.simulateRealTimeUpdates(onUpdate)
    } catch (error) {
      console.error("[v0] WebSocket connection error:", error)
      onError?.(error instanceof Error ? error : new Error("Connection failed"))
    }
  }

  private simulateRealTimeUpdates(callback: (data: PredictionUpdate[]) => void) {
    const regions = [
      { name: "Japan Trench", lat: 35.7, lng: 139.7 },
      { name: "San Andreas", lat: 37.9, lng: -120.8 },
      { name: "Chile Trench", lat: -33.9, lng: -71.3 },
      { name: "Cascadia", lat: 45.0, lng: -124.0 },
      { name: "Himalayas", lat: 28.5, lng: 87.0 },
      { name: "Rift Valley", lat: -1.5, lng: 29.8 },
      { name: "Marianas Trench", lat: 11.5, lng: 142.5 },
      { name: "Aleutian", lat: 52.0, lng: -173.0 },
      { name: "Vanuatu", lat: -17.0, lng: 167.5 },
      { name: "Kuril Islands", lat: 50.0, lng: 156.0 },
    ]

    // Update every 5 seconds with slight variations
    setInterval(() => {
      const updates: PredictionUpdate[] = regions.map((region, index) => ({
        id: `pred-${index}`,
        region: region.name,
        latitude: region.lat + (Math.random() - 0.5) * 0.1,
        longitude: region.lng + (Math.random() - 0.5) * 0.1,
        probability: 0.3 + Math.random() * 0.5,
        magnitude: [4.5 + Math.random() * 2, 6.5 + Math.random() * 1.5] as [number, number],
        radius: 50 + Math.random() * 250,
        confidence: 0.7 + Math.random() * 0.25,
        lastUpdated: new Date(),
      }))

      callback(updates)
    }, 5000)
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}
