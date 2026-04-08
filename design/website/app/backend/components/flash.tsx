import * as React from 'react'
import * as Fibre from 'react-three/fiber'
import * as Three from 'three'

export interface FlashLightProperties {
  color?: string
  minInterval?: number
  maxInterval?: number
  peakIntensity?: number
  mapSize?: number
}

type Flicker = {
  startTime: number
  attackDuration: number  // ramp-up time
  decayDuration: number   // fade-out time
  intensity: number       // 0..1 multiplier
}
function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function flickerEnd(f: Flicker): number {
  return f.startTime + f.attackDuration + f.decayDuration
}

function buildStrike(now: number): Flicker[] {
  const flickerCount = 2 + Math.floor(Math.random() * 4)
  const flickers: Flicker[] = []
  let cursor = now

  for (let i = 0; i < flickerCount; i++) {
    const attackDuration = randomBetween(0.02, 0.06)  // quick ramp
    const decayDuration  = randomBetween(0.10, 0.30)  // slow fade
    const intensity      = randomBetween(0.5, 1.0)

    flickers.push({ startTime: cursor, attackDuration, decayDuration, intensity })

    // Next flicker starts after this one's attack, overlapping into its decay
    // so the burst feels like a continuous rolling flicker rather than separate pops
    cursor += attackDuration + randomBetween(0.04, 0.20)
  }

  return flickers
}

function sampleFlicker(f: Flicker, now: number): number {
  const elapsed = now - f.startTime
  if (elapsed < 0) return 0
  if (elapsed < f.attackDuration) {
    // Ease-in: smooth ramp up using smoothstep
    const t = elapsed / f.attackDuration
    return t * t * (3 - 2 * t)  // smoothstep
  }
  const decayElapsed = elapsed - f.attackDuration
  if (decayElapsed < f.decayDuration) {
    // Ease-out: smooth exponential-feel decay
    const t = decayElapsed / f.decayDuration
    return 1 - t * t  // quadratic ease-out
  }
  return 0
}

export function Flash({
  color = '#ccd8ff',
  minInterval = 2,
  maxInterval = 8,
  peakIntensity = 120,
  mapSize = 256,
}: FlashLightProperties) {
  const lightRef = React.useRef<Three.DirectionalLight>(null)
  const nextStrikeRef = React.useRef(performance.now() / 1000 + randomBetween(minInterval, maxInterval))
  const flickersRef = React.useRef<Flicker[]>([])

  Fibre.useFrame(() => {
    if (!lightRef.current) return

    const now = performance.now() / 1000

    // Schedule a new strike once all flickers have fully decayed
    if (flickersRef.current.length === 0 && now >= nextStrikeRef.current) {
      // Randomize X and Z position on every new strike, keeping Y height constant (64)
      lightRef.current.position.set(
        randomBetween(-100, 100),
        64, 
        randomBetween(-100, 100)
      )

      flickersRef.current = buildStrike(now)
      const last = flickersRef.current[flickersRef.current.length - 1]
      nextStrikeRef.current = flickerEnd(last) + randomBetween(minInterval, maxInterval)
    }

    // Accumulate intensity from all overlapping flickers (bursts can blend)
    let total = 0
    for (const f of flickersRef.current) {
      total += sampleFlicker(f, now) * f.intensity
    }

    lightRef.current.intensity = Math.min(total, 1) * peakIntensity

    // Prune fully decayed flickers
    flickersRef.current = flickersRef.current.filter((f) => now < flickerEnd(f))
  })

  return (
    <directionalLight
      ref={lightRef}
      color={color}
      intensity={0}
      position={[0, 64, 32]}
      castShadow
      shadow-mapSize-width={mapSize}
      shadow-mapSize-height={mapSize}
      shadow-camera-near={0.5}
      shadow-camera-far={500}
      shadow-camera-left={-100}
      shadow-camera-right={100}
      shadow-camera-top={100}
      shadow-camera-bottom={-100}
      shadow-bias={-0.0005}
    />
  )
}