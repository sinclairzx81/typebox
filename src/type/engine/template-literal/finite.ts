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

import { Guard } from '../../../guard/index.ts'
import { type TSchema, IsSchema } from '../../types/schema.ts'
import { type TLiteral, type TLiteralValue, IsLiteral } from '../../types/literal.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'

// ------------------------------------------------------------------
// FromLiteral
// ------------------------------------------------------------------
type TFromLiteral<_Value extends TLiteralValue> = true
function FromLiteral<Value extends TLiteralValue>(value: Value): TFromLiteral<Value> {
  return true
}
// ------------------------------------------------------------------
// FromTypes
// ------------------------------------------------------------------
type TFromTypesReduce<Types extends TSchema[]> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TFromType<Left> extends true
      ? TFromTypesReduce<Right>
      : false
    : true
)
function FromTypesReduce<Types extends TSchema[]>(types: [...Types]): TFromTypesReduce<Types> {
  const [left, ...right] = types
  return (
    IsSchema(left)
      ? FromType(left)
        ? FromTypesReduce(right)
        : false
      : true
  ) as never
}
type TFromTypes<Types extends TSchema[],
  Result extends boolean = Types extends [] ? false : TFromTypesReduce<Types>
> = Result
function FromTypes<Types extends TSchema[]>(types: [...Types]): TFromTypes<Types> {
  const result = Guard.IsEqual(types.length, 0) ? false : FromTypesReduce(types)
  return result as never
}
// ------------------------------------------------------------------
// FromType
// ------------------------------------------------------------------
type TFromType<Type extends TSchema> =
  Type extends TUnion<infer Types extends TSchema[]> ? TFromTypes<Types> :
  Type extends TLiteral<infer Value extends TLiteralValue> ? TFromLiteral<Value> : 
  false
function FromType<Type extends TSchema>(type: Type): TFromType<Type> {
  return (
    IsUnion(type) ? FromTypes(type.anyOf) :
    IsLiteral(type) ? FromLiteral(type.const) :
    false
  ) as never
}
// ------------------------------------------------------------------
// TemplateLiteralFinite
// ------------------------------------------------------------------
/** Returns true if the given TemplateLiteral types yields a finite variant set */
export type TTemplateLiteralFinite<Types extends TSchema[],
  Result extends boolean = TFromTypes<Types>
> = Result
/** Returns true if the given TemplateLiteral types yields a finite variant set */
export function TemplateLiteralFinite<Types extends TSchema[]>(types: [...Types]): TTemplateLiteralFinite<Types> {
  const result = FromTypes(types)
  return result as never
}
