/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import type { TSchema, SchemaOptions } from '../schema/index'
import { Literal, type TLiteral } from '../literal/index'
import { Kind, Hint } from '../symbols/index'
import { Union } from '../union/index'
// ------------------------------------------------------------------
// ValueGuard
// ------------------------------------------------------------------
import { IsUndefined } from '../guard/value'
// ------------------------------------------------------------------
// TEnum
// ------------------------------------------------------------------
export type TEnumRecord = Record<TEnumKey, TEnumValue>
export type TEnumValue = string | number
export type TEnumKey = string
export interface TEnum<T extends Record<string, string | number> = Record<string, string | number>> extends TSchema {
  [Kind]: 'Union'
  [Hint]: 'Enum'
  static: T[keyof T]
  anyOf: TLiteral<T[keyof T]>[]
}
/** `[Json]` Creates a Enum type */
export function Enum<V extends TEnumValue, T extends Record<TEnumKey, V>>(item: T, options: SchemaOptions = {}): TEnum<T> {
  if (IsUndefined(item)) throw new Error('Enum undefined or empty')
  const values1 = globalThis.Object.getOwnPropertyNames(item)
    .filter((key) => isNaN(key as any))
    .map((key) => item[key]) as T[keyof T][]
  const values2 = [...new Set(values1)]
  const anyOf = values2.map((value) => Literal(value))
  return Union(anyOf, { ...options, [Hint]: 'Enum' }) as never
}
