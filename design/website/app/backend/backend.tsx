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

import './backend.css'
import * as React from 'react'
import * as Fiber from '@react-three/fiber'
import {
  getSharedSceneVersion,
  sharedSceneSettings,
  subscribeSharedScene,
  themeSettings,
  themeProgress,
} from '../mode.ts'
import { Camera } from './components/camera.tsx'
import { Light } from './components/light.tsx'
import { Ground } from './components/ground.tsx'
import { Cubes } from './components/cubes.tsx'
import { Flash } from './components/flash.tsx'

type SceneReadyProperties = {
  onReady: () => void
}
function SceneReady({ onReady }: SceneReadyProperties) {
  const ready = React.useRef(false)
  Fiber.useFrame(() => {
    if (ready.current) return
    ready.current = true
    requestAnimationFrame(onReady)
  })
  return null
}
// ------------------------------------------------------------------
// Backend
// ------------------------------------------------------------------
export function Backend({ active }: { active: boolean }) {
  const [sceneReady, setSceneReady] = React.useState(false)
  React.useSyncExternalStore(subscribeSharedScene, getSharedSceneVersion, getSharedSceneVersion)
  return (
    <div className='backend'>
      <Fiber.Canvas shadows frameloop={active ? 'always' : 'never'}>
        <Camera />
        <fogExp2 attach="fog" args={[themeSettings.dark.light.fogColor, themeSettings.dark.light.fogDensity]} />
        <Flash mode='dark' minInterval={2} maxInterval={6} />
        <Flash mode='light' minInterval={2} maxInterval={6} />
        <Cubes cubeSet='cubeSetB' count={sharedSceneSettings.cubeCounts.cubeSetB} />
        <Cubes cubeSet='cubeSetA' count={sharedSceneSettings.cubeCounts.cubeSetA} />
        <Ground
          width={48}
          height={48}
          darkScale={themeSettings.dark.ground.scale}
          lightScale={themeSettings.light.ground.scale}
          darkY={themeSettings.dark.ground.y}
          lightY={themeSettings.light.ground.y}
        />
        <Light />
        <SceneReady onReady={() => setSceneReady(true)} />
      </Fiber.Canvas>
      <div
        aria-hidden='true'
        className={`backend-scene-intro${sceneReady ? ' backend-scene-intro-ready' : ''}`}
        style={{ backgroundColor: themeProgress.value === 1 ? '#ffffff' : '#000000' }}
      />
    </div>
  )
}
