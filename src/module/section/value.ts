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

// deno-lint-ignore-file ban-types
// deno-fmt-ignore-file

import { GlobalsGuard, Guard } from '../../guard/index.ts'

// ------------------------------------------------------------------
// PropertyKey
// ------------------------------------------------------------------
const IdentifierPattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/

function PropertyKey(key: string): string {
  if (key === '__proto__') return `["__proto__"]`
  if (IdentifierPattern.test(key)) return key
  return `${JSON.stringify(key)}`
}
// ------------------------------------------------------------------
// RegExp
// ------------------------------------------------------------------
function FromRegExp(value: RegExp): string {
  return value.toString()
}
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
function FromFunction(value: Function): string {
  return value.toString()
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
function FromArray(value: unknown[]): string {
  return `[${value.map((element) => FromUnknown(element)).join(', ')}]`
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
function FromObject(value: Record<string, unknown>): string {
  const keys = Object.keys(value)
  return Guard.IsEqual(keys.length, 0) ? `{}` : `{ ${keys.map((key) => `${PropertyKey(key)}: ${FromUnknown(value[key])}`).join(', ')} }`
}
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
function FromBigInt(value: bigint): string {
  return `BigInt(${JSON.stringify(value.toString())})`
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
function FromUndefined(_value: undefined): string {
  return 'undefined'
}
// ------------------------------------------------------------------
// Symbol
// ------------------------------------------------------------------
function FromSymbol(value: symbol): string {
  const key = Symbol.keyFor(value)
  return Guard.IsUndefined(key) ? `Symbol(${JSON.stringify(value.description)})` : `Symbol.for(${JSON.stringify(key)})` 
}
// ------------------------------------------------------------------
// Value
// ------------------------------------------------------------------
function FromValue(value: unknown): string {
  return JSON.stringify(value) // string, number, boolean, null
}
// ------------------------------------------------------------------
// Unknown
// ------------------------------------------------------------------
function FromUnknown(value: unknown): string {
  return (
    GlobalsGuard.IsRegExp(value) ? FromRegExp(value) : 
    Guard.IsFunction(value) ? FromFunction(value) : 
    Guard.IsArray(value) ? FromArray(value) : 
    Guard.IsObject(value) ? FromObject(value) : 
    Guard.IsBigInt(value) ? FromBigInt(value) : 
    Guard.IsUndefined(value) ? FromUndefined(value) : 
    Guard.IsSymbol(value) ? FromSymbol(value) : 
    FromValue(value)
  )
}
// ------------------------------------------------------------------
// Value
// ------------------------------------------------------------------
/** Serializes a JavaScript value source string. Similar to JSON.stringify() but supports values of bigint, undefined, symbol as well as Function and RegExp via toString(). */
export function Value(value: unknown): string {
  return FromUnknown(value)
}
