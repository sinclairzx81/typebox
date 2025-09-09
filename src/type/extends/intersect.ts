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

import { type TProperties } from '../types/properties.ts'
import { type TSchema } from '../types/schema.ts'
import { type TExtendsLeft, ExtendsLeft } from './extends-left.ts'

// ----------------------------------------------------------------------------
// ExtendsIntersect
//
// This function evaluates the intersection and continues. This is different
// to IntersectRight which MUST enumerate each type to derive Inferred. Left 
// side types do not infer so it should be ok to do this.
//
// ----------------------------------------------------------------------------
import { type TEvaluateIntersect, EvaluateIntersect } from '../engine/evaluate/index.ts'

export type TExtendsIntersect<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema,
  Evaluated extends TSchema = TEvaluateIntersect<Left>
> = TExtendsLeft<Inferred, Evaluated, Right>
export function ExtendsIntersect<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsIntersect<Inferred, Left, Right> {
  const evaluated = EvaluateIntersect(left)
  return ExtendsLeft(inferred, evaluated, right) as never
}
