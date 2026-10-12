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

import * as React from 'react'
import * as Fibre from '@react-three/fiber'
import * as Three from 'three'
import { themeProgress, themeSettings } from '../../mode.ts'

export function Light() {
  const lightRef = React.useRef<Three.DirectionalLight>(null)
  const ambientRef = React.useRef<Three.AmbientLight>(null)
  const { scene } = Fibre.useThree()
  const lightColors = React.useMemo(() => ({
    dark: new Three.Color(themeSettings.dark.light.color),
    light: new Three.Color(themeSettings.light.light.color),
  }), [])
  const ambientColors = React.useMemo(() => ({
    dark: new Three.Color(themeSettings.dark.light.ambientColor),
    light: new Three.Color(themeSettings.light.light.ambientColor),
  }), [])
  const fogColors = React.useMemo(() => ({
    dark: new Three.Color(themeSettings.dark.light.fogColor),
    light: new Three.Color(themeSettings.light.light.fogColor),
  }), [])
  const lastColors = React.useRef({
    dark: themeSettings.dark.light.color,
    light: themeSettings.light.light.color,
    darkAmbient: themeSettings.dark.light.ambientColor,
    lightAmbient: themeSettings.light.light.ambientColor,
    darkFog: themeSettings.dark.light.fogColor,
    lightFog: themeSettings.light.light.fogColor,
  })

  Fibre.useFrame(() => {
    const progress = themeProgress.value
    const darkLight = themeSettings.dark.light
    const lightLight = themeSettings.light.light
    if (lastColors.current.dark !== darkLight.color) {
      lightColors.dark.set(darkLight.color)
      lastColors.current.dark = darkLight.color
    }
    if (lastColors.current.light !== lightLight.color) {
      lightColors.light.set(lightLight.color)
      lastColors.current.light = lightLight.color
    }
    if (lastColors.current.darkAmbient !== darkLight.ambientColor) {
      ambientColors.dark.set(darkLight.ambientColor)
      lastColors.current.darkAmbient = darkLight.ambientColor
    }
    if (lastColors.current.lightAmbient !== lightLight.ambientColor) {
      ambientColors.light.set(lightLight.ambientColor)
      lastColors.current.lightAmbient = lightLight.ambientColor
    }
    if (lastColors.current.darkFog !== darkLight.fogColor) {
      fogColors.dark.set(darkLight.fogColor)
      lastColors.current.darkFog = darkLight.fogColor
    }
    if (lastColors.current.lightFog !== lightLight.fogColor) {
      fogColors.light.set(lightLight.fogColor)
      lastColors.current.lightFog = lightLight.fogColor
    }
    if (lightRef.current) {
      lightRef.current.intensity = Three.MathUtils.lerp(
        darkLight.directionalIntensity,
        lightLight.directionalIntensity,
        progress,
      )
      lightRef.current.color.copy(lightColors.dark).lerp(lightColors.light, progress)
      lightRef.current.position.set(
        Three.MathUtils.lerp(darkLight.position.x, lightLight.position.x, progress),
        Three.MathUtils.lerp(darkLight.position.y, lightLight.position.y, progress),
        Three.MathUtils.lerp(darkLight.position.z, lightLight.position.z, progress),
      )
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = Three.MathUtils.lerp(
        darkLight.ambientIntensity,
        lightLight.ambientIntensity,
        progress,
      )
      ambientRef.current.color.copy(ambientColors.dark).lerp(ambientColors.light, progress)
    }
    if (scene.fog instanceof Three.FogExp2) {
      scene.fog.color.copy(fogColors.dark).lerp(fogColors.light, progress)
      scene.fog.density = Three.MathUtils.lerp(darkLight.fogDensity, lightLight.fogDensity, progress)
    }
  })
  return (
    <>
      <ambientLight ref={ambientRef} intensity={0} color='#ffffff' />
      <directionalLight
        ref={lightRef}
        position={[0, 100, 0]}
        color={themeSettings.dark.light.color}
        intensity={themeSettings.dark.light.directionalIntensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.0005}
      />
    </>
  )
}