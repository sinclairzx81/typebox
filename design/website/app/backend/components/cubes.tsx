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

import React from 'react'
import * as Fibre from '@react-three/fiber'
import * as Three from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { sharedSceneSettings, themeProgress, themeSettings, type CubeSetKey, type ThemeProperties } from '../../mode.ts'

// ------------------------------------------------------------------
// CreateRandomCubes
// ------------------------------------------------------------------
type CubeData = {
  position: [number, number, number]
  scale: [number, number, number]
}
const groundPlaneTop = -9.5
function CreateRandomCubes(
  count: number,
  bounds: [number, number, number],
  minSize: number,
  maxSize: number,
): CubeData[] {
  const [bx, by, bz] = bounds
  const hx = bx / 2
  const hy = by / 2
  const hz = bz / 2
  const cubes: CubeData[] = []

  for (let i = 0; i < count; i++) {
    const px = (Math.random() * 2 - 1) * hx
    const py = (Math.random() * 2 - 1) * hy
    const pz = (Math.random() * 2 - 1) * hz

    const s = minSize + Math.random() * (maxSize - minSize)
    cubes.push({
      position: [px, py, pz],
      scale: [s, s, s],
    })
  }

  return cubes
}
// ------------------------------------------------------------------
// CreateFloatingCubes
// ------------------------------------------------------------------
function CreateFloatingCubes(
  count: number,
  bounds: [number, number],
  heights: [number, number],
  sizes: [number, number],
  offset: [number, number],
  distribution: 'random' | 'grid',
): CubeData[] {
  const [minimum, maximum] = heights
  const [minSize, maxSize] = sizes
  const minimumDistance = Math.SQRT2 * maxSize
  const minimumDistanceSquared = minimumDistance * minimumDistance
  const positions: Array<[number, number]> = []
  const cubes: CubeData[] = []
  const rows = Math.ceil(Math.sqrt(count))
  const columns = Math.ceil(count / rows)
  for (let index = 0; index < count; index++) {
    let x = 0
    let z = 0
    if (distribution === 'grid') {
      const row = Math.floor(index / columns)
      const column = index % columns
      x = offset[0] - bounds[0] / 2 + (column + 0.5) * bounds[0] / columns
      z = offset[1] - bounds[1] / 2 + (row + 0.5) * bounds[1] / rows
    } else {
      for (let attempt = 0; attempt < 128; attempt++) {
        x = offset[0] + (Math.random() - 0.5) * (bounds[0] - maxSize)
        z = offset[1] + (Math.random() - 0.5) * (bounds[1] - maxSize)
        if (positions.every(([px, pz]) => (x - px) ** 2 + (z - pz) ** 2 >= minimumDistanceSquared)) break
      }
    }
    positions.push([x, z])

    const size = minSize + Math.random() * (maxSize - minSize)
    cubes.push({
      position: [
        x,
        minimum + Math.random() * (maximum - minimum),
        z,
      ],
      scale: [size, size, size],
    })
  }
  return cubes
}
// ------------------------------------------------------------------
// CreateGridCubes
// ------------------------------------------------------------------
function CreateGridCubes(
  count: number,
  bounds: [number, number, number],
  maxSize: number,
  height: number,
  lift: number,
): CubeData[] {
  if (count === 0) return []

  const rows = Math.ceil(Math.sqrt(count))
  const columns = Math.floor(count / rows)
  const extraColumns = count % rows
  const spacingZ = bounds[2] / rows
  const sizeZ = Math.min(maxSize, spacingZ)
  const cubes: CubeData[] = []

  for (let row = 0; row < rows; row++) {
    const rowColumns = columns + (row < extraColumns ? 1 : 0)
    const spacingX = bounds[0] / rowColumns
    const sizeX = Math.min(maxSize, spacingX)
    for (let column = 0; column < rowColumns; column++) {
      cubes.push({
        position: [
          -bounds[0] / 2 + (column + 0.5) * spacingX,
          groundPlaneTop + lift + height / 2,
          -bounds[2] / 2 + (row + 0.5) * spacingZ,
        ],
        scale: [sizeX, height, sizeZ],
      })
    }
  }

  return cubes
}
function CreateCubeSetInstances(
  count: number,
  cubeSet: CubeSetKey,
  settings: ThemeProperties[CubeSetKey],
): CubeData[] {
  if (cubeSet === 'cubeSetA') {
    return settings.distribution === 'grid'
      ? CreateGridCubes(count, [settings.range, 0, settings.range], 18, settings.height, 0.45)
      : CreateRandomCubes(count, [settings.range, 0, settings.range], 4, 8)
  }
  return CreateFloatingCubes(
    count,
    [settings.range, settings.range],
    [0, 1],
    [2, 4],
    [0, 0],
    settings.distribution,
  )
}

// ------------------------------------------------------------------
// GetCubeSetY
// ------------------------------------------------------------------
function GetCubeSetY(
  cube: CubeData,
  cubeSet: CubeSetKey,
  settings: ThemeProperties[CubeSetKey],
): number {
  if (cubeSet === 'cubeSetA') {
    return settings.distribution === 'grid'
      ? cube.position[1] + cube.scale[1] * (settings.scale - 1) / 2
      : cube.position[1]
  }
  if (!('elevation' in settings)) throw new TypeError('CubeSetB settings require an elevation')
  const cubeHeight = cube.scale[0] * settings.scale / 2
  return groundPlaneTop + cubeHeight
    + cube.position[1] * Math.max(0, settings.height - cubeHeight)
    + settings.elevation
}

// ------------------------------------------------------------------
// GetCubeSetAWave
// ------------------------------------------------------------------
function GetCubeSetAWave(
  x: number,
  z: number,
  elapsedTime: number,
  settings: ThemeProperties['cubeSetA'],
  normal?: Three.Vector3,
): number {
  if (settings.distribution !== 'grid' || settings.waveAmplitude === 0 || settings.waveEmitterCount === 0) {
    normal?.set(0, 1, 0)
    return 0
  }
  const activeEmitterCount = Math.min(settings.waveEmitterCount, settings.waveEmitters.length)
  if (activeEmitterCount === 0) {
    normal?.set(0, 1, 0)
    return 0
  }
  const halfRange = settings.range / 2
  const attenuationDistance = Math.max(1, settings.range * 0.35)
  let height = 0
  let gradientX = 0
  let gradientZ = 0
  for (let index = 0; index < activeEmitterCount; index++) {
    const emitter = settings.waveEmitters[index]
    if (!emitter) continue
    const dx = x - emitter.x * halfRange
    const dz = z - emitter.z * halfRange
    const distance = Math.hypot(dx, dz)
    const attenuation = 1 + distance / attenuationDistance
    const phase = emitter.frequency * (distance - elapsedTime * settings.waveSpeed)
    const sinPhase = Math.sin(phase)
    height += sinPhase * emitter.amplitude / attenuation
    if (normal && distance > 0) {
      const gradient = emitter.amplitude * (
        emitter.frequency * Math.cos(phase) / attenuation
        - sinPhase / (attenuationDistance * attenuation * attenuation)
      )
      gradientX += gradient * dx / distance
      gradientZ += gradient * dz / distance
    }
  }
  const amplitude = settings.waveAmplitude / activeEmitterCount
  if (normal) normal.set(-gradientX * amplitude, 1, -gradientZ * amplitude)
  return height * amplitude
}

// ------------------------------------------------------------------
// Cubes
// ------------------------------------------------------------------
interface CubesProperties {
  cubeSet: CubeSetKey
  count: number
}
export function Cubes(props: CubesProperties) {
  const darkSettings = themeSettings.dark[props.cubeSet]
  const lightSettings = themeSettings.light[props.cubeSet]
  const darkGridHeight = props.cubeSet === 'cubeSetA' ? darkSettings.height : undefined
  const lightGridHeight = props.cubeSet === 'cubeSetA' ? lightSettings.height : undefined
  const darkInstances = React.useMemo(
    () => CreateCubeSetInstances(props.count, props.cubeSet, darkSettings),
    [props.count, props.cubeSet, darkSettings.range, darkSettings.distribution, darkGridHeight],
  )
  const lightInstances = React.useMemo(
    () => CreateCubeSetInstances(props.count, props.cubeSet, lightSettings),
    [props.count, props.cubeSet, lightSettings.range, lightSettings.distribution, lightGridHeight],
  )
  const meshRef   = React.useRef<Three.InstancedMesh>(null)
  const materialRef = React.useRef<Three.MeshPhysicalMaterial>(null)
  const lastMesh = React.useRef<Three.InstancedMesh | null>(null)
  const lastDarkInstances = React.useRef<CubeData[] | null>(null)
  const lastLightInstances = React.useRef<CubeData[] | null>(null)
  const lastProgress = React.useRef<number | undefined>(undefined)
  const lastWaveAmplitude = React.useRef<number | undefined>(undefined)
  const lastWaveTilt = React.useRef<number | undefined>(undefined)
  const lastHeight = React.useRef<number | undefined>(undefined)
  const lastElevation = React.useRef<number | undefined>(undefined)
  const initialDarkColor = themeSettings.dark[props.cubeSet].color
  const initialLightColor = themeSettings.light[props.cubeSet].color
  const colors = React.useMemo(() => ({
    dark: new Three.Color(initialDarkColor),
    light: new Three.Color(initialLightColor),
  }), [props.cubeSet])
  const lastColors = React.useRef({ dark: initialDarkColor, light: initialLightColor })
  const dummy = React.useMemo(() => new Three.Object3D(), [])
  const up = React.useMemo(() => new Three.Vector3(0, 1, 0), [])
  const darkNormal = React.useMemo(() => new Three.Vector3(), [])
  const lightNormal = React.useMemo(() => new Three.Vector3(), [])
  const waveNormal = React.useMemo(() => new Three.Vector3(), [])
  const bevel = sharedSceneSettings.cubeBevels[props.cubeSet]
  const geometry = React.useMemo(
    () => new RoundedBoxGeometry(1, 1, 1, 2, bevel),
    [props.cubeSet, bevel],
  )
  React.useEffect(() => () => geometry.dispose(), [geometry])
  const lastCubeScale = React.useRef<number | undefined>(undefined)
  Fibre.useFrame(({ clock }) => {
    const progress = themeProgress.value
    const currentDarkSettings = themeSettings.dark[props.cubeSet]
    const currentLightSettings = themeSettings.light[props.cubeSet]
    const darkWaveEnabled = props.cubeSet === 'cubeSetA'
      && currentDarkSettings.distribution === 'grid'
      && themeSettings.dark.cubeSetA.waveAmplitude > 0
      && themeSettings.dark.cubeSetA.waveEmitterCount > 0
    const lightWaveEnabled = props.cubeSet === 'cubeSetA'
      && currentLightSettings.distribution === 'grid'
      && themeSettings.light.cubeSetA.waveAmplitude > 0
      && themeSettings.light.cubeSetA.waveEmitterCount > 0
    const darkWaveAmplitude = darkWaveEnabled ? themeSettings.dark.cubeSetA.waveAmplitude : 0
    const lightWaveAmplitude = lightWaveEnabled ? themeSettings.light.cubeSetA.waveAmplitude : 0
    const currentWaveAmplitude = Three.MathUtils.lerp(darkWaveAmplitude, lightWaveAmplitude, progress)
    const darkWaveTilt = darkWaveEnabled && themeSettings.dark.cubeSetA.waveTilt
    const lightWaveTilt = lightWaveEnabled && themeSettings.light.cubeSetA.waveTilt
    const currentWaveTilt = Three.MathUtils.lerp(darkWaveTilt ? 1 : 0, lightWaveTilt ? 1 : 0, progress)
    const currentHeight = props.cubeSet === 'cubeSetB'
      ? Three.MathUtils.lerp(currentDarkSettings.height, currentLightSettings.height, progress)
      : undefined
    const currentElevation = props.cubeSet === 'cubeSetB'
      ? Three.MathUtils.lerp(
        themeSettings.dark.cubeSetB.elevation,
        themeSettings.light.cubeSetB.elevation,
        progress,
      )
      : undefined
    const cubeScale = Three.MathUtils.lerp(currentDarkSettings.scale, currentLightSettings.scale, progress)
    const metalness = Three.MathUtils.lerp(currentDarkSettings.metalness, currentLightSettings.metalness, progress)
    const shininess = Three.MathUtils.lerp(currentDarkSettings.shininess, currentLightSettings.shininess, progress)
    const specularIntensity = Three.MathUtils.lerp(
      currentDarkSettings.specularIntensity,
      currentLightSettings.specularIntensity,
      progress,
    )
    if (lastColors.current.dark !== currentDarkSettings.color) {
      colors.dark.set(currentDarkSettings.color)
      lastColors.current.dark = currentDarkSettings.color
    }
    if (lastColors.current.light !== currentLightSettings.color) {
      colors.light.set(currentLightSettings.color)
      lastColors.current.light = currentLightSettings.color
    }
    const mesh = meshRef.current
    if (mesh && (
      mesh !== lastMesh.current ||
      darkInstances !== lastDarkInstances.current ||
      lightInstances !== lastLightInstances.current ||
      lastProgress.current !== progress ||
      currentWaveAmplitude > 0 ||
      lastWaveAmplitude.current !== currentWaveAmplitude ||
      lastWaveTilt.current !== currentWaveTilt ||
      lastCubeScale.current !== cubeScale ||
      lastHeight.current !== currentHeight ||
      lastElevation.current !== currentElevation
    )) {
      for (let index = 0; index < darkInstances.length; index++) {
        const cube = darkInstances[index]
        const lightCube = lightInstances[index]
        const darkWave = darkWaveEnabled
          ? GetCubeSetAWave(
            cube.position[0],
            cube.position[2],
            clock.elapsedTime,
            themeSettings.dark.cubeSetA,
            darkWaveTilt && currentWaveTilt > 0 ? darkNormal : undefined,
          )
          : 0
        const lightWave = lightWaveEnabled
          ? GetCubeSetAWave(
            lightCube.position[0],
            lightCube.position[2],
            clock.elapsedTime,
            themeSettings.light.cubeSetA,
            lightWaveTilt && currentWaveTilt > 0 ? lightNormal : undefined,
          )
          : 0
        const wave = Three.MathUtils.lerp(darkWave, lightWave, progress)
        if (props.cubeSet === 'cubeSetA' && currentWaveTilt > 0) {
          if (!darkWaveTilt) darkNormal.copy(up)
          if (!lightWaveTilt) lightNormal.copy(up)
          waveNormal.lerpVectors(darkNormal, lightNormal, progress).normalize()
          dummy.quaternion.setFromUnitVectors(up, waveNormal)
        } else {
          dummy.quaternion.identity()
        }
        dummy.position.set(
          Three.MathUtils.lerp(cube.position[0], lightCube.position[0], progress),
          Three.MathUtils.lerp(
            GetCubeSetY(cube, props.cubeSet, currentDarkSettings),
            GetCubeSetY(lightCube, props.cubeSet, currentLightSettings),
            progress,
          ) + wave,
          Three.MathUtils.lerp(cube.position[2], lightCube.position[2], progress),
        )
        if (props.cubeSet === 'cubeSetB') {
          const cubeSize = Three.MathUtils.lerp(cube.scale[0], lightCube.scale[0], progress) * cubeScale
          dummy.scale.setScalar(cubeSize)
        } else {
          dummy.scale.set(
            Three.MathUtils.lerp(cube.scale[0], lightCube.scale[0], progress) * cubeScale,
            Three.MathUtils.lerp(cube.scale[1], lightCube.scale[1], progress) * cubeScale,
            Three.MathUtils.lerp(cube.scale[2], lightCube.scale[2], progress) * cubeScale,
          )
        }
        dummy.updateMatrix()
        mesh.setMatrixAt(index, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
      lastMesh.current = mesh
      lastDarkInstances.current = darkInstances
      lastLightInstances.current = lightInstances
      lastProgress.current = progress
      lastWaveAmplitude.current = currentWaveAmplitude
      lastWaveTilt.current = currentWaveTilt
      lastCubeScale.current = cubeScale
      lastHeight.current = currentHeight
      lastElevation.current = currentElevation
    }
    if (materialRef.current) {
      materialRef.current.color.copy(colors.dark).lerp(colors.light, progress)
      materialRef.current.metalness = metalness
      materialRef.current.roughness = 1 - shininess / 100
      materialRef.current.specularIntensity = specularIntensity
    }
  })

  return (
    <instancedMesh
      castShadow={true}
      receiveShadow={true}
      ref={meshRef}
      args={[geometry, undefined, props.count]}
      frustumCulled={false}
    >
      <meshPhysicalMaterial
        ref={materialRef}
        color={initialDarkColor}
        metalness={themeSettings.dark[props.cubeSet].metalness}
        roughness={1 - themeSettings.dark[props.cubeSet].shininess / 100}
        specularIntensity={themeSettings.dark[props.cubeSet].specularIntensity}
      />
    </instancedMesh>
  )
}