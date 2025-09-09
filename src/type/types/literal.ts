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
import { type TSchema, type TSchemaOptions, IsKind } from './schema.ts'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticLiteral<Value extends TLiteralValue> = (
  Value
)
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
export type TLiteralValue = string | number | boolean | bigint

/** Represents a Literal type. */
export interface TLiteral<Value extends TLiteralValue = TLiteralValue> extends TSchema {
  '~kind': 'Literal'
  const: Value
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Literal type. */
export function Literal<Value extends TLiteralValue>(value: Value, options?: TSchemaOptions): TLiteral<Value> {
  return Memory.Create({ '~kind': 'Literal' }, { const: value }, options) as never
}
// ------------------------------------------------------------------
// Guards
// ------------------------------------------------------------------
/** Returns true if the given value is a TLiteralValue. */
export function IsLiteralValue(value: unknown): value is TLiteralValue {
  return Guard.IsBigInt(value) 
    || Guard.IsBoolean(value)
    || Guard.IsNumber(value)
    || Guard.IsString(value)
}
/** Returns true if the given value is TLiteral<bigint>. */
export function IsLiteralBigInt(value: unknown): value is TLiteral<bigint> {
  return IsLiteral(value) && Guard.IsBigInt(value.const)
}
/** Returns true if the given value is TLiteral<boolean>. */
export function IsLiteralBoolean(value: unknown): value is TLiteral<boolean> {
  return IsLiteral(value) && Guard.IsBoolean(value.const)
}
/** Returns true if the given value is TLiteral<number>. */
export function IsLiteralNumber(value: unknown): value is TLiteral<number> {
  return IsLiteral(value) && Guard.IsNumber(value.const)
}
/** Returns true if the given value is TLiteral<string>. */
export function IsLiteralString(value: unknown): value is TLiteral<string> {
  return IsLiteral(value) && Guard.IsString(value.const)
}
/** Returns true if the given value is TLiteral. */
export function IsLiteral(value: unknown): value is TLiteral {
  return IsKind(value, 'Literal')
}