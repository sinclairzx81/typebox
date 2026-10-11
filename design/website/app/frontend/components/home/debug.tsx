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
import {
  cameraAimLimits,
  cubeBevelLimits,
  cubeSetRangeLimits,
  cubeSetATileHeightLimits,
  cubeSetAWaveAmplitudeLimits,
  cubeSetAWaveEmitterAmplitudeLimits,
  cubeSetAWaveEmitterCountLimits,
  cubeSetAWaveEmitterFrequencyLimits,
  cubeSetAWaveSpeedLimits,
  cubeSetBElevationLimits,
  cubeSetCountLimits,
  cubeSetMaterialLimits,
  cubeSetScaleLimits,
  cssBlurLimits,
  flashIntensityLimits,
  groundScaleLimits,
  groundYLimits,
  normalizeThemeSettings,
  themeSettings,
  type CubeSetKey,
  type CubeSetAWaveEmitter,
  type CubeDistribution,
  type SharedSceneSettings,
  type ThemeColorPath,
  type ThemeMode,
  type ThemeConfiguration,
  type ThemeProperties,
  type ThemeSettingPath,
} from '../../../mode.ts'

type SettingControl = {
  path: ThemeSettingPath
  label: string
  section: string
  min: number
  max: number
  step: number
  precision: number
}

const controls: SettingControl[] = [
  { path: { group: 'appearance', key: 'logoShadowStrength' }, label: 'Logo shadow strength', section: 'Appearance', min: 0, max: 100, step: 0.01, precision: 2 },
  { path: { group: 'appearance', key: 'logoShadowBlur' }, label: 'Logo shadow blur', section: 'Appearance', min: 0, max: 20, step: 0.01, precision: 2 },
  { path: { group: 'appearance', key: 'textShadowStrength' }, label: 'Text shadow strength', section: 'Appearance', min: 0, max: 100, step: 0.01, precision: 2 },
  { path: { group: 'appearance', key: 'textShadowBlur' }, label: 'Text shadow blur', section: 'Appearance', min: 0, max: 20, step: 0.01, precision: 2 },
  { path: { group: 'appearance', key: 'cssBlur' }, label: 'CSS scene blur', section: 'Appearance', min: cssBlurLimits.min, max: cssBlurLimits.max, step: 0.01, precision: 2 },
  { path: { group: 'flash', key: 'intensity' }, label: 'Peak intensity', section: 'Flash', min: flashIntensityLimits.min, max: flashIntensityLimits.max, step: 0.01, precision: 2 },
  { path: { group: 'camera', key: 'height' }, label: 'Position Y', section: 'Camera', min: -10, max: 100, step: 0.01, precision: 2 },
  { path: { group: 'camera', key: 'speed' }, label: 'Movement speed', section: 'Camera', min: 0, max: 4, step: 0.01, precision: 2 },
  { path: { group: 'cameraPosition', key: 'x' }, label: 'Position X', section: 'Camera', min: -100, max: 100, step: 0.01, precision: 2 },
  { path: { group: 'cameraPosition', key: 'z' }, label: 'Position Z', section: 'Camera', min: -100, max: 100, step: 0.01, precision: 2 },
  { path: { group: 'cameraAim', key: 'yaw' }, label: 'Look yaw (°)', section: 'Camera', min: cameraAimLimits.yaw.min, max: cameraAimLimits.yaw.max, step: 0.01, precision: 2 },
  { path: { group: 'cameraAim', key: 'pitch' }, label: 'Look pitch (°)', section: 'Camera', min: cameraAimLimits.pitch.min, max: cameraAimLimits.pitch.max, step: 0.01, precision: 2 },
  { path: { group: 'cameraAim', key: 'distance' }, label: 'Look distance', section: 'Camera', min: cameraAimLimits.distance.min, max: cameraAimLimits.distance.max, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetA', key: 'range' }, label: 'Range', section: 'CubeSetA', min: cubeSetRangeLimits.min, max: cubeSetRangeLimits.max, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetA', key: 'scale' }, label: 'Scale', section: 'CubeSetA', min: cubeSetScaleLimits.min, max: cubeSetScaleLimits.max, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetA', key: 'metalness' }, label: 'Metalness', section: 'CubeSetA', min: cubeSetMaterialLimits.metalness.min, max: cubeSetMaterialLimits.metalness.max, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetA', key: 'shininess' }, label: 'Shininess', section: 'CubeSetA', min: cubeSetMaterialLimits.shininess.min, max: cubeSetMaterialLimits.shininess.max, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetA', key: 'specularIntensity' }, label: 'Specular intensity', section: 'CubeSetA', min: cubeSetMaterialLimits.specularIntensity.min, max: cubeSetMaterialLimits.specularIntensity.max, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetA', key: 'height' }, label: 'Tile thickness', section: 'CubeSetA', min: cubeSetATileHeightLimits.min, max: cubeSetATileHeightLimits.max, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetA', key: 'waveAmplitude' }, label: 'Overall wave amplitude', section: 'CubeSetA', min: cubeSetAWaveAmplitudeLimits.min, max: cubeSetAWaveAmplitudeLimits.max, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetA', key: 'waveSpeed' }, label: 'Wave speed', section: 'CubeSetA', min: cubeSetAWaveSpeedLimits.min, max: cubeSetAWaveSpeedLimits.max, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetA', key: 'waveEmitterCount' }, label: 'Emitter count', section: 'CubeSetA', min: cubeSetAWaveEmitterCountLimits.min, max: cubeSetAWaveEmitterCountLimits.max, step: 1, precision: 0 },
  { path: { group: 'cubeSetB', key: 'range' }, label: 'Range', section: 'CubeSetB', min: cubeSetRangeLimits.min, max: cubeSetRangeLimits.max, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetB', key: 'scale' }, label: 'Scale', section: 'CubeSetB', min: cubeSetScaleLimits.min, max: cubeSetScaleLimits.max, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetB', key: 'metalness' }, label: 'Metalness', section: 'CubeSetB', min: cubeSetMaterialLimits.metalness.min, max: cubeSetMaterialLimits.metalness.max, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetB', key: 'shininess' }, label: 'Shininess', section: 'CubeSetB', min: cubeSetMaterialLimits.shininess.min, max: cubeSetMaterialLimits.shininess.max, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetB', key: 'specularIntensity' }, label: 'Specular intensity', section: 'CubeSetB', min: cubeSetMaterialLimits.specularIntensity.min, max: cubeSetMaterialLimits.specularIntensity.max, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetB', key: 'height' }, label: 'Height above ground', section: 'CubeSetB', min: 0, max: 24, step: 0.01, precision: 2 },
  { path: { group: 'cubeSetB', key: 'elevation' }, label: 'Vertical offset', section: 'CubeSetB', min: cubeSetBElevationLimits.min, max: cubeSetBElevationLimits.max, step: 0.01, precision: 2 },
  { path: { group: 'ground', key: 'scale' }, label: 'Footprint scale', section: 'Ground', min: groundScaleLimits.min, max: groundScaleLimits.max, step: 0.01, precision: 2 },
  { path: { group: 'ground', key: 'y' }, label: 'Surface Y position', section: 'Ground', min: groundYLimits.min, max: groundYLimits.max, step: 0.01, precision: 2 },
  { path: { group: 'light', key: 'fogDensity' }, label: 'Fog density', section: 'Light', min: 0, max: 0.05, step: 0.01, precision: 3 },
  { path: { group: 'light', key: 'directionalIntensity' }, label: 'Directional intensity', section: 'Light', min: 0, max: 20, step: 0.01, precision: 2 },
  { path: { group: 'light', key: 'ambientIntensity' }, label: 'Ambient intensity', section: 'Light', min: 0, max: 2, step: 0.01, precision: 2 },
  { path: { group: 'lightPosition', key: 'x' }, label: 'Position X', section: 'Light', min: -500, max: 500, step: 0.01, precision: 2 },
  { path: { group: 'lightPosition', key: 'y' }, label: 'Position Y', section: 'Light', min: -500, max: 500, step: 0.01, precision: 2 },
  { path: { group: 'lightPosition', key: 'z' }, label: 'Position Z', section: 'Light', min: -500, max: 500, step: 0.01, precision: 2 },
]

const waveEmitterControls: {
  key: keyof CubeSetAWaveEmitter
  label: string
  min: number
  max: number
  step: number
  precision: number
}[] = [
  { key: 'x', label: 'Position X', min: -1, max: 1, step: 0.01, precision: 2 },
  { key: 'z', label: 'Position Z', min: -1, max: 1, step: 0.01, precision: 2 },
  { key: 'frequency', label: 'Frequency', min: cubeSetAWaveEmitterFrequencyLimits.min, max: cubeSetAWaveEmitterFrequencyLimits.max, step: 0.01, precision: 3 },
  { key: 'amplitude', label: 'Amplitude', min: cubeSetAWaveEmitterAmplitudeLimits.min, max: cubeSetAWaveEmitterAmplitudeLimits.max, step: 0.01, precision: 2 },
]

const colorControls: { path: ThemeColorPath; label: string; section: string }[] = [
  { path: { group: 'appearance', key: 'dropShadowColor' }, label: 'Drop shadow color', section: 'Appearance' },
  { path: { group: 'flash', key: 'color' }, label: 'Color', section: 'Flash' },
  { path: { group: 'cubeSetA', key: 'color' }, label: 'Color', section: 'CubeSetA' },
  { path: { group: 'cubeSetB', key: 'color' }, label: 'Color', section: 'CubeSetB' },
  { path: { group: 'ground', key: 'color' }, label: 'Color', section: 'Ground' },
  { path: { group: 'light', key: 'color' }, label: 'Directional color', section: 'Light' },
  { path: { group: 'light', key: 'ambientColor' }, label: 'Ambient color', section: 'Light' },
  { path: { group: 'light', key: 'fogColor' }, label: 'Fog color', section: 'Light' },
]
const countControls: { key: CubeSetKey; label: string }[] = [
  { key: 'cubeSetA', label: 'CubeSetA cubes' },
  { key: 'cubeSetB', label: 'CubeSetB cubes' },
]
const bevelControls: { key: CubeSetKey; label: string }[] = [
  { key: 'cubeSetA', label: 'CubeSetA bevel' },
  { key: 'cubeSetB', label: 'CubeSetB bevel' },
]

const sections = ['Appearance', 'Camera', 'CubeSetA', 'CubeSetB', 'Ground', 'Light', 'Flash']

function getValue(settings: ThemeProperties, path: ThemeSettingPath): number {
  switch (path.group) {
    case 'appearance': return settings.appearance[path.key]
    case 'flash': return settings.flash[path.key]
    case 'camera': return settings.camera[path.key]
    case 'cameraPosition': return settings.camera.position[path.key]
    case 'cameraAim': return settings.camera.aim[path.key]
    case 'cubeSetA': return settings.cubeSetA[path.key]
    case 'cubeSetAWaveEmitter': return settings.cubeSetA.waveEmitters[path.index][path.key]
    case 'cubeSetB': return settings.cubeSetB[path.key]
    case 'ground': return settings.ground[path.key]
    case 'light': return settings.light[path.key]
    case 'lightPosition': return settings.light.position[path.key]
  }
}

function getColor(settings: ThemeProperties, path: ThemeColorPath): string {
  switch (path.group) {
    case 'appearance': return settings.appearance.dropShadowColor
    case 'flash': return settings.flash.color
    case 'cubeSetA': return settings.cubeSetA.color
    case 'cubeSetB': return settings.cubeSetB.color
    case 'ground': return settings.ground.color
    case 'light': return settings.light[path.key]
  }
}

function isCubeDistribution(value: string): value is CubeDistribution {
  return value === 'random' || value === 'grid'
}

interface DebugModeProperties {
  mode: ThemeMode
  onChange: (mode: ThemeMode, path: ThemeSettingPath, value: number) => void
  onColorChange: (mode: ThemeMode, path: ThemeColorPath, value: string) => void
  onDistributionChange: (mode: ThemeMode, key: CubeSetKey, value: CubeDistribution) => void
  onWaveTiltChange: (mode: ThemeMode, value: boolean) => void
  onFlashEnabledChange: (mode: ThemeMode, value: boolean) => void
  onCountChange: (key: CubeSetKey, value: number) => void
  onBevelChange: (key: CubeSetKey, value: number) => void
  onReset: (mode: ThemeMode) => void
  onImport: (settings: ThemeConfiguration) => void
}

// ------------------------------------------------------------------
// DebugMode
// ------------------------------------------------------------------
export function DebugMode({
  mode,
  sharedSettings,
  onChange,
  onColorChange,
  onDistributionChange,
  onWaveTiltChange,
  onFlashEnabledChange,
  onCountChange,
  onBevelChange,
  onReset,
  onImport,
}: DebugModeProperties & { sharedSettings: SharedSceneSettings }) {
  const [json, setJson] = React.useState('')
  const [feedback, setFeedback] = React.useState('')
  const settings = themeSettings[mode]

  async function copySettings() {
    const contents = JSON.stringify({ ...themeSettings, ...sharedSettings }, null, 2)
    setJson(contents)
    try {
      await navigator.clipboard.writeText(contents)
      setFeedback('Both theme configurations copied.')
    } catch (error) {
      setFeedback(error instanceof Error ? `Could not copy settings: ${error.message}` : 'Could not copy settings.')
    }
  }

  function importSettings() {
    let parsed: unknown
    try {
      parsed = JSON.parse(json)
    } catch (error) {
      setFeedback(error instanceof Error ? `Invalid JSON: ${error.message}` : 'Invalid JSON.')
      return
    }
    const settings = normalizeThemeSettings(parsed)
    if (!settings) {
      setFeedback('Invalid settings. Include valid dark and light theme configurations.')
      return
    }
    onImport(settings)
    setFeedback('Both theme configurations imported.')
  }

  return (
    <aside className='theme-debug' aria-label='Theme debug controls'>
      <div className='theme-debug-heading'>
        <div>
          <h2>Debug mode</h2>
          <p>Editing the active theme</p>
        </div>
      </div>
      <div className='theme-debug-mode'>{mode === 'light' ? 'Light mode' : 'Dark mode'}</div>
      <div className='theme-debug-content' aria-label={`${mode} mode settings`}>
        <details className='theme-debug-section' open>
          <summary>Shared</summary>
          <p className='theme-debug-hint'>Cube counts and bevels apply to both themes.</p>
          {countControls.map((control) => {
            const { min, max } = cubeSetCountLimits[control.key]
            return (
              <label className='theme-debug-range' key={control.key}>
                <span>{control.label}</span>
                <output>{sharedSettings.cubeCounts[control.key]}</output>
                <input
                  type='range'
                  min={min}
                  max={max}
                  step={1}
                  value={sharedSettings.cubeCounts[control.key]}
                  onChange={(event) => onCountChange(control.key, Number(event.currentTarget.value))}
                />
              </label>
            )
          })}
          {bevelControls.map((control) => (
            <label className='theme-debug-range' key={`bevel.${control.key}`}>
              <span>{control.label}</span>
              <output>{sharedSettings.cubeBevels[control.key].toFixed(2)}</output>
              <input
                type='range'
                min={cubeBevelLimits.min}
                max={cubeBevelLimits.max}
                step={0.01}
                value={sharedSettings.cubeBevels[control.key]}
                onChange={(event) => onBevelChange(control.key, Number(event.currentTarget.value))}
              />
            </label>
          ))}
        </details>
        {sections.map((section) => (
          <details className='theme-debug-section' key={section} open={section === 'CubeSetA' || section === 'Light' || section === 'Flash'}>
            <summary>{section}</summary>
            {controls.filter((control) => control.section === section
              && !(control.path.group === 'cubeSetA'
                && (control.path.key === 'height'
                  || control.path.key === 'waveAmplitude'
                  || control.path.key === 'waveSpeed'
                  || control.path.key === 'waveEmitterCount')
                && settings.cubeSetA.distribution !== 'grid')).map((control) => {
              const value = getValue(settings, control.path)
              return (
                <label className='theme-debug-range' key={`${control.path.group}.${control.path.key}`}>
                  <span>{control.label}</span>
                  <output>{value.toFixed(control.precision)}</output>
                  <input
                    type='range'
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={value}
                    onChange={(event) => onChange(mode, control.path, Number(event.currentTarget.value))}
                  />
                </label>
              )
            })}
            {section === 'CubeSetA' && (
              <label className='theme-debug-distribution'>
                <span>Distribution</span>
                <select
                  value={settings.cubeSetA.distribution}
                  onChange={(event) => {
                    const value = event.currentTarget.value
                    if (isCubeDistribution(value)) onDistributionChange(mode, 'cubeSetA', value)
                  }}
                >
                  <option value='random'>Random</option>
                  <option value='grid'>Grid</option>
                </select>
              </label>
            )}
            {section === 'CubeSetA' && settings.cubeSetA.distribution === 'grid' && (
              <label className='theme-debug-wave-toggle'>
                <span>Tilt tiles to wave normals</span>
                <input
                  type='checkbox'
                  checked={settings.cubeSetA.waveTilt}
                  onChange={(event) => onWaveTiltChange(mode, event.currentTarget.checked)}
                />
              </label>
            )}
            {section === 'Flash' && (
              <label className='theme-debug-wave-toggle'>
                <span>Enable flash</span>
                <input
                  type='checkbox'
                  checked={settings.flash.enabled}
                  onChange={(event) => onFlashEnabledChange(mode, event.currentTarget.checked)}
                />
              </label>
            )}
            {section === 'CubeSetA' && settings.cubeSetA.distribution === 'grid' && (
              <div className='theme-debug-emitters'>
                <h3>Wave emitters</h3>
                {settings.cubeSetA.waveEmitters
                  .slice(0, settings.cubeSetA.waveEmitterCount)
                  .map((emitter, index) => (
                    <details className='theme-debug-emitter' key={index}>
                      <summary>Emitter {index + 1}</summary>
                      {waveEmitterControls.map((control) => {
                        const value = emitter[control.key]
                        const output = control.key === 'x' || control.key === 'z'
                          ? value * settings.cubeSetA.range / 2
                          : value
                        return (
                          <label className='theme-debug-range' key={control.key}>
                            <span>{control.label}</span>
                            <output>{output.toFixed(control.precision)}</output>
                            <input
                              type='range'
                              min={control.min}
                              max={control.max}
                              step={control.step}
                              value={value}
                              onChange={(event) => onChange(mode, {
                                group: 'cubeSetAWaveEmitter',
                                index,
                                key: control.key,
                              }, Number(event.currentTarget.value))}
                            />
                          </label>
                        )
                      })}
                    </details>
                  ))}
                {settings.cubeSetA.waveEmitterCount === 0 && (
                  <p className='theme-debug-hint'>No active emitters.</p>
                )}
              </div>
            )}
            {section === 'CubeSetB' && (
              <label className='theme-debug-distribution'>
                <span>Distribution</span>
                <select
                  value={settings.cubeSetB.distribution}
                  onChange={(event) => {
                    const value = event.currentTarget.value
                    if (isCubeDistribution(value)) onDistributionChange(mode, 'cubeSetB', value)
                  }}
                >
                  <option value='random'>Random</option>
                  <option value='grid'>Grid</option>
                </select>
              </label>
            )}
            {colorControls.filter((control) => control.section === section).map((control) => (
              <label className='theme-debug-color' key={`${control.path.group}.${control.path.key}`}>
                <span>{control.label}</span>
                <input
                  type='color'
                  value={getColor(settings, control.path)}
                  onChange={(event) => onColorChange(mode, control.path, event.currentTarget.value)}
                />
                <output>{getColor(settings, control.path)}</output>
              </label>
            ))}
          </details>
        ))}
        <div className='theme-debug-actions'>
          <button
            aria-label={`Reset ${mode} mode settings to defaults`}
            className='theme-debug-reset'
            type='button'
            onClick={() => onReset(mode)}
          >
            Reset theme
          </button>
          <button className='theme-debug-copy' type='button' onClick={copySettings}>Copy settings</button>
        </div>
        <label className='theme-debug-json'>
          <span>Theme configuration JSON</span>
          <textarea
            value={json}
            onChange={(event) => setJson(event.currentTarget.value)}
            rows={6}
            spellCheck={false}
            aria-label='Theme configuration JSON'
          />
        </label>
        <button className='theme-debug-import' type='button' onClick={importSettings}>Import both themes</button>
        <p className='theme-debug-feedback' role='status' aria-live='polite'>{feedback}</p>
      </div>
    </aside>
  )
}
