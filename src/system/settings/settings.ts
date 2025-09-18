/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson

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

import { Guard } from '../../guard/index.ts'

// ------------------------------------------------------------------
// Settings
// ------------------------------------------------------------------

export interface TSettings {
  /**
   * Determines whether types should be instantiated as immutable using `Object.freeze(...)`.
   * This helps prevent unintended schema mutation. Enabling this option introduces a slight
   * performance overhead during instantiation.
   * @default false
   */
  immutableTypes: boolean

  /**
   * Specifies the maximum number of errors to buffer during diagnostics collection. TypeBox
   * performs exhaustive checks to gather diagnostics for invalid values, which can result in
   * excessive buffering for large or complex types. This setting limits the number of buffered
   * errors and acts as a safeguard against potential denial-of-service (DoS) attacks.
   * @default 8
   */
  maxErrors: number

  /**
   * Enables or disables the use of runtime code evaluation to accelerate validation. By default,
   * TypeBox checks for `unsafe-eval` support in the environment before attempting to evaluate
   * generated code. If evaluation is not permitted, it falls back to dynamic checking. Setting
   * this to `false` disables evaluation entirely, which may be desirable in applications that
   * restrict runtime code evaluation, regardless of Content Security Policy (CSP).
   * @default true
   */
  useEval: boolean

  /**
   * Enables or disables 'exactOptionalPropertyTypes' check semantics. By default, TypeScript
   * allows optional properties to be assigned 'undefined'. While this behavior differs from the
   * common interpretation of 'optional' as meaning 'key may be absent', TypeBox adopts the default
   * TypeScript semantics to remain consistent with the language. This option is provided to align
   * runtime check semantics with projects that configure 'exactOptionalPropertyTypes: true' in
   * tsconfig.json.
   * @default false
   */
  exactOptionalPropertyTypes: boolean

  /**
   * Controls whether internal compositor properties (`~kind`, `~readonly`, `~optional`) are enumerable.
   * @default false
   */
  enumerableKind: boolean
}

// Internal mutable state
const settings: TSettings = {
  immutableTypes: false,
  maxErrors: 8,
  useEval: true,
  exactOptionalPropertyTypes: false,
  enumerableKind: false
}

/** Resets system settings to defaults */
export function Reset(): void {
  settings.immutableTypes = false
  settings.maxErrors = 8
  settings.useEval = true
  settings.exactOptionalPropertyTypes = false
  settings.enumerableKind = false
}

/** Sets system settings */
export function Set(options: Partial<TSettings>): void {
  for (const key of Guard.Keys(options)) {
    const value = options[key as keyof TSettings]
    if (value !== undefined) {
      Object.defineProperty(settings, key, { value })
    }
  }
}

/** Gets current system settings */
export function Get(): Readonly<TSettings> {
  return settings
}
