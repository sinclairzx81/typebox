/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson

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
import * as Three from 'three'

// ------------------------------------------------------------------
// CreateTiles
// ------------------------------------------------------------------
export type TileData = {
  position: [number, number, number]
  scale: [number, number, number]
}
export function CreateTiles(width: number, height: number): TileData[] {
  let scale = 8
  const hw = width / 2
  const hh = width / 2
  const tiles: TileData[] = []
  for(let x = 0; x < width; x++) {
    for(let z = 0; z < height; z++) {
      const px = (-hw + x) * scale
      const pz = (-hh + z) * scale
      const py = -10

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
// Boxes
// ------------------------------------------------------------------
export interface GroundProperties {
  color: string
  width: number
  height: number
}
export function Ground(props: GroundProperties) {
  const instances = React.useRef<TileData[]>(CreateTiles(props.width, props.height))
  const meshRef = React.useRef<Three.InstancedMesh>(null!)
  const dummy = new Three.Object3D()
  React.useEffect(() => {
    instances.current.forEach((cube, index) => {
      dummy.position.set(...cube.position)
      dummy.scale.set(...cube.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(index, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [])
  const count = props.width * props.height
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={props.color} metalness={0.6} roughness={0.4} />
    </instancedMesh>
  )
}
