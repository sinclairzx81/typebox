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

import Type from 'typebox'

// ------------------------------------------------------------------
// KeysToUnionKeys
// ------------------------------------------------------------------
type TKeysToUnionKeys<Keys extends Type.TLiteralValue[], Result extends Type.TLiteral[] = []> = (
  Keys extends [infer Left extends Type.TLiteralValue, ...infer Right extends Type.TLiteralValue[]]
  ? TKeysToUnionKeys<Right, [...Result, Type.TLiteral<Left>]>
  : Type.TUnion<Result>
)
function KeysToUnionKeys<Keys extends Type.TLiteralValue[]>(keys: [...Keys]): TKeysToUnionKeys<Keys> {
  const result = keys.map(key => Type.Literal(key))
  return Type.Union(result) as never
}
// ------------------------------------------------------------------
// FromTypes
// ------------------------------------------------------------------
type TFromTypes<Types extends Type.TSchema[], UnionKeys extends Type.TSchema, Result extends Type.TSchema[] = []> = (
  Types extends [infer Left extends Type.TSchema, ...infer Right extends Type.TSchema[]]
  ? TFromTypes<Right, UnionKeys, [...Result, TFromType<Left, UnionKeys>]>
  : Result
)
function FromTypes<Types extends Type.TSchema[], UnionKeys extends Type.TSchema>(types: [...Types], unionKeys: UnionKeys): TFromTypes<Types, UnionKeys> {
  return types.reduce((result, left) => {
    return [...result, FromType(left, unionKeys)]
  }, [] as Type.TSchema[]) as never
}
// ------------------------------------------------------------------
// FromType
// ------------------------------------------------------------------
type TFromType<Type extends Type.TSchema, UnionKeys extends Type.TSchema> = (
  Type extends Type.TIntersect<infer Types extends Type.TSchema[]> ? Type.TIntersect<TFromTypes<Types, UnionKeys>> :
  Type extends Type.TUnion<infer Types extends Type.TSchema[]> ? Type.TUnion<TFromTypes<Types, UnionKeys>> :
  Type.TOmit<Type, UnionKeys>
)
function FromType<Type extends Type.TSchema, UnionKeys extends Type.TSchema>(type: Type, keys: UnionKeys): TFromType<Type, UnionKeys> {
  return (
    Type.IsIntersect(type) ? Type.Intersect(FromTypes(type.allOf, keys)) :
      Type.IsUnion(type) ? Type.Union(FromTypes(type.anyOf, keys)) :
        Type.Omit(type, keys)
  ) as never
}
// ------------------------------------------------------------------
// Omit
// ------------------------------------------------------------------
/** Legacy Fallback for 0.34.x Omit Traversal */
export type TOmit<Type extends Type.TSchema, PropertyKeys extends Type.TLiteralValue[],
  UnionKeys extends Type.TSchema = TKeysToUnionKeys<PropertyKeys>,
  Result extends Type.TSchema = TFromType<Type, UnionKeys>
> = Result
/** Legacy Fallback for 0.34.x Omit Traversal */
export function Omit<Type extends Type.TSchema, Keys extends Type.TLiteralValue[]>(type: Type, keys: [...Keys]): TOmit<Type, Keys> {
  const unionKeys = KeysToUnionKeys(keys)
  const result = FromType(type, unionKeys)
  return result as never
}