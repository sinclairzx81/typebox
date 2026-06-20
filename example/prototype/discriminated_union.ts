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

import Type from 'typebox'

// ------------------------------------------------------------------
// DiscriminatedVariant
// ------------------------------------------------------------------
type TDiscriminatedVariant<Name extends string, Type extends Type.TSchema, Index extends number,
  Discriminated extends Type.TSchema = Type.TObject<{ [_ in Name]: Type.TLiteral<Index> }>,
  Intersected extends Type.TSchema = Type.TIntersect<[Discriminated, Type]>,
  Evaluated extends Type.TSchema = Type.TEvaluate<Intersected>
> = Evaluated
function DiscriminatedVariant<Name extends string, Type extends Type.TSchema, Index extends number>
  (name: Name, type: Type, index: Index): TDiscriminatedVariant<Name, Type, Index> {
  const discriminated = Type.Object({ [name]: Type.Literal(index) })
  const intersected = Type.Intersect([discriminated, type])
  const evaluated = Type.Evaluate(intersected)
  return evaluated as never
}
// ------------------------------------------------------------------
// DiscriminatedUnion
// ------------------------------------------------------------------
/** Creates a DiscriminatedUnion where each variant contains a unique auto-incremented field */
export type TDiscriminatedUnion<Name extends string, Types extends Type.TSchema[], Result extends Type.TSchema[] = []> = (
  Types extends [infer Left extends Type.TSchema, ...infer Right extends Type.TSchema[]]
  ? TDiscriminatedUnion<Name, Right, [...Result, TDiscriminatedVariant<Name, Left, Result['length']>]>
  : Type.TUnion<Result>
)
/** Creates a DiscriminatedUnion where each variant contains a unique auto-incremented field */
export function DiscriminatedUnion<Name extends string, Types extends Type.TSchema[]>
  (name: Name, types: [...Types]): TDiscriminatedUnion<Name, Types> {
  return Type.Union(types.map((left, index) => DiscriminatedVariant(name, left, index))) as never
}


