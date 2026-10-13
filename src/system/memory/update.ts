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

// deno-lint-ignore-file no-explicit-any

import { Guard } from '../../guard/index.ts'
import { Settings } from '../settings/index.ts'
import { Metrics } from './metrics.ts'
import { Finalize } from './finalize.ts'
import { Keys } from './keys.ts'

type ObjectLike = Record<PropertyKey, any>

// ------------------------------------------------------------------
// WithCurrent
// ------------------------------------------------------------------
function WithCurrent(current: ObjectLike, hiddenKeys: PropertyKey[], enumerableKeys: PropertyKey[], result: ObjectLike): void {
  for (const key of Keys(current)) {
    if (Guard.IsUnsafePropertyKey(key) || hiddenKeys.includes(key) || enumerableKeys.includes(key)) continue // (ignore: prototype-pollution)
    const descriptor = Object.getOwnPropertyDescriptor(current, key)! // safe-name!
    Object.defineProperty(result, key, descriptor)
  }
}
// ------------------------------------------------------------------
// WithHidden
// ------------------------------------------------------------------
function WithHidden(hidden: ObjectLike, keys: PropertyKey[], result: ObjectLike): void {
  const enumerableKind = Settings.Get().enumerableKind
  for (const key of keys) {
    if (Guard.IsUnsafePropertyKey(key)) continue // (ignore: prototype-pollution)
    Object.defineProperty(result, key, {
      configurable: true,
      writable: true,
      enumerable: enumerableKind,
      value: hidden[key]
    })
  }
}
// ------------------------------------------------------------------
// WithEnumerable
// ------------------------------------------------------------------
function WithEnumerable(enumerable: ObjectLike, keys: PropertyKey[], result: ObjectLike): void {
  for (const key of keys) {
    if (Guard.IsUnsafePropertyKey(key)) continue // (ignore: prototype-pollution)
    Object.defineProperty(result, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: enumerable[key]
    })
  }
}
// ------------------------------------------------------------------
// Update
// ------------------------------------------------------------------
/** Updates an existing type with additional hidden and enumerable properties while preserving property configuration. */
export function Update(current: ObjectLike, hidden: ObjectLike, enumerable: ObjectLike): ObjectLike {
  Metrics.update += 1
  const result = {}, hiddenKeys = Keys(hidden), enumerableKeys = Keys(enumerable)
  WithCurrent(current, hiddenKeys, enumerableKeys, result)
  WithHidden(hidden, hiddenKeys, result)
  WithEnumerable(enumerable, enumerableKeys, result)
  return Finalize(result)
}
