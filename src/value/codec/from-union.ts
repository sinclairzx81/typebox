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

import { Unreachable } from '../../system/unreachable/index.ts'
import { Guard } from '../../guard/index.ts'
import { type TProperties, type TUnion } from '../../type/index.ts'
import { Callback } from './callback.ts'
import { FromType } from './from-type.ts'
import { Clone } from '../clone/index.ts'
import { Check } from '../check/index.ts'

// ------------------------------------------------------------------
// Decode
// ------------------------------------------------------------------
// deno-coverage-ignore-start - unreachable | checked
function Decode(direction: string, context: TProperties, type: TUnion, value: unknown): unknown {
  for (const schema of type.anyOf) {
    if(!Check(context, schema, value)) continue
    const variant = FromType(direction, context, schema, value)
    return Callback(direction, context, type, variant)
  }
  return Unreachable()
}
// deno-coverage-ignore-stop

// ------------------------------------------------------------------
// Encode
// ------------------------------------------------------------------
function Encode(direction: string, context: TProperties, type: TUnion, value: unknown): unknown {
  let exterior = Callback(direction, context, type, value)
  for (const schema of type.anyOf) {
    const variant = FromType(direction, context, schema, Clone(exterior))
    if(!Check(context, schema, variant)) continue
    return variant
  }
  return exterior
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
export function FromUnion(direction: string, context: TProperties, type: TUnion, value: unknown): unknown {
  return Guard.IsEqual(direction, 'Decode')
    ? Decode(direction, context, type, value)
    : Encode(direction, context, type, value)
}
