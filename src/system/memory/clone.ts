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
// deno-fmt-ignore-file

import { Guard } from '../../guard/index.ts'
import { Metrics } from './metrics.ts'
import { Keys } from './keys.ts'

type ObjectLike = Record<PropertyKey, any>

// ------------------------------------------------------------------
// Clone
// ------------------------------------------------------------------
/** Returns a shallow clone of the given object. */
export function Clone<Value extends ObjectLike = ObjectLike>(value: Value): Value {
  Metrics.clone += 1
  const result = {} as ObjectLike
  for (const key of Keys(value)) {
    if (Guard.IsUnsafePropertyKey(key)) continue // (ignore: prototype-pollution)
    const descriptor = Object.getOwnPropertyDescriptor(value, key)! // safe-name!
    if (Guard.IsEqual(descriptor.enumerable, true)) {
      result[key] = descriptor.value
    } else {
      Object.defineProperty(result, key, descriptor)
    }
  }
  return result
}