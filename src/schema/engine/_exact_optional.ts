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

import { Settings } from '../../system/settings/index.ts'
import { EmitGuard as E, Guard as G } from '../../guard/index.ts'

// ------------------------------------------------------------------
// IsExactOptional
// ------------------------------------------------------------------
export function IsExactOptional(required: string[], key: string): boolean {
  return required.includes(key) || Settings.Get().exactOptionalPropertyTypes
}
// ------------------------------------------------------------------
// ExactOptionalBuild
// ------------------------------------------------------------------
export function InexactOptionalBuild(value: string, key: string): string {
  const hasProperty = E.HasPropertyKey(value, E.Constant(key))
  const isUndefined = E.IsUndefined(E.Member(value, key))
  return E.And(hasProperty, isUndefined)
}
// ------------------------------------------------------------------
// ExactOptionalCheck
// ------------------------------------------------------------------
export function InexactOptionalCheck(value: Record<PropertyKey, unknown>, key: string): boolean {
  return G.HasPropertyKey(value, key) && G.IsUndefined(value[key])
}
