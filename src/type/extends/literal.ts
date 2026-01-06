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

import { TUnreachable, Unreachable } from '../../system/unreachable/unreachable.ts'
import { Guard } from '../../guard/index.ts'

import { type TSchema } from '../types/schema.ts'
import { type TProperties } from '../types/properties.ts'
import { type TLiteral, type TLiteralValue, IsLiteral, Literal } from '../types/literal.ts'
import { type TBigInt, IsBigInt } from '../types/bigint.ts'
import { type TBoolean, IsBoolean } from '../types/boolean.ts'
import { type TNumber, IsNumber } from '../types/number.ts'
import { type TString, IsString } from '../types/string.ts'
import { type TExtendsRight, ExtendsRight } from './extends-right.ts'

import * as Result from './result.ts'

// ----------------------------------------------------------------------------
// ExtendsLiteralValue
// ----------------------------------------------------------------------------
type TExtendsLiteralValue<Inferred extends TProperties, Left extends TLiteralValue, Right extends TLiteralValue> = (
  Left extends Right
  ? Result.TExtendsTrue<Inferred>
  : Result.TExtendsFalse
)
function ExtendsLiteralValue<Inferred extends TProperties, Left extends TLiteralValue, Right extends TLiteralValue>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsLiteralValue<Inferred, Left, Right> {
  return (
    (left as never) === right
      ? Result.ExtendsTrue(inferred)
      : Result.ExtendsFalse()
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsLiteralBigInt
// ----------------------------------------------------------------------------
type TExtendsLiteralBigInt<Inferred extends TProperties, Left extends bigint, Right extends TSchema> = (
  Right extends TLiteral<infer Value extends bigint> ? TExtendsLiteralValue<Inferred, Left, Value> :
  Right extends TBigInt ? Result.TExtendsTrue<Inferred> :
  TExtendsRight<Inferred, TLiteral<Left>, Right>
)
function ExtendsLiteralBigInt<Inferred extends TProperties, Left extends bigint, Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsLiteralBigInt<Inferred, Left, Right> {
  return (
    IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) :
    IsBigInt(right) ? Result.ExtendsTrue(inferred) :
    ExtendsRight(inferred, Literal(left), right)
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsLiteralBoolean
// ----------------------------------------------------------------------------
type TExtendsLiteralBoolean<Inferred extends TProperties, Left extends boolean, Right extends TSchema> = (
  Right extends TLiteral<infer Value extends boolean> ? TExtendsLiteralValue<Inferred, Left, Value> :
  Right extends TBoolean ? Result.TExtendsTrue<Inferred> :
  TExtendsRight<Inferred, TLiteral<Left>, Right>
)
function ExtendsLiteralBoolean<Inferred extends TProperties, Left extends boolean, Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsLiteralBoolean<Inferred, Left, Right> {
  return (
    IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) :
    IsBoolean(right) ? Result.ExtendsTrue(inferred) :
    ExtendsRight(inferred, Literal(left), right)
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsLiteralNumber
// ----------------------------------------------------------------------------
type TExtendsLiteralNumber<Inferred extends TProperties, Left extends number, Right extends TSchema> = (
  Right extends TLiteral<infer Value extends number> ? TExtendsLiteralValue<Inferred, Left, Value> :
  Right extends TNumber ? Result.TExtendsTrue<Inferred> :
  TExtendsRight<Inferred, TLiteral<Left>, Right>
)
function ExtendsLiteralNumber<Inferred extends TProperties, Left extends number, Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsLiteralNumber<Inferred, Left, Right> {
  return (
    IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) :
    IsNumber(right) ? Result.ExtendsTrue(inferred) :
    ExtendsRight(inferred, Literal(left), right)
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsLiteralString
// ----------------------------------------------------------------------------
type TExtendsLiteralString<Inferred extends TProperties, Left extends string, Right extends TSchema> = (
  Right extends TLiteral<infer Value extends string> ? TExtendsLiteralValue<Inferred, Left, Value> :
  Right extends TString ? Result.TExtendsTrue<Inferred> :
  TExtendsRight<Inferred, TLiteral<Left>, Right>
)
function ExtendsLiteralString<Inferred extends TProperties, Left extends string, Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsLiteralString<Inferred, Left, Right> {
  return (
    IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) :
    IsString(right) ? Result.ExtendsTrue(inferred) :
    ExtendsRight(inferred, Literal(left), right)
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsLiteral
//
// deno-coverage-ignore-start
//
// We assert that TLiteral is of TLiteralValue so we never reach fallthrough.
// ----------------------------------------------------------------------------
export type TExtendsLiteral<Inferred extends TProperties, Left extends TLiteral, Right extends TSchema> = (
  Left extends TLiteral<infer Value extends bigint> ? TExtendsLiteralBigInt<Inferred, Value, Right> :
  Left extends TLiteral<infer Value extends boolean> ? TExtendsLiteralBoolean<Inferred, Value, Right> :
  Left extends TLiteral<infer Value extends number> ? TExtendsLiteralNumber<Inferred, Value, Right> :
  Left extends TLiteral<infer Value extends string> ? TExtendsLiteralString<Inferred, Value, Right> :
  TUnreachable // TExtendsRight<Inferred, Left, Right>
)
export function ExtendsLiteral<Inferred extends TProperties, Left extends TLiteral, Right extends TSchema>
  (inferred: TProperties, left: Left, right: Right): 
    TExtendsLiteral<Inferred, Left, Right> {
  return (
    Guard.IsBigInt(left.const) ? ExtendsLiteralBigInt(inferred, left.const, right) :
    Guard.IsBoolean(left.const) ? ExtendsLiteralBoolean(inferred, left.const, right) :
    Guard.IsNumber(left.const) ? ExtendsLiteralNumber(inferred, left.const, right) :
    Guard.IsString(left.const) ? ExtendsLiteralString(inferred, left.const, right) :
    Unreachable() // ExtendsRight(inferred, left, right)
  ) as never
}
// deno-coverage-ignore-stop