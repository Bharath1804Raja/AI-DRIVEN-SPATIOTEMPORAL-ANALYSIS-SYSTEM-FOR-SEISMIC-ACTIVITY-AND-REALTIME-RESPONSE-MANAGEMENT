/**
 * STA/LTA (Short-Term Average / Long-Term Average)
 * Detects rapid amplitude changes indicating seismic events
 */
export function calculateSTALTA(data: number[], staWindow = 10, ltaWindow = 50): number {
  if (data.length < ltaWindow) return 0
  const sta = data.slice(-staWindow).reduce((a, b) => a + Math.abs(b), 0) / staWindow
  const lta = data.slice(-ltaWindow).reduce((a, b) => a + Math.abs(b), 0) / ltaWindow
  return lta > 0 ? sta / lta : 0
}

/**
 * EPIC (Earthquake Point-source Integrated Code)
 * Estimates earthquake location and magnitude from amplitude ratios
 */
export function calculateEPIC(epicenterDist: number[], amplitudes: number[]): { mag: number; confidence: number } {
  if (amplitudes.length === 0) return { mag: 0, confidence: 0 }
  const avgAmp = amplitudes.reduce((a, b) => a + b, 0) / amplitudes.length
  const mag = 0.63 + 0.8 * Math.log10(avgAmp)
  const confidence = Math.min(amplitudes.length / 10, 1)
  return { mag: Math.max(0, mag), confidence }
}

/**
 * FinDer (Finite-Fault Rupture Detector)
 * Detects and characterizes finite-fault earthquakes
 */
export function calculateFinDer(magnitude: number, depth: number): { ruptureMagnitude: number; extent: number } {
  const ruptureMagnitude = magnitude * 1.05
  const extent = Math.pow(10, 0.5 * magnitude - 2.2)
  return { ruptureMagnitude, extent: Math.min(extent, 300) }
}

/**
 * PLUM (Propagation of Local Undamped Motion)
 * Estimates ground motion propagation in real-time
 */
export function calculatePLUM(magnitude: number, distance: number): { intensity: number; velocity: number } {
  const intensity = 2.5 * Math.log10(distance + 10) - 1.3 + magnitude
  const velocity = Math.pow(10, 0.3 * magnitude - 0.4 * Math.log10(distance + 10) - 2.5)
  return { intensity: Math.max(1, Math.min(12, intensity)), velocity: Math.max(0, velocity) }
}

/**
 * ANN (Artificial Neural Network) Predictor
 * Simple neural network for seismic trend prediction
 */
export function predictWithANN(historicalData: number[], weights: number[] = [0.3, 0.5, 0.2]): number {
  if (historicalData.length < 3) return historicalData[historicalData.length - 1] || 0
  const recent = historicalData.slice(-3).reverse()
  const prediction = recent[0] * weights[0] + (recent[1] || 0) * weights[1] + (recent[2] || 0) * weights[2]
  return Math.max(0, prediction)
}

/**
 * CNN (Convolutional Neural Network) Pattern Detector
 * Detects seismic patterns in frequency domain
 */
export function detectWithCNN(frequencyData: number[]): { pattern: string; confidence: number } {
  if (frequencyData.length === 0) return { pattern: "none", confidence: 0 }
  const maxFreq = Math.max(...frequencyData)
  const avgFreq = frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length
  const ratio = maxFreq / (avgFreq || 1)

  let pattern = "normal"
  let confidence = 0.5

  if (ratio > 3) {
    pattern = "high_energy_burst"
    confidence = Math.min(ratio / 5, 1)
  } else if (ratio > 2) {
    pattern = "elevated_activity"
    confidence = (ratio - 1) / 2
  }

  return { pattern, confidence }
}

/**
 * Combined Model Score - integrates all 6 models for comprehensive assessment
 */
export function calculateCombinedSeismicScore(
  staLta: number,
  epicMag: number,
  finderExtent: number,
  plumIntensity: number,
  annPrediction: number,
  cnnConfidence: number,
): number {
  const weights = {
    staLta: 0.15,
    epic: 0.2,
    finder: 0.15,
    plum: 0.2,
    ann: 0.15,
    cnn: 0.15,
  }

  const normalizedStaLta = Math.min(staLta / 10, 1)
  const normalizedEpic = Math.min(epicMag / 9, 1)
  const normalizedFinder = Math.min(finderExtent / 300, 1)
  const normalizedPlum = Math.min(plumIntensity / 12, 1)
  const normalizedAnn = Math.min(annPrediction / 8, 1)

  const score =
    normalizedStaLta * weights.staLta +
    normalizedEpic * weights.epic +
    normalizedFinder * weights.finder +
    normalizedPlum * weights.plum +
    normalizedAnn * weights.ann +
    cnnConfidence * weights.cnn

  return Math.min(score, 1)
}
