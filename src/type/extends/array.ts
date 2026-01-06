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

import { type TSchema } from '../types/schema.ts'
import { type TProperties } from '../types/properties.ts'
import { type TArray, IsArray } from '../types/array.ts'
import { type TImmutable, IsImmutable } from '../types/_immutable.ts'
import { type TExtendsRight, ExtendsRight } from './extends-right.ts'
import { type TExtendsLeft, ExtendsLeft } from './extends-left.ts'
import * as Result from './result.ts'

// ------------------------------------------------------------------
// ExtendsImmutable
// ------------------------------------------------------------------
type TExtendsImmutable<Left extends TSchema, Right extends TSchema,
  IsImmutableLeft extends boolean = Left extends TImmutable ? true : false,
  IsImmutableRight extends boolean = Right extends TImmutable ? true : false,
  Result extends boolean  =
    [IsImmutableLeft, IsImmutableRight] extends [true, true] ? true :
    [IsImmutableLeft, IsImmutableRight] extends [false, true] ? true :
    [IsImmutableLeft, IsImmutableRight] extends [true, false] ? false :
    true
> = Result
function ExtendsImmutable<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TExtendsImmutable<Left, Right> {
  const isImmutableLeft = IsImmutable(left)
  const isImmutableRight = IsImmutable(right)
  return (
    isImmutableLeft && isImmutableRight ? true :
    !isImmutableLeft && isImmutableRight ? true :
    isImmutableLeft && !isImmutableRight ? false :
    true
  ) as never
}
// ------------------------------------------------------------------
// ExtendsArray
// ------------------------------------------------------------------
export type TExtendsArray<Inferred extends TProperties, ArrayLeft extends TSchema, Left extends TSchema, Right extends TSchema> = (
  Right extends TArray<infer Type extends TSchema>
    ? TExtendsImmutable<ArrayLeft, Right> extends true
      ? TExtendsLeft<Inferred, Left, Type>
      : Result.TExtendsFalse
    : TExtendsRight<Inferred, ArrayLeft, Right>
)
export function ExtendsArray<Inferred extends TProperties, ArrayLeft extends TSchema, Left extends TSchema, Right extends TSchema>
  (inferred: Inferred, arrayLeft: ArrayLeft, left: Left, right: Right): 
    TExtendsArray<Inferred, ArrayLeft, Left, Right> {
  return (
    IsArray(right)
      ? ExtendsImmutable(arrayLeft, right)
        ? ExtendsLeft(inferred, left, right.items)
        : Result.ExtendsFalse()
      : ExtendsRight(inferred, arrayLeft, right)
  ) as never
}

