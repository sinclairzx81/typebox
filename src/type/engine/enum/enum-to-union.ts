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

import { type TSchema } from '../../types/schema.ts'
import { type TEnum, type TEnumValue } from '../../types/enum.ts'
import { type TUnion, Union } from '../../types/union.ts'
import { type TLiteral, Literal } from '../../types/literal.ts'
import { type TNull, Null } from '../../types/null.ts'
import { type TNever, Never } from '../../types/never.ts'

// ------------------------------------------------------------------
// FromEnumValue
// ------------------------------------------------------------------
type TFromEnumValue<Value extends TEnumValue,
  Result extends TSchema = 
    Value extends string | number ? TLiteral<Value> :
    Value extends null ? TNull :
    TNever
> = Result
function FromEnumValue(value: TEnumValue): TSchema {
  return (
    Guard.IsString(value) || Guard.IsNumber(value) ? Literal(value) :
    Guard.IsNull(value) ? Null() :
    Never()
  )
}
// ------------------------------------------------------------------
// EnumValuesToVariants
// ------------------------------------------------------------------
export type TEnumValuesToVariants<Values extends TEnumValue[], Result extends TSchema[] = []> = (
  Values extends [infer Left extends TEnumValue, ...infer Right extends TEnumValue[]]
    ? TEnumValuesToVariants<Right, [...Result, TFromEnumValue<Left>]>
    : Result
)
export function EnumValuesToVariants<Values extends TEnumValue[]>(values: [...Values]): TEnumValuesToVariants<Values> {
  const result = values.map(value => FromEnumValue(value))
  return result as never
}
// ------------------------------------------------------------------
// EnumValuesToUnion
// ------------------------------------------------------------------
export type TEnumValuesToUnion<Values extends TEnumValue[], 
  Variants extends TSchema[] = TEnumValuesToVariants<Values>,
  Results extends TSchema = TUnion<Variants>
> = Results
export function EnumValuesToUnion<Values extends TEnumValue[]>(values: [...Values]): TEnumValuesToUnion<Values> {
  const variants = EnumValuesToVariants(values) as TSchema[]
  const result = Union(variants)
  return result as never
}
// ------------------------------------------------------------------
// EnumToUnion
// ------------------------------------------------------------------
export type TEnumToUnion<Type extends TEnum, 
  Result extends TSchema = TEnumValuesToUnion<Type['enum']>
> = Result

export function EnumToUnion<Type extends TEnum>(type: Type): TEnumToUnion<Type> {
  const result = EnumValuesToUnion(type.enum)
  return result as never
}