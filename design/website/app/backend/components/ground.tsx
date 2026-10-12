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
import { themeProgress, themeSettings } from '../../mode.ts'

// ------------------------------------------------------------------
// CreateTiles
// ------------------------------------------------------------------
type TileData = {
  position: [number, number, number]
  scale: [number, number, number]
}
function CreateTiles(width: number, height: number): TileData[] {
  const scale = 8
  const hw = width / 2
  const hh = height / 2
  const tiles: TileData[] = []
  for (let x = 0; x < width; x++) {
    for (let z = 0; z < height; z++) {
      const px = (-hw + x) * scale
      const pz = (-hh + z) * scale
      const py = 0

      const s = 0.996
      const sx = scale * s
      const sz = scale * s
      const sy = 1
      tiles.push({
        position: [px, py, pz],
        scale: [sx, sy, sz],
      })
    }
  }
  return tiles
}
// ------------------------------------------------------------------
// Ground
// ------------------------------------------------------------------
interface GroundProperties {
  width: number
  height: number
  darkScale: number
  lightScale: number
  darkY: number
  lightY: number
}
export function Ground(props: GroundProperties) {
  const instances = React.useMemo(() => CreateTiles(props.width, props.height), [props.width, props.height])
  const meshRef = React.useRef<Three.InstancedMesh>(null)
  const materialRef = React.useRef<Three.MeshStandardMaterial>(null)
  const dummy = React.useMemo(() => new Three.Object3D(), [])
  const lastProgress = React.useRef<number | undefined>(undefined)
  const lastScale = React.useRef<number | undefined>(undefined)
  const lastY = React.useRef<number | undefined>(undefined)
  const initialDarkColor = themeSettings.dark.ground.color
  const initialLightColor = themeSettings.light.ground.color
  const colors = React.useMemo(() => ({
    dark: new Three.Color(initialDarkColor),
    light: new Three.Color(initialLightColor),
  }), [initialDarkColor, initialLightColor])
  const lastColors = React.useRef({ dark: initialDarkColor, light: initialLightColor })
  Fibre.useFrame(() => {
    const mesh = meshRef.current
    const progress = themeProgress.value
    const scale = Three.MathUtils.lerp(props.darkScale, props.lightScale, progress)
    const y = Three.MathUtils.lerp(props.darkY, props.lightY, progress)
    if (mesh && (lastProgress.current !== progress || lastScale.current !== scale || lastY.current !== y)) {
      instances.forEach((cube, index) => {
        dummy.position.set(cube.position[0] * scale, cube.position[1] + y - scale / 2, cube.position[2] * scale)
        dummy.scale.set(cube.scale[0] * scale, cube.scale[1], cube.scale[2] * scale)
        dummy.updateMatrix()
        mesh.setMatrixAt(index, dummy.matrix)
      })
      mesh.instanceMatrix.needsUpdate = true
      lastProgress.current = progress
      lastScale.current = scale
      lastY.current = y
    }
    const darkColor = themeSettings.dark.ground.color
    const lightColor = themeSettings.light.ground.color
    if (lastColors.current.dark !== darkColor) {
      colors.dark.set(darkColor)
      lastColors.current.dark = darkColor
    }
    if (lastColors.current.light !== lightColor) {
      colors.light.set(lightColor)
      lastColors.current.light = lightColor
    }
    if (materialRef.current) {
      materialRef.current.color.copy(colors.dark).lerp(colors.light, progress)
    }
  })
  const count = props.width * props.height
  return (
    <instancedMesh
      receiveShadow={true}
      castShadow={true}
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial ref={materialRef} color={initialDarkColor} metalness={0.6} roughness={0.4} />
    </instancedMesh>
  )
}
