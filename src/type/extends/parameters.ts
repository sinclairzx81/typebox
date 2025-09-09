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

import { type TInfer, IsInfer } from '../types/infer.ts'
import { type TSchema, IsSchema } from '../types/schema.ts'
import { type TOptional, IsOptional } from '../types/_optional.ts'
import { type TProperties } from '../types/properties.ts'
import { type TExtendsLeft, ExtendsLeft } from './extends-left.ts'
import * as Result from './result.ts'

// ------------------------------------------------------------------
// ParameterCompare
// ------------------------------------------------------------------  
type TParameterCompare<Inferred extends TProperties, Left extends TSchema, LeftRest extends TSchema[], Right extends TSchema, RightRest extends TSchema[],
  // Parameter extends Right on Left, except when infer Right  
  CheckLeft extends TSchema = Right extends TInfer ? Left : Right,
  CheckRight extends TSchema = Right extends TInfer ? Right : Left,
  IsLeftOptional extends boolean = Left extends TOptional ? true : false,
  IsRightOptional extends boolean = Right extends TOptional ? true : false,
> = (
    [IsLeftOptional, IsRightOptional] extends [false, true]
      ? Result.TExtendsFalse // 'fail: left-required-but-right-is-optional'
      : TExtendsLeft<Inferred, CheckLeft, CheckRight> extends Result.TExtendsTrueLike<infer Inferred extends TProperties>
        ? TExtendsParameters<Inferred, LeftRest, RightRest>
        : Result.TExtendsFalse // 'fail: left-and-right-did-not-match'
  )
function ParameterCompare<Inferred extends TProperties, Left extends TSchema, LeftRest extends TSchema[], Right extends TSchema, RightRest extends TSchema[]>
  (inferred: Inferred, left: Left, leftRest: LeftRest, right: Right, rightRest: RightRest): 
    TParameterCompare<Inferred, Left, LeftRest, Right, RightRest> {
  // Parameter extends Right on Left, except when infer Right  
  const checkLeft = IsInfer(right) ? left : right
  const checkRight = IsInfer(right) ? right : left
  const isLeftOptional = IsOptional(left)
  const isRightOptional = IsOptional(right)
  const check = ExtendsLeft(inferred, checkLeft, checkRight)
  return (
    !isLeftOptional && isRightOptional
      ? Result.ExtendsFalse()
      : Result.IsExtendsTrueLike(check)
        ? ExtendsParameters(check.inferred, leftRest, rightRest)
        : Result.ExtendsFalse()
  ) as never
}
// ------------------------------------------------------------------
// ParameterRight
// ------------------------------------------------------------------ 
type TParameterRight<Inferred extends TProperties, Left extends TSchema, LeftRest extends TSchema[], RightRest extends TSchema[]> = (
  RightRest extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
  ? TParameterCompare<Inferred, Left, LeftRest, Head, Tail>
  : Left extends TOptional              // 'right-did-not-have-enough-elements'
    ? Result.TExtendsTrue<Inferred>     // 'ok: left was optional'
    : Result.TExtendsFalse              // 'fail: left was required'
)
function ParameterRight<Inferred extends TProperties, Left extends TSchema, LeftRest extends TSchema[], RightRest extends TSchema[]>
  (inferred: Inferred, left: Left, leftRest: LeftRest, rightRest: RightRest): 
    TParameterRight<Inferred, Left, LeftRest, RightRest> {
  const [head, ...tail] = rightRest
  return (
    IsSchema(head)
      ? ParameterCompare(inferred, left, leftRest, head, tail)
      : IsOptional(left)                 // 'right-did-not-have-enough-elements'
        ? Result.ExtendsTrue(inferred)   // 'ok: left was optional'
        : Result.ExtendsFalse()          // 'fail: left was required'
  ) as never
}
// ------------------------------------------------------------------
// ParameterLeft
// ------------------------------------------------------------------ 
type TParameterLeft<Inferred extends TProperties, LeftRest extends TSchema[], RightRest extends TSchema[]> = (
  LeftRest extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
  ? TParameterRight<Inferred, Head, Tail, RightRest>
  : Result.TExtendsTrue<Inferred> // 'ok: no-more-elements-in-left'
)
function ParametersLeft<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema[]>
  (inferred: Inferred, left: Left, rightRest: Right): 
    TParameterLeft<Inferred, Left, Right> {
  const [head, ...tail] = left
  return (
    IsSchema(head)
      ? ParameterRight(inferred, head, tail, rightRest)
      : Result.ExtendsTrue(inferred)
  ) as never
}
// ------------------------------------------------------------------
// ExtendsParameters
// ------------------------------------------------------------------ 
export type TExtendsParameters<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema[]> =
  TParameterLeft<Inferred, Left, Right>

export function ExtendsParameters<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema[]>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsParameters<Inferred, Left, Right> {
  return ParametersLeft(inferred, left, right)
}

