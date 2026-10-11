/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import { defaultSettings } from './settings.ts'

// ---------------------------------------------------------------
// DEBUGGING
// ---------------------------------------------------------------
export const DEBUG_MODE_ENABLED = false

const initialThemeProgress = localStorage.getItem('theme') === 'light' ? 1 : 0

export type ThemeMode = 'dark' | 'light'
export type CubeSetKey = 'cubeSetA' | 'cubeSetB'
export type CubeDistribution = 'random' | 'grid'
export type CubeSetCounts = Record<CubeSetKey, number>
export type CubeSetAWaveEmitter = {
  x: number
  z: number
  frequency: number
  amplitude: number
}
type Position2D = { x: number; z: number }
type Position3D = { x: number; y: number; z: number }
type CameraAimSettings = {
  yaw: number
  pitch: number
  distance: number
}
type CubeSetSettings = {
  range: number
  scale: number
  color: string
  distribution: CubeDistribution
  metalness: number
  shininess: number
  specularIntensity: number
}
export type ThemeProperties = {
  appearance: {
    logoShadowStrength: number
    logoShadowBlur: number
    textShadowStrength: number
    textShadowBlur: number
    cssBlur: number
    dropShadowColor: string
  }
  flash: {
    enabled: boolean
    color: string
    intensity: number
  }
  camera: {
    speed: number
    height: number
    position: Position2D
    aim: CameraAimSettings
  }
  cubeSetA: CubeSetSettings & {
    height: number
    waveAmplitude: number
    waveSpeed: number
    waveTilt: boolean
    waveEmitterCount: number
    waveEmitters: CubeSetAWaveEmitter[]
  }
  cubeSetB: CubeSetSettings & {
    height: number
    elevation: number
  }
  ground: {
    scale: number
    y: number
    color: string
  }
  light: {
    fogDensity: number
    directionalIntensity: number
    ambientIntensity: number
    position: Position3D
    color: string
    ambientColor: string
    fogColor: string
  }
}
export type ThemeSettingPath =
  | { group: 'appearance'; key: 'logoShadowStrength' | 'logoShadowBlur' | 'textShadowStrength' | 'textShadowBlur' | 'cssBlur' }
  | { group: 'flash'; key: 'intensity' }
  | { group: 'camera'; key: 'speed' | 'height' }
  | { group: 'cameraPosition'; key: keyof Position2D }
  | { group: 'cameraAim'; key: keyof CameraAimSettings }
  | { group: 'cubeSetA'; key: 'range' | 'scale' | 'height' | 'waveAmplitude' | 'waveSpeed' | 'waveEmitterCount' | 'metalness' | 'shininess' | 'specularIntensity' }
  | { group: 'cubeSetAWaveEmitter'; index: number; key: keyof CubeSetAWaveEmitter }
  | { group: 'cubeSetB'; key: 'range' | 'scale' | 'height' | 'elevation' | 'metalness' | 'shininess' | 'specularIntensity' }
  | { group: 'ground'; key: 'scale' | 'y' }
  | { group: 'light'; key: 'fogDensity' | 'directionalIntensity' | 'ambientIntensity' }
  | { group: 'lightPosition'; key: keyof Position3D }

export type ThemeColorPath =
  | { group: 'appearance'; key: 'dropShadowColor' }
  | { group: 'flash'; key: 'color' }
  | { group: 'cubeSetA' | 'cubeSetB' | 'ground'; key: 'color' }
  | { group: 'light'; key: 'color' | 'ambientColor' | 'fogColor' }

export type SharedSceneSettings = {
  cubeCounts: CubeSetCounts
  cubeBevels: Record<CubeSetKey, number>
}
export type ThemeConfiguration = Record<ThemeMode, ThemeProperties> & SharedSceneSettings

export const cubeSetCountLimits: Record<CubeSetKey, { min: number; max: number }> = {
  cubeSetA: { min: 0, max: 2048 },
  cubeSetB: { min: 0, max: 256 },
}
export const cubeBevelLimits = { min: 0, max: 0.5 }
export const cubeSetScaleLimits = { min: 0.1, max: 10 }
export const cubeSetBElevationLimits = { min: -20, max: 100 }
export const cubeSetMaterialLimits = {
  metalness: { min: 0, max: 1 },
  shininess: { min: 0, max: 100 },
  specularIntensity: { min: 0, max: 1 },
}
export const cssBlurLimits = { min: 0, max: 20 }
export const flashIntensityLimits = { min: 0, max: 120 }
export const cameraAimLimits = {
  yaw: { min: -180, max: 180 },
  pitch: { min: -89, max: 89 },
  distance: { min: 1, max: 200 },
}
export const cubeSetRangeLimits = { min: 64, max: 512 }
export const cubeSetATileHeightLimits = { min: 0.1, max: 8 }
export const cubeSetAWaveAmplitudeLimits = { min: 0, max: 10 }
export const cubeSetAWaveEmitterCountLimits = { min: 0, max: 8 }
export const cubeSetAWaveEmitterFrequencyLimits = { min: 0.01, max: 0.5 }
export const cubeSetAWaveEmitterAmplitudeLimits = { min: 0, max: 2 }
export const cubeSetAWaveSpeedLimits = { min: 0, max: 10 }
export const groundScaleLimits = { min: 0.25, max: 3 }
export const groundYLimits = { min: -50, max: 50 }

const cubeBevelDefaults: Record<CubeSetKey, number> = { ...defaultSettings.cubeBevels }

export const sharedSceneSettings: SharedSceneSettings = {
  cubeCounts: { ...defaultSettings.cubeCounts },
  cubeBevels: { ...defaultSettings.cubeBevels },
}
let sharedSceneVersion = 0
const sharedSceneListeners = new Set<() => void>()

// ------------------------------------------------------------------
// SubscribeSharedScene
// ------------------------------------------------------------------
export function subscribeSharedScene(listener: () => void) {
  sharedSceneListeners.add(listener)
  return () => {
    sharedSceneListeners.delete(listener)
  }
}

// ------------------------------------------------------------------
// GetSharedSceneVersion
// ------------------------------------------------------------------
export function getSharedSceneVersion() {
  return sharedSceneVersion
}

// ------------------------------------------------------------------
// NotifySceneGeometryChanged
// ------------------------------------------------------------------
export function notifySceneGeometryChanged() {
  sharedSceneVersion++
  sharedSceneListeners.forEach((listener) => listener())
}

// ------------------------------------------------------------------
// SetSharedSceneSettings
// ------------------------------------------------------------------
export function setSharedSceneSettings(settings: SharedSceneSettings) {
  for (const key of ['cubeSetA', 'cubeSetB'] as const) {
    const { min, max } = cubeSetCountLimits[key]
    if (!Number.isInteger(settings.cubeCounts[key])
      || settings.cubeCounts[key] < min
      || settings.cubeCounts[key] > max) {
      throw new RangeError(`Invalid ${key} count: ${settings.cubeCounts[key]}`)
    }
    const bevel = settings.cubeBevels[key]
    if (!Number.isFinite(bevel) || bevel < cubeBevelLimits.min || bevel > cubeBevelLimits.max) {
      throw new RangeError(`Invalid ${key} bevel: ${bevel}`)
    }
  }
  if (sharedSceneSettings.cubeCounts.cubeSetA === settings.cubeCounts.cubeSetA
    && sharedSceneSettings.cubeCounts.cubeSetB === settings.cubeCounts.cubeSetB
    && sharedSceneSettings.cubeBevels.cubeSetA === settings.cubeBevels.cubeSetA
    && sharedSceneSettings.cubeBevels.cubeSetB === settings.cubeBevels.cubeSetB) return
  sharedSceneSettings.cubeCounts.cubeSetA = settings.cubeCounts.cubeSetA
  sharedSceneSettings.cubeCounts.cubeSetB = settings.cubeCounts.cubeSetB
  sharedSceneSettings.cubeBevels.cubeSetA = settings.cubeBevels.cubeSetA
  sharedSceneSettings.cubeBevels.cubeSetB = settings.cubeBevels.cubeSetB
  notifySceneGeometryChanged()
}

export const themeDefaults: Record<ThemeMode, ThemeProperties> = {
  dark: defaultSettings.dark,
  light: defaultSettings.light,
}

function copyTheme(settings: ThemeProperties): ThemeProperties {
  return {
    appearance: { ...settings.appearance },
    flash: { ...settings.flash },
    camera: {
      ...settings.camera,
      position: { ...settings.camera.position },
      aim: { ...settings.camera.aim },
    },
    cubeSetA: {
      ...settings.cubeSetA,
      waveEmitters: settings.cubeSetA.waveEmitters.map((emitter) => ({ ...emitter })),
    },
    cubeSetB: { ...settings.cubeSetB },
    ground: { ...settings.ground },
    light: { ...settings.light, position: { ...settings.light.position } },
  }
}

export const themeSettings: Record<ThemeMode, ThemeProperties> = {
  dark: copyTheme(themeDefaults.dark),
  light: copyTheme(themeDefaults.light),
}

function isThemeSettings(value: unknown): value is ThemeConfiguration {
  function isRecord(entry: unknown): entry is Record<string, unknown> {
    return typeof entry === 'object' && entry !== null
  }
  function isNumber(entry: unknown): entry is number {
    return typeof entry === 'number' && Number.isFinite(entry)
  }
  function isCubeSetCount(entry: unknown, key: CubeSetKey): entry is number {
    const { min, max } = cubeSetCountLimits[key]
    return isNumber(entry) && Number.isInteger(entry) && entry >= min && entry <= max
  }
  function isColor(entry: unknown): entry is string {
    return typeof entry === 'string' && /^#[\da-f]{6}$/i.test(entry)
  }
  function isDistribution(entry: unknown): entry is CubeDistribution {
    return entry === 'random' || entry === 'grid'
  }
  function isCubeSet(entry: unknown): entry is CubeSetSettings {
    return isRecord(entry)
      && isNumber(entry.range)
      && entry.range >= cubeSetRangeLimits.min
      && entry.range <= cubeSetRangeLimits.max
      && isNumber(entry.scale)
      && isColor(entry.color)
      && isDistribution(entry.distribution)
      && isNumber(entry.metalness)
      && entry.metalness >= cubeSetMaterialLimits.metalness.min
      && entry.metalness <= cubeSetMaterialLimits.metalness.max
      && isNumber(entry.shininess)
      && entry.shininess >= cubeSetMaterialLimits.shininess.min
      && entry.shininess <= cubeSetMaterialLimits.shininess.max
      && isNumber(entry.specularIntensity)
      && entry.specularIntensity >= cubeSetMaterialLimits.specularIntensity.min
      && entry.specularIntensity <= cubeSetMaterialLimits.specularIntensity.max
  }
  function isCubeSetB(entry: unknown): entry is ThemeProperties['cubeSetB'] {
    return isCubeSet(entry)
      && 'height' in entry
      && isNumber(entry.height)
      && 'elevation' in entry
      && isNumber(entry.elevation)
      && entry.elevation >= cubeSetBElevationLimits.min
      && entry.elevation <= cubeSetBElevationLimits.max
  }
  function isWaveEmitter(entry: unknown): entry is CubeSetAWaveEmitter {
    return isRecord(entry)
      && isNumber(entry.x)
      && entry.x >= -1
      && entry.x <= 1
      && isNumber(entry.z)
      && entry.z >= -1
      && entry.z <= 1
      && isNumber(entry.frequency)
      && entry.frequency >= cubeSetAWaveEmitterFrequencyLimits.min
      && entry.frequency <= cubeSetAWaveEmitterFrequencyLimits.max
      && isNumber(entry.amplitude)
      && entry.amplitude >= cubeSetAWaveEmitterAmplitudeLimits.min
      && entry.amplitude <= cubeSetAWaveEmitterAmplitudeLimits.max
  }
  function isCubeSetA(entry: unknown): entry is ThemeProperties['cubeSetA'] {
    return isCubeSet(entry)
      && isRecord(entry)
      && 'height' in entry
      && isNumber(entry.height)
      && entry.height >= cubeSetATileHeightLimits.min
      && entry.height <= cubeSetATileHeightLimits.max
      && 'waveAmplitude' in entry
      && isNumber(entry.waveAmplitude)
      && entry.waveAmplitude >= cubeSetAWaveAmplitudeLimits.min
      && entry.waveAmplitude <= cubeSetAWaveAmplitudeLimits.max
      && 'waveSpeed' in entry
      && isNumber(entry.waveSpeed)
      && entry.waveSpeed >= cubeSetAWaveSpeedLimits.min
      && entry.waveSpeed <= cubeSetAWaveSpeedLimits.max
      && 'waveTilt' in entry
      && typeof entry.waveTilt === 'boolean'
      && 'waveEmitterCount' in entry
      && isNumber(entry.waveEmitterCount)
      && Number.isInteger(entry.waveEmitterCount)
      && entry.waveEmitterCount >= cubeSetAWaveEmitterCountLimits.min
      && entry.waveEmitterCount <= cubeSetAWaveEmitterCountLimits.max
      && 'waveEmitters' in entry
      && Array.isArray(entry.waveEmitters)
      && entry.waveEmitters.length === cubeSetAWaveEmitterCountLimits.max
      && entry.waveEmitters.every(isWaveEmitter)
  }
  function isThemeProperties(entry: unknown): entry is ThemeProperties {
    if (!isRecord(entry)) return false
    const { appearance, flash, camera, cubeSetA, cubeSetB, ground, light } = entry
    if (!isRecord(appearance)
      || !isRecord(flash)
      || !isRecord(camera)
      || !isRecord(camera.position)
      || !isRecord(camera.aim)
      || !isRecord(ground)
      || !isRecord(light)
      || !isRecord(light.position)
      || !isCubeSetA(cubeSetA)
      || !isCubeSetB(cubeSetB)) return false
    return isNumber(appearance.logoShadowStrength)
      && isNumber(appearance.logoShadowBlur)
      && isNumber(appearance.textShadowStrength)
      && isNumber(appearance.textShadowBlur)
      && isNumber(appearance.cssBlur)
      && appearance.cssBlur >= cssBlurLimits.min
      && appearance.cssBlur <= cssBlurLimits.max
      && isColor(appearance.dropShadowColor)
      && typeof flash.enabled === 'boolean'
      && isColor(flash.color)
      && isNumber(flash.intensity)
      && flash.intensity >= flashIntensityLimits.min
      && flash.intensity <= flashIntensityLimits.max
      && isNumber(camera.speed)
      && isNumber(camera.height)
      && isNumber(camera.position.x)
      && isNumber(camera.position.z)
      && isNumber(camera.aim.yaw)
      && camera.aim.yaw >= cameraAimLimits.yaw.min
      && camera.aim.yaw <= cameraAimLimits.yaw.max
      && isNumber(camera.aim.pitch)
      && camera.aim.pitch >= cameraAimLimits.pitch.min
      && camera.aim.pitch <= cameraAimLimits.pitch.max
      && isNumber(camera.aim.distance)
      && camera.aim.distance >= cameraAimLimits.distance.min
      && camera.aim.distance <= cameraAimLimits.distance.max
      && isNumber(ground.scale)
      && ground.scale >= groundScaleLimits.min
      && ground.scale <= groundScaleLimits.max
      && isNumber(ground.y)
      && ground.y >= groundYLimits.min
      && ground.y <= groundYLimits.max
      && isColor(ground.color)
      && isNumber(light.fogDensity)
      && isNumber(light.directionalIntensity)
      && isNumber(light.ambientIntensity)
      && isNumber(light.position.x)
      && isNumber(light.position.y)
      && isNumber(light.position.z)
      && isColor(light.color)
      && isColor(light.ambientColor)
      && isColor(light.fogColor)
  }
  return isRecord(value)
    && isThemeProperties(value.dark)
    && isThemeProperties(value.light)
    && isRecord(value.cubeCounts)
    && isCubeSetCount(value.cubeCounts.cubeSetA, 'cubeSetA')
    && isCubeSetCount(value.cubeCounts.cubeSetB, 'cubeSetB')
    && isRecord(value.cubeBevels)
    && isNumber(value.cubeBevels.cubeSetA)
    && value.cubeBevels.cubeSetA >= cubeBevelLimits.min
    && value.cubeBevels.cubeSetA <= cubeBevelLimits.max
    && isNumber(value.cubeBevels.cubeSetB)
    && value.cubeBevels.cubeSetB >= cubeBevelLimits.min
    && value.cubeBevels.cubeSetB <= cubeBevelLimits.max
}

export function normalizeThemeSettings(value: unknown): ThemeConfiguration | undefined {
  function isRecord(entry: unknown): entry is Record<string, unknown> {
    return typeof entry === 'object' && entry !== null
  }
  function convertLegacyTheme(entry: unknown, defaults: ThemeProperties): unknown {
    if (!isRecord(entry)) return undefined
    const { appearance, lighting, camera, scene, colors } = entry
    if (!isRecord(appearance)
      || !isRecord(lighting)
      || !isRecord(camera)
      || !isRecord(scene)
      || !isRecord(colors)) return undefined
    return {
      appearance: { ...defaults.appearance, ...appearance },
      flash: { ...defaults.flash, ...(isRecord(entry.flash) ? entry.flash : {}) },
      camera: { ...defaults.camera, speed: camera.speed, height: camera.height },
      cubeSetA: {
        ...defaults.cubeSetA,
        range: scene.cubeSetARange,
        scale: scene.cubeSetAScale,
        color: colors.cubeSetA,
        waveAmplitude: scene.tileWaveAmplitude,
      },
      cubeSetB: {
        ...defaults.cubeSetB,
        range: scene.cubeSetARange,
        scale: scene.cubeSetBScale,
        height: scene.cubeSetBHeight,
        color: colors.cubeSetB,
      },
      ground: { scale: scene.groundScale, y: defaults.ground.y, color: colors.ground },
      light: {
        ...defaults.light,
        fogDensity: lighting.fogDensity,
        directionalIntensity: lighting.directionalIntensity,
        ambientIntensity: lighting.ambientIntensity,
        position: lighting.position,
      },
    }
  }
  function convertGroupedTheme(entry: unknown, defaults: ThemeProperties): unknown {
    if (!isRecord(entry) || !isRecord(entry.cubeSetA)) return undefined
    const appearance = isRecord(entry.appearance)
      ? { ...defaults.appearance, ...entry.appearance }
      : entry.appearance
    const flash = isRecord(entry.flash)
      ? { ...defaults.flash, ...entry.flash }
      : { ...defaults.flash }
    const camera = isRecord(entry.camera) ? { ...entry.camera } : entry.camera
    if (isRecord(camera)) {
      camera.aim = {
        ...defaults.camera.aim,
        ...(isRecord(camera.aim) ? camera.aim : {}),
      }
    }
    const cubeSetA = { ...entry.cubeSetA }
    if (!('height' in cubeSetA)) cubeSetA.height = defaults.cubeSetA.height
    for (const key of ['metalness', 'shininess', 'specularIntensity'] as const) {
      if (!(key in cubeSetA)) cubeSetA[key] = defaults.cubeSetA[key]
    }
    if (!('waveSpeed' in cubeSetA)) cubeSetA.waveSpeed = defaults.cubeSetA.waveSpeed
    if (!('waveTilt' in cubeSetA)) cubeSetA.waveTilt = defaults.cubeSetA.waveTilt
    if (!('waveEmitterCount' in cubeSetA)) cubeSetA.waveEmitterCount = defaults.cubeSetA.waveEmitterCount
    if (!('waveEmitters' in cubeSetA)) {
      cubeSetA.waveEmitters = defaults.cubeSetA.waveEmitters.map((emitter) => ({ ...emitter }))
    }
    const cubeSetB = isRecord(entry.cubeSetB) ? { ...entry.cubeSetB } : entry.cubeSetB
    if (isRecord(cubeSetB)) {
      delete cubeSetB.waveAmplitude
      if (!('elevation' in cubeSetB)) cubeSetB.elevation = defaults.cubeSetB.elevation
      for (const key of ['metalness', 'shininess', 'specularIntensity'] as const) {
        if (!(key in cubeSetB)) cubeSetB[key] = defaults.cubeSetB[key]
      }
    }
    const ground = isRecord(entry.ground) ? { ...entry.ground } : entry.ground
    if (isRecord(ground) && !('y' in ground)) ground.y = defaults.ground.y
    return {
      ...entry,
      appearance,
      flash,
      camera,
      cubeSetA,
      cubeSetB,
      ground,
    }
  }
  if (!isRecord(value) || !isRecord(value.cubeCounts)) return undefined
  const cubeBevels = isRecord(value.cubeBevels)
    ? { ...cubeBevelDefaults, ...value.cubeBevels }
    : { ...cubeBevelDefaults }
  const candidate = {
    dark: convertGroupedTheme(value.dark, themeDefaults.dark)
      ?? convertLegacyTheme(value.dark, themeDefaults.dark),
    light: convertGroupedTheme(value.light, themeDefaults.light)
      ?? convertLegacyTheme(value.light, themeDefaults.light),
    cubeCounts: value.cubeCounts,
    cubeBevels,
  }
  return isThemeSettings(candidate) ? candidate : undefined
}

export function resetThemeSettings(mode: ThemeMode) {
  themeSettings[mode] = copyTheme(themeDefaults[mode])
  notifySceneGeometryChanged()
}

export function applyThemeSettings(value: ThemeConfiguration) {
  themeSettings.dark = copyTheme(value.dark)
  themeSettings.light = copyTheme(value.light)
  setSharedSceneSettings({ cubeCounts: value.cubeCounts, cubeBevels: value.cubeBevels })
  notifySceneGeometryChanged()
}

export const themeProgress = { value: initialThemeProgress }

export function setThemeProgress(value: number) {
  themeProgress.value = value
  document.documentElement.style.setProperty('--theme-progress', `${value * 100}%`)
  document.documentElement.style.setProperty('--home-shadow-offset', `${2 * (1 - value)}px`)
  const logoShadowStrength = themeSettings.dark.appearance.logoShadowStrength
    + (themeSettings.light.appearance.logoShadowStrength - themeSettings.dark.appearance.logoShadowStrength) * value
  const logoShadowBlur = themeSettings.dark.appearance.logoShadowBlur
    + (themeSettings.light.appearance.logoShadowBlur - themeSettings.dark.appearance.logoShadowBlur) * value
  const textShadowStrength = themeSettings.dark.appearance.textShadowStrength
    + (themeSettings.light.appearance.textShadowStrength - themeSettings.dark.appearance.textShadowStrength) * value
  const textShadowBlur = themeSettings.dark.appearance.textShadowBlur
    + (themeSettings.light.appearance.textShadowBlur - themeSettings.dark.appearance.textShadowBlur) * value
  const cssBlur = themeSettings.dark.appearance.cssBlur
    + (themeSettings.light.appearance.cssBlur - themeSettings.dark.appearance.cssBlur) * value
  const shadowColor = `color-mix(in srgb, ${themeSettings.dark.appearance.dropShadowColor} ${100 * (1 - value)}%, ${themeSettings.light.appearance.dropShadowColor})`
  document.documentElement.style.setProperty('--home-logo-shadow-strength', `${logoShadowStrength}%`)
  document.documentElement.style.setProperty('--home-logo-shadow-blur', `${logoShadowBlur}px`)
  document.documentElement.style.setProperty('--home-text-shadow-strength', `${textShadowStrength}%`)
  document.documentElement.style.setProperty('--home-text-shadow-blur', `${textShadowBlur}px`)
  document.documentElement.style.setProperty('--home-shadow-base-color', shadowColor)
  document.documentElement.style.setProperty('--backend-scene-blur', `${cssBlur}px`)
}

setThemeProgress(initialThemeProgress)

// ------------------------------------------------------------------
// AnimateThemeProgress
// ------------------------------------------------------------------
export function animateThemeProgress(target: number): () => void {
  const start = themeProgress.value
  const end = Math.max(0, Math.min(target, 1))
  if (start === end) return () => {}

  let frame = 0
  let startTime: number | undefined
  const duration = 900

  function update(now: number) {
    startTime ??= now
    const time = Math.min((now - startTime) / duration, 1)
    const eased = time < 0.5
      ? 4 * time * time * time
      : 1 - Math.pow(-2 * time + 2, 3) / 2
    setThemeProgress(start + (end - start) * eased)

    if (time < 1) {
      frame = requestAnimationFrame(update)
    } else {
      setThemeProgress(end)
    }
  }

  frame = requestAnimationFrame(update)
  return () => cancelAnimationFrame(frame)
}
