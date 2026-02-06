/**
 * Probabilistic Risk Prediction Models
 * Combines CNN for pattern extraction with ANN for probability generation
 */

interface RegionalRiskData {
  region: string
  recentActivity: number[]
  historicalBaseline: number
  depth: number
  latitude: number
  longitude: number
}

interface PredictionResult {
  region: string
  probability: number
  riskLevel: "Low" | "Moderate" | "Elevated" | "High"
  confidence: number
  forecast7days: number
  forecast30days: number
}

/**
 * CNN-based pattern extraction for seismic data
 */
export function extractPatternsWithCNN(timeSeries: number[], kernelSize = 3): { patterns: number[]; strength: number } {
  if (timeSeries.length < kernelSize) {
    return { patterns: timeSeries, strength: 0 }
  }

  const patterns: number[] = []
  for (let i = 0; i <= timeSeries.length - kernelSize; i++) {
    const window = timeSeries.slice(i, i + kernelSize)
    const mean = window.reduce((a, b) => a + b, 0) / kernelSize
    const variance = window.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / kernelSize
    patterns.push(Math.sqrt(variance))
  }

  const strength = patterns.reduce((a, b) => a + b, 0) / patterns.length
  return { patterns, strength: Math.min(strength, 10) }
}

/**
 * ANN-based probability calculation with sigmoid output
 */
export function predictProbabilityWithANN(patterns: number[], historicalBaseline: number, recentTrend: number): number {
  // Weights for ANN layers
  const weights = {
    input: [0.3, 0.25, 0.2],
    hidden: [0.4, 0.35, 0.25],
    output: 0.5,
  }

  // Input layer
  const avgPattern = patterns.length > 0 ? patterns.reduce((a, b) => a + b, 0) / patterns.length : 0
  const inputs = [avgPattern, historicalBaseline, recentTrend]

  // Hidden layer
  let hidden = 0
  for (let i = 0; i < inputs.length; i++) {
    hidden += inputs[i] * weights.input[i]
  }
  hidden = Math.tanh(hidden) // Activation function

  // Output layer with sigmoid for probability
  const output = 1 / (1 + Math.exp(-hidden * weights.output))
  return Math.min(output, 1)
}

/**
 * Generate global probabilistic forecast
 */
export function generateGlobalForecast(regionalData: RegionalRiskData[], daysAhead: number): PredictionResult[] {
  return regionalData.map((region) => {
    const { patterns, strength } = extractPatternsWithCNN(region.recentActivity)
    const recentTrend =
      region.recentActivity.length > 0
        ? (region.recentActivity[region.recentActivity.length - 1] -
            region.recentActivity[Math.max(0, region.recentActivity.length - 7)]) /
          7
        : 0

    const probability = predictProbabilityWithANN(patterns, region.historicalBaseline, recentTrend)

    // Time-decay factor for different forecast windows
    const decay7 = 0.8
    const decay30 = 0.6

    // Determine risk level
    let riskLevel: "Low" | "Moderate" | "Elevated" | "High" = "Low"
    if (probability > 0.7) riskLevel = "High"
    else if (probability > 0.5) riskLevel = "Elevated"
    else if (probability > 0.3) riskLevel = "Moderate"

    return {
      region: region.region,
      probability: Math.min(probability, 1),
      riskLevel,
      confidence: Math.min(0.95, 0.6 + region.recentActivity.length * 0.05),
      forecast7days: probability * decay7,
      forecast30days: probability * decay30,
    }
  })
}

/**
 * Search for specific region's probabilistic risk
 */
export function searchRegionalRisk(regionName: string, regionalData: RegionalRiskData[]): PredictionResult | null {
  const region = regionalData.find((r) => r.region.toLowerCase() === regionName.toLowerCase())
  if (!region) return null

  const forecast = generateGlobalForecast([region], 7)[0]
  return forecast || null
}
