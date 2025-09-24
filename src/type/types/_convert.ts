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

import { Memory } from '../../system/memory/index.ts'
import { Guard } from '../../guard/index.ts'
import { type TSchema, IsSchema } from './schema.ts'
import { TProperties } from './properties.ts'

// ------------------------------------------------------------------
// ConvertAdd
// ------------------------------------------------------------------
/** Applies a Convert override to the given type. */
export type TConvertAdd<Type extends TSchema = TSchema> = (
  '~convert' extends keyof Type ? Type : TConvert<Type>
)
/** Applies a Convert override to the given type. */
export function ConvertAdd<Type extends TSchema>(type: Type, conversion: TConvertCallback<TConvertAdd<Type>>): TConvertAdd<Type> {
  const conversions = IsConvert(type) ? [conversion, ...type['~convert']] : [conversion]
  return Memory.Update(type, {  }, { '~convert': conversions }) as never
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a type with embedded Convert override. */
export type TConvert<Type extends TSchema = TSchema> = (
  Type & { '~convert': TConvertCallback<Type>[] }
)
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
export type TConvertCallback<Type extends TSchema> = (value: unknown, type: Type, context: TProperties) => TConvertCallbackResult
// TODO: Should we use classes here? constructor functions? `(value) => Continue(Number(value) * 100)` or `Final(String(value))`
export type TConvertCallbackResult = {
	action: "continue" | "final"
	value: unknown
}

/** Applies a Convert override to a type. */
export function Convert<Type extends TSchema>(type: Type, callback: TConvertCallback<TConvertAdd<Type>>): TConvertAdd<Type> {
  return ConvertAdd(type, callback) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is a TConvert. */
export function IsConvert(value: unknown): value is TConvert<TSchema> {
  return IsSchema(value) && Guard.HasPropertyKey(value, '~convert') && Guard.IsArray(value["~convert"])
}


