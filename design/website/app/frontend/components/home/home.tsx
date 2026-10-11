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

import './home.css'
import * as React from 'react'
import * as ReactRouter from 'react-router-dom'
import { AnimatedSubHeading } from './heading.tsx'
import { TypeBoxLogo } from './logo.tsx'
import { DebugMode } from './debug.tsx'
import {
  applyThemeSettings,
  sharedSceneSettings,
  DEBUG_MODE_ENABLED,
  notifySceneGeometryChanged,
  resetThemeSettings,
  setSharedSceneSettings,
  setThemeProgress,
  themeSettings,
  themeProgress,
  type ThemeMode,
  type CubeSetKey,
  type CubeDistribution,
  type ThemeColorPath,
  type ThemeConfiguration,
  type ThemeProperties,
  type ThemeSettingPath,
} from '../../../mode.ts'

const messages = [
  'JSON Schema Type Builder with Static Type Resolution for TypeScript',
  'JSON Schema Type Builder with Static Type Resolution for TypeScript',
  'High Performance Validation for JSON Schema',
  'Runtime TypeScript Engine for JSON Schema',
]

// ------------------------------------------------------------------
// CopyIcon
// ------------------------------------------------------------------
function CopyIcon() {
  return (
    <svg aria-hidden='true' height='16' width='16' viewBox='0 0 16 16' version='1.1' data-view-component='true' className='octicon octicon-copy' fill='currentColor'>
      <path d='M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z'></path>
      <path d='M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z'></path>
    </svg>
  )
}
// ------------------------------------------------------------------
// CheckIcon
// ------------------------------------------------------------------
function CheckIcon() {
  return (
    <svg aria-hidden='true' height='16' width='16' viewBox='0 0 16 16' fill='currentColor'>
      <path d='M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z'></path>
    </svg>
  )
}
// ------------------------------------------------------------------
// InstallButton
// ------------------------------------------------------------------
function InstallButton() {
  const [copied, setCopied] = React.useState(false)
  const command = 'npm install typebox'
  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }
  return <div className='button-wrapper'>
    <div className='install'>
      <span>{'$ npm install typebox'}</span>
      <button
        onClick={copyCommand}
        className='copy-btn'
        aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  </div>
}
// ------------------------------------------------------------------
// DocumentationButton
// ------------------------------------------------------------------
function DocumentationButton() {
  return <div className='button-wrapper'><ReactRouter.Link to='/docs' className='documentation'>
    docs
  </ReactRouter.Link>
  </div>
}
// ------------------------------------------------------------------
// Home
// ------------------------------------------------------------------
export function Home({ mode }: { mode: 'light' | 'dark' }) {
  const [, setSettingsVersion] = React.useState(0)
  function updateMode(mode: ThemeMode, path: ThemeSettingPath, value: number) {
    const settings = themeSettings[mode]
    switch (path.group) {
      case 'appearance':
        settings.appearance[path.key] = value
        break
      case 'flash':
        settings.flash[path.key] = value
        break
      case 'camera':
        settings.camera[path.key] = value
        break
      case 'cameraPosition':
        settings.camera.position[path.key] = value
        break
      case 'cameraAim':
        settings.camera.aim[path.key] = value
        break
      case 'cubeSetA':
        settings.cubeSetA[path.key] = value
        notifySceneGeometryChanged()
        break
      case 'cubeSetAWaveEmitter': {
        const emitter = settings.cubeSetA.waveEmitters[path.index]
        if (!emitter) throw new RangeError(`Invalid CubeSetA wave emitter index: ${path.index}`)
        emitter[path.key] = value
        notifySceneGeometryChanged()
        break
      }
      case 'cubeSetB':
        settings.cubeSetB[path.key] = value
        notifySceneGeometryChanged()
        break
      case 'ground':
        settings.ground[path.key] = value
        notifySceneGeometryChanged()
        break
      case 'light':
        settings.light[path.key] = value
        break
      case 'lightPosition':
        settings.light.position[path.key] = value
        break
    }
    setThemeProgress(themeProgress.value)
    setSettingsVersion((version) => version + 1)
  }
  function updateModeColor(
    mode: ThemeMode,
    path: ThemeColorPath,
    value: string,
  ) {
    switch (path.group) {
      case 'appearance':
        themeSettings[mode].appearance.dropShadowColor = value
        break
      case 'flash':
        themeSettings[mode].flash.color = value
        break
      case 'cubeSetA':
        themeSettings[mode].cubeSetA.color = value
        break
      case 'cubeSetB':
        themeSettings[mode].cubeSetB.color = value
        break
      case 'ground':
        themeSettings[mode].ground.color = value
        break
      case 'light':
        themeSettings[mode].light[path.key] = value
        break
    }
    setThemeProgress(themeProgress.value)
    setSettingsVersion((version) => version + 1)
  }
  function updateDistribution(mode: ThemeMode, key: CubeSetKey, value: CubeDistribution) {
    themeSettings[mode][key].distribution = value
    notifySceneGeometryChanged()
    setSettingsVersion((version) => version + 1)
  }
  function updateCubeCount(key: CubeSetKey, value: number) {
    setSharedSceneSettings({
      ...sharedSceneSettings,
      cubeCounts: { ...sharedSceneSettings.cubeCounts, [key]: value },
    })
    setSettingsVersion((version) => version + 1)
  }
  // ------------------------------------------------------------------
  // UpdateCubeBevel
  // ------------------------------------------------------------------
  function updateCubeBevel(key: CubeSetKey, value: number) {
    setSharedSceneSettings({
      ...sharedSceneSettings,
      cubeBevels: { ...sharedSceneSettings.cubeBevels, [key]: value },
    })
    setSettingsVersion((version) => version + 1)
  }
  // ------------------------------------------------------------------
  // UpdateWaveTilt
  // ------------------------------------------------------------------
  function updateWaveTilt(mode: ThemeMode, value: boolean) {
    themeSettings[mode].cubeSetA.waveTilt = value
    notifySceneGeometryChanged()
    setSettingsVersion((version) => version + 1)
  }
  function updateFlashEnabled(mode: ThemeMode, value: boolean) {
    themeSettings[mode].flash.enabled = value
    setSettingsVersion((version) => version + 1)
  }
  function resetMode(mode: ThemeMode) {
    resetThemeSettings(mode)
    setThemeProgress(themeProgress.value)
    setSettingsVersion((version) => version + 1)
  }
  function importSettings(settings: ThemeConfiguration) {
    applyThemeSettings(settings)
    setThemeProgress(themeProgress.value)
    setSettingsVersion((version) => version + 1)
  }
  return (
    <div className='home'>
      <div className='home-card'>
        <div className='home-hero'>
          <TypeBoxLogo />
          <h1>TypeBox</h1>
          <AnimatedSubHeading
            intervalMs={5000}
            stepDelayMs={25}
            messages={messages}
          />
        </div>
        <div className='actions'>
          <InstallButton />
          <DocumentationButton />
        </div>
      </div>
      {DEBUG_MODE_ENABLED && (
        <DebugMode
          mode={mode}
          sharedSettings={sharedSceneSettings}
          onChange={updateMode}
          onColorChange={updateModeColor}
          onDistributionChange={updateDistribution}
          onWaveTiltChange={updateWaveTilt}
          onFlashEnabledChange={updateFlashEnabled}
          onCountChange={updateCubeCount}
          onBevelChange={updateCubeBevel}
          onReset={resetMode}
          onImport={importSettings}
        />
      )}
    </div>
  )
}