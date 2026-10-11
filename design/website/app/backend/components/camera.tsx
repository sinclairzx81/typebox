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
import * as Fiber from '@react-three/fiber'
import * as Three from 'three'
import { themeProgress, themeSettings, type ThemeProperties } from '../../mode.ts'

// ------------------------------------------------------------------
// GetCameraTarget
// ------------------------------------------------------------------
function GetCameraTarget(
  position: Three.Vector3,
  aim: ThemeProperties['camera']['aim'],
  target: Three.Vector3,
): void {
  const yaw = aim.yaw / 180 * Math.PI
  const pitch = aim.pitch / 180 * Math.PI
  const horizontalDistance = Math.cos(pitch) * aim.distance
  target.set(
    position.x + Math.sin(yaw) * horizontalDistance,
    position.y + Math.sin(pitch) * aim.distance,
    position.z + Math.cos(yaw) * horizontalDistance,
  )
}

// ------------------------------------------------------------------
// Camera
// ------------------------------------------------------------------
export function Camera() {
  const { camera } = Fiber.useThree()
  const direction = React.useMemo(() => {
    const angle = 15 / 180 * Math.PI
    return new Three.Vector3(Math.cos(angle), 0, Math.sin(angle)).normalize()
  }, [])
  const darkPosition = React.useMemo(() => new Three.Vector3(
    themeSettings.dark.camera.position.x,
    themeSettings.dark.camera.height,
    themeSettings.dark.camera.position.z,
  ), [])
  const darkTarget = React.useMemo(() => new Three.Vector3(), [])
  const lightPosition = React.useMemo(() => new Three.Vector3(
    themeSettings.light.camera.position.x,
    themeSettings.light.camera.height,
    themeSettings.light.camera.position.z,
  ), [])
  const lightTarget = React.useMemo(() => new Three.Vector3(), [])
  const target = React.useMemo(() => new Three.Vector3(), [])
  const lastPosition = React.useRef({
    darkX: themeSettings.dark.camera.position.x,
    darkZ: themeSettings.dark.camera.position.z,
    lightX: themeSettings.light.camera.position.x,
    lightZ: themeSettings.light.camera.position.z,
  })
  Fiber.useFrame((_, delta) => {
    const progress = themeProgress.value
    const speed = Three.MathUtils.lerp(themeSettings.dark.camera.speed, themeSettings.light.camera.speed, progress)
    const darkCamera = themeSettings.dark.camera
    const lightCamera = themeSettings.light.camera
    if (lastPosition.current.darkX !== darkCamera.position.x || lastPosition.current.darkZ !== darkCamera.position.z) {
      darkPosition.set(darkCamera.position.x, darkCamera.height, darkCamera.position.z)
      lastPosition.current.darkX = darkCamera.position.x
      lastPosition.current.darkZ = darkCamera.position.z
    }
    if (lastPosition.current.lightX !== lightCamera.position.x || lastPosition.current.lightZ !== lightCamera.position.z) {
      lightPosition.set(lightCamera.position.x, lightCamera.height, lightCamera.position.z)
      lastPosition.current.lightX = lightCamera.position.x
      lastPosition.current.lightZ = lightCamera.position.z
    }
    const distance = Math.hypot(
      darkPosition.x - darkCamera.position.x,
      darkPosition.z - darkCamera.position.z,
    )
    if (distance >= 40) {
      darkPosition.set(darkCamera.position.x, darkCamera.height, darkCamera.position.z)
    }
    darkPosition.addScaledVector(direction, -0.25 * delta * speed)
    darkPosition.y = darkCamera.height

    lightPosition.x -= 0.25 * delta * speed
    lightPosition.y = lightCamera.height
    if (lightPosition.x < -40) lightPosition.x = 40
    GetCameraTarget(darkPosition, darkCamera.aim, darkTarget)
    GetCameraTarget(lightPosition, lightCamera.aim, lightTarget)
    camera.position.lerpVectors(darkPosition, lightPosition, progress)
    target.lerpVectors(darkTarget, lightTarget, progress)
    camera.lookAt(target)
  })
  return null
}