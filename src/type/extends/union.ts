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

import { type TProperties } from '../types/properties.ts'
import { type TSchema, IsSchema } from '../types/schema.ts'
import { type TUnion, IsUnion } from '../types/union.ts'
import { type TExtendsLeft, ExtendsLeft } from './extends-left.ts'
import * as Result from './result.ts'

// ----------------------------------------------------------------------------
// Inference
// ----------------------------------------------------------------------------
import {
  type TInferable, IsInferable,
  type TTryInferable, TryInferable,
  type TInferUnionResult, InferUnionResult
} from './inference.ts'

// ----------------------------------------------------------------------------
// ExtendsUnionSome
// ----------------------------------------------------------------------------
type TExtendsUnionSome<Inferred extends TProperties, Type extends TSchema, UnionTypes extends TSchema[]> = (
  UnionTypes extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
  ? TExtendsLeft<Inferred, Type, Head> extends Result.TExtendsTrueLike<infer Inferred extends TProperties>
    ? Result.TExtendsTrue<Inferred>
    : TExtendsUnionSome<Inferred, Type, Tail>
  : Result.TExtendsFalse
)
function ExtendsUnionSome<Inferred extends TProperties, Type extends TSchema, UnionTypes extends TSchema[]>
  (inferred: Inferred, type: Type, unionTypes: [...UnionTypes]): 
    TExtendsUnionSome<Inferred, Type, UnionTypes> {
  const [head, ...tail] = unionTypes
  return (
    IsSchema(head) ? (() => {
      const check = ExtendsLeft(inferred, type, head)
      return Result.IsExtendsTrueLike(check)
        ? Result.ExtendsTrue(check.inferred)
        : ExtendsUnionSome(inferred, type, tail)
    })() : Result.ExtendsFalse()
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsUnionLeft
// ----------------------------------------------------------------------------
type TExtendsUnionLeft<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema[]> = (
  Left extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
  ? TExtendsUnionSome<Inferred, Head, Right> extends Result.TExtendsTrueLike<infer Inferred extends TProperties>
    ? TExtendsUnionLeft<Inferred, Tail, Right>
    : Result.TExtendsFalse
  : Result.TExtendsTrue<Inferred>
)
function ExtendsUnionLeft<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema[]>(inferred: Inferred, left: [...Left], right: [...Right]): TExtendsUnionLeft<Inferred, Left, Right> {
  const [head, ...tail] = left
  return (
    IsSchema(head) ? (() => {
      const check = ExtendsUnionSome(inferred, head, right)
      return Result.IsExtendsTrueLike(check)
        ? ExtendsUnionLeft(check.inferred, tail, right)
        : Result.ExtendsFalse()
    })() : Result.ExtendsTrue(inferred)
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsUnion
// ----------------------------------------------------------------------------
export type TExtendsUnion<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema,
  Inferrable extends TInferable | undefined = TTryInferable<Right>
> = (
  Inferrable extends TInferable<infer Name extends string, infer Type extends TSchema>
    ? TInferUnionResult<Inferred, Name, Left, Type>
    : Right extends TUnion<infer Types extends TSchema[]>
      ? TExtendsUnionLeft<Inferred, Left, Types>
      : TExtendsUnionLeft<Inferred, Left, [Right]>
)
export function ExtendsUnion<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema>(inferred: Inferred, left: [...Left], right: Right): TExtendsUnion<Inferred, Left, Right> {
  const inferrable = TryInferable(right)
  return (
    IsInferable(inferrable)
      // @ts-ignore 4.9.5 fails to see `type` property on inferrable
      ? InferUnionResult(inferred, inferrable.name, left, inferrable.type)
      : IsUnion(right)
        ? ExtendsUnionLeft(inferred, left, right.anyOf)
        : ExtendsUnionLeft(inferred, left, [right])
  ) as never
}
