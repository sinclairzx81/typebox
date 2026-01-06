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
import { type TEnumValue } from '../../types/enum.ts'
import { type TUnionToTuple } from '../helpers/union.ts'

// ------------------------------------------------------------------
// TypeScriptEnumDeclaration
// ------------------------------------------------------------------
export type TTypeScriptEnumLike = Record<PropertyKey, TEnumValue>

export function IsTypeScriptEnumLike(value: unknown): value is TTypeScriptEnumLike {
  return Guard.IsObjectNotArray(value)
}
// ------------------------------------------------------------------
// ReduceValues
// ------------------------------------------------------------------
type TReduceEnumValues<Keys extends string[], Type extends TTypeScriptEnumLike, Result extends TEnumValue[] = []> = (
  Keys extends [infer Left extends string, ...infer Right extends string[]]
    ? TReduceEnumValues<Right, Type, [...Result, Type[Left]]>
    : Result
)
// ------------------------------------------------------------------
// TypeScriptEnumToEnumValues
// ------------------------------------------------------------------
export type TTypeScriptEnumToEnumValues<Type extends TTypeScriptEnumLike,
  EnumKeys extends string[] = TUnionToTuple<Extract<keyof Type, string>>,
  Elements extends TEnumValue[] = TReduceEnumValues<EnumKeys, Type>
> = Elements
export function TypeScriptEnumToEnumValues<Type extends TTypeScriptEnumLike>(type: Type): TTypeScriptEnumToEnumValues<Type> {
  const keys = Guard.Keys(type).filter((key) => isNaN(key as never))
  return keys.reduce((result, key) => [...result, type[key]], [] as TEnumValue[]) as never
}