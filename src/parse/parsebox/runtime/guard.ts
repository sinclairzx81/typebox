/*--------------------------------------------------------------------------

@sinclair/parsebox

The MIT License (MIT)

Copyright (c) 2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { IIdent, INumber, IRef, IString, IConst, ITuple, IUnion } from './types'

// ------------------------------------------------------------------
// Value Guard
// ------------------------------------------------------------------
// prettier-ignore
function HasPropertyKey<Key extends PropertyKey>(value: Record<PropertyKey, unknown>, key: Key): value is Record<PropertyKey, unknown> & { [_ in Key]: unknown } {
  return key in value
}
// prettier-ignore
function IsObjectValue(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null
}
// prettier-ignore
function IsArrayValue(value: unknown): value is unknown[] {
  return globalThis.Array.isArray(value)
}
// ------------------------------------------------------------------
// Parser Guard
// ------------------------------------------------------------------
/** Returns true if the value is a Tuple Parser */
// prettier-ignore
export function IsTuple(value: unknown): value is ITuple {
  return IsObjectValue(value) && HasPropertyKey(value, 'type') && value.type === 'Tuple' && HasPropertyKey(value, 'parsers') && IsArrayValue(value.parsers)
}
/** Returns true if the value is a Union Parser */
// prettier-ignore
export function IsUnion(value: unknown): value is IUnion {
  return IsObjectValue(value) && HasPropertyKey(value, 'type') && value.type === 'Union' && HasPropertyKey(value, 'parsers') && IsArrayValue(value.parsers)
}
/** Returns true if the value is a Const Parser */
// prettier-ignore
export function IsConst(value: unknown): value is IConst {
  return IsObjectValue(value) && HasPropertyKey(value, 'type') && value.type === 'Const' && HasPropertyKey(value, 'value') && typeof value.value === 'string'
}
/** Returns true if the value is a Ident Parser */
// prettier-ignore
export function IsIdent(value: unknown): value is IIdent {
  return IsObjectValue(value) && HasPropertyKey(value, 'type') && value.type === 'Ident'
}
/** Returns true if the value is a Number Parser */
// prettier-ignore
export function IsNumber(value: unknown): value is INumber {
  return IsObjectValue(value) && HasPropertyKey(value, 'type') && value.type === 'Number'
}
/** Returns true if the value is a Ref Parser */
// prettier-ignore
export function IsRef(value: unknown): value is IRef {
  return IsObjectValue(value) && HasPropertyKey(value, 'type') && value.type === 'Ref' && HasPropertyKey(value, 'ref') && typeof value.ref === 'string'
}
/** Returns true if the value is a String Parser */
// prettier-ignore
export function IsString(value: unknown): value is IString {
  return IsObjectValue(value) && HasPropertyKey(value, 'type') && value.type === 'String' && HasPropertyKey(value, 'options') && IsArrayValue(value.options)
}
/** Returns true if the value is a Parser */
// prettier-ignore
export function IsParser(value: unknown) {
  return (
    IsTuple(value) ||
    IsUnion(value) ||
    IsConst(value) ||
    IsIdent(value) ||
    IsNumber(value) ||
    IsRef(value) ||
    IsString(value)
  )
}
