import React from 'react'
import * as Three from 'three'

// ------------------------------------------------------------------
// CreateRandomCubes
// ------------------------------------------------------------------
export type CubeData = {
  position: [number, number, number]
  scale: [number, number, number]
  rotation: [number, number, number]
}

export function CreateRandomCubes(
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
    const rx = Math.random() * Math.PI * 2
    const ry = Math.random() * Math.PI * 2
    const rz = Math.random() * Math.PI * 2
    cubes.push({
      position: [px, py, pz],
      scale: [s, s, s],
      rotation: [rx, ry, rz],
    })
  }

  return cubes
}
// ------------------------------------------------------------------
// Cubes
// ------------------------------------------------------------------
export interface CubesProperties {
  color: string
  count?: number
  bounds?: [number, number, number]
  minSize?: number
  maxSize?: number
}
export function Cubes(props: CubesProperties) {
  const count   = props.count   ?? 1024
  const bounds  = props.bounds  ?? [100, 100, 100]
  const minSize = props.minSize ?? 0.5
  const maxSize = props.maxSize ?? 2.0

  const instances = React.useRef<CubeData[]>(CreateRandomCubes(count, bounds, minSize, maxSize))
  const meshRef   = React.useRef<Three.InstancedMesh>(null!)
  const dummy     = new Three.Object3D()
  React.useEffect(() => {
    instances.current.forEach((cube, index) => {
      dummy.position.set(...cube.position)
      dummy.scale.set(...cube.scale)
    // dummy.rotation.set(...cube.rotation)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(index, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh castShadow={true} receiveShadow={true} ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={props.color} metalness={0.6} roughness={0.4} />
    </instancedMesh>
  )
}