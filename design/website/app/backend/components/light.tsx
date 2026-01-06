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
import * as Fibre from 'react-three/fiber'
import * as Three from 'three'

export interface LightProperties {
  color: string
}
const minimum = 20
const maximum = 40
export function Light({ color }: LightProperties) {
  const lightRef = React.useRef<Three.DirectionalLight>(null)
  const [isLightMode, setIsLightMode] = React.useState(
    document.body.classList.contains('light-mode')
  )

  // Track the start intensity and start time for smooth transition
  const startIntensityRef = React.useRef(2)
  const targetIntensityRef = React.useRef(isLightMode ? maximum : minimum)
  const startTimeRef = React.useRef(performance.now() / 1000)
  const duration = 0.5 // seconds

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      const lightMode = document.body.classList.contains('light-mode')
      setIsLightMode(lightMode)

      // Record new transition start
      startIntensityRef.current = lightRef.current?.intensity ?? minimum
      targetIntensityRef.current = lightMode ? maximum : minimum
      startTimeRef.current = performance.now() / 1000
    })

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  Fibre.useFrame(() => {
    if (!lightRef.current) return

    const now = performance.now() / 1000
    const elapsed = now - startTimeRef.current
    const t = Math.min(elapsed / duration, 1)
    // Linear interpolation
    lightRef.current.intensity = Three.MathUtils.lerp(
      startIntensityRef.current,
      targetIntensityRef.current,
      t
    )
  })
  return (
    <directionalLight
      ref={lightRef}
      position={[0, 1, 0]}
      color={color}
      intensity={isLightMode ? maximum : minimum}
    />
  )
}