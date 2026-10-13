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

import { Settings } from '../settings/index.ts'
import { Metrics } from './metrics.ts'
import { Finalize } from './finalize.ts'

type ObjectLike = Record<PropertyKey, any>

// ------------------------------------------------------------------
// WithEnumerable
// ------------------------------------------------------------------
function WithEnumerable(left: ObjectLike, right: ObjectLike): ObjectLike {
  return { ...left, ...right }
}
// ------------------------------------------------------------------
// WithHidden
// ------------------------------------------------------------------
function WithHidden(left: ObjectLike, right: ObjectLike): ObjectLike {
  for (const key of Object.keys(right)) {
    Object.defineProperty(left, key, {
      configurable: true,
      writable: true,
      enumerable: false,
      value: right[key]
    })
  }
  return left
}
// ------------------------------------------------------------------
// Create
// ------------------------------------------------------------------
/** Creates an object with hidden, enumerable, and optional property sets. */
export function Create(hidden: ObjectLike, enumerable: ObjectLike, options: ObjectLike = {}): ObjectLike {
  Metrics.create += 1
  const withEnumerable = WithEnumerable(enumerable, options)
  const withHidden = Settings.Get().enumerableKind ? WithEnumerable(withEnumerable, hidden) : WithHidden(withEnumerable, hidden)
  return Finalize(withHidden)
}
