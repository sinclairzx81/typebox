// deno-fmt-ignore-file

import React from 'react'
import * as Fiber from 'react-three/fiber'
import * as Three from 'three'

export function Camera() {
  const [direction, setDirection] = React.useState(() => randomDirection())
  const speed = -0.25
  const reset = 40
  const offset = 10
  const height = 17
  const { camera } = Fiber.useThree()
  
  function randomDirection() {
    // 45 degrees
    const angle = (15 / 180 * Math.PI)
    const dx = Math.cos(angle)
    const dz = Math.sin(angle)
    const dy = 0
    return new Three.Vector3(dx, dy, dz).normalize()
  }
  function shouldReset(cam: Three.PerspectiveCamera) {
     const distance = Math.sqrt(cam.position.x ** 2 + cam.position.z ** 2)
     return distance >= reset
  }
  Fiber.useFrame((_, delta) => {
    if (shouldReset(camera as Three.PerspectiveCamera)) {
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