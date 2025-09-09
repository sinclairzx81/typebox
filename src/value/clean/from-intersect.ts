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

// deno-fmt-ignore-file

import { type TProperties, type TSchema, type TIntersect, Evaluate, IsObject, Options } from '../../type/index.ts'
import { Guard } from '../../guard/index.ts'
import { FromType } from './from-type.ts'

// ------------------------------------------------------------------
// EvaluateIntersection
// ------------------------------------------------------------------
function EvaluateIntersection(type: TIntersect): TSchema {
  // Note: reinterpret unevaluatedProperties as additionalProperties
  const additionalProperties = 
    Guard.HasPropertyKey(type, 'unevaluatedProperties')
      ? { additionalProperties: type.unevaluatedProperties }
      : {}
  const evaluated = Evaluate(type)
  return IsObject(evaluated)
    ? Options(evaluated, additionalProperties)
    : evaluated
}
// ------------------------------------------------------------------
// FromIntersection
// ------------------------------------------------------------------
export function FromIntersect(context: TProperties, type: TIntersect, value: unknown): unknown {
  // Note: Evaluate and route back to FromType in evaluated form (likely an Object)
  const evaluated = EvaluateIntersection(type)
  return FromType(context, evaluated, value)
}

