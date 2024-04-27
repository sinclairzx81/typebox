/*--------------------------------------------------------------------------

@sinclair/typebox/system

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

import { IsObject, IsArray, IsNumber, IsUndefined } from '../value/guard/index'

export namespace TypeSystemPolicy {
  // ------------------------------------------------------------------
  // TypeSystemPolicy
  // ------------------------------------------------------------------
  /** Shared assertion routines used by the value and errors modules */
  /** Sets whether TypeBox should assert optional properties using the TypeScript `exactOptionalPropertyTypes` assertion policy. The default is `false` */
  export let ExactOptionalPropertyTypes: boolean = false
  /** Sets whether arrays should be treated as a kind of objects. The default is `false` */
  export let AllowArrayObject: boolean = false
  /** Sets whether `NaN` or `Infinity` should be treated as valid numeric values. The default is `false` */
  export let AllowNaN: boolean = false
  /** Sets whether `null` should validate for void types. The default is `false` */
  export let AllowNullVoid: boolean = false
  /** Asserts this value using the ExactOptionalPropertyTypes policy */
  export function IsExactOptionalProperty(value: Record<keyof any, unknown>, key: string) {
    return ExactOptionalPropertyTypes ? key in value : value[key] !== undefined
  }
  /** Asserts this value using the AllowArrayObjects policy */
  export function IsObjectLike(value: unknown): value is Record<keyof any, unknown> {
    const isObject = IsObject(value)
    return AllowArrayObject ? isObject : isObject && !IsArray(value)
  }
  /** Asserts this value as a record using the AllowArrayObjects policy */
  export function IsRecordLike(value: unknown): value is Record<keyof any, unknown> {
    return IsObjectLike(value) && !(value instanceof Date) && !(value instanceof Uint8Array)
  }
  /** Asserts this value using the AllowNaN policy */
  export function IsNumberLike(value: unknown): value is number {
    return AllowNaN ? IsNumber(value) : Number.isFinite(value)
  }
  /** Asserts this value using the AllowVoidNull policy */
  export function IsVoidLike(value: unknown): value is void {
    const isUndefined = IsUndefined(value)
    return AllowNullVoid ? isUndefined || value === null : isUndefined
  }
}
