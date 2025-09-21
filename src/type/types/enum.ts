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
import { type TSchema, type TSchemaOptions, IsKind } from './schema.ts'
import { type TTypeScriptEnumLike, IsTypeScriptEnumLike } from '../engine/enum/typescript-enum-to-enum-values.ts'
import { type TTypeScriptEnumToEnumValues, TypeScriptEnumToEnumValues } from '../engine/enum/typescript-enum-to-enum-values.ts'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticEnum<Values extends TEnumValue[]> = (
  Values[number]
)
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
export type TEnumValue = string | number | null

/** Represents an Enum type. */
export interface TEnum<Values extends TEnumValue[] = TEnumValue[]> extends TSchema {
  '~kind': 'Enum'
  enum: Values
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates an Enum type. */
export function Enum<Values extends TEnumValue[]>(values: readonly [...Values], options?: TSchemaOptions): TEnum<Values> 
/** Creates an Enum type from a TypeScript enum declaration. */
export function Enum<Enum extends TTypeScriptEnumLike>(value: Enum, options?: TSchemaOptions): TEnum<TTypeScriptEnumToEnumValues<Enum>> 
/** Creates an Enum type. */
export function Enum(value: readonly TEnumValue[] | TTypeScriptEnumLike, options?: TSchemaOptions): never {
  const values = IsTypeScriptEnumLike(value) ? TypeScriptEnumToEnumValues(value) : value
  return Memory.Create({ '~kind': 'Enum' }, { enum: values }, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is a TEnum. */
export function IsEnum(value: unknown): value is TEnum {
  return IsKind(value, 'Enum')
}