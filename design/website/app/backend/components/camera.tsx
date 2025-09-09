// deno-fmt-ignore-file

import React from 'react'
import * as Fiber from 'react-three/fiber'
import * as Three from 'three'

export function Camera() {
  const [direction, setDirection] = React.useState(() => randomDirection())
  const speed = 0.5
  const reset = 40
  const offset = 8
  const height = 16
  const { camera } = Fiber.useThree()

  function randomDirection() {
    const angle = 45 / 180 * 3.14
    const dx = Math.cos(angle)
    const dz = Math.sin(angle)
    const dy = 0
    return new Three.Vector3(dx, dy, dz).normalize()
  }
  function shouldReset(camera: Three.PerspectiveCamera) {
     const distance = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2)
     return distance >= reset
  }
  Fiber.useFrame((_, delta) => {
    if (shouldReset(camera)) {
      camera.position.set(0, height, 0)
      setDirection(randomDirection())
    }
    const tx = camera.position.x + (direction.x * offset)
    const tz = camera.position.z + (direction.z * offset)
    const ty = 0
    camera.lookAt(tx, ty, tz)
    camera.position.addScaledVector(direction, speed * delta)
    camera.position.y = height
  })
  return null
}