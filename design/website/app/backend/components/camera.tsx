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