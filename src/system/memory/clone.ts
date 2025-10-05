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

import { Guard } from '../../guard/index.ts'
import { Metrics } from './metrics.ts'

// ------------------------------------------------------------------
// Base
// ------------------------------------------------------------------
function IsBase(value: unknown): value is { '~base': unknown } {
  return Guard.IsObject(value) && Guard.HasPropertyKey(value, '~base')
}
function FromBase(value: { '~base': unknown }): unknown {
  return value // non-clonable
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
function FromArray(value: unknown[]): unknown[] {
  return value.map((value) => FromValue(value))
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
function FromObject(value: Record<PropertyKey, unknown>): object {
  const result = {} as Record<PropertyKey, unknown>
  const descriptors = Object.getOwnPropertyDescriptors(value)
  for (const key of Object.keys(descriptors)) {
    const descriptor = descriptors[key]
    if (Guard.HasPropertyKey(descriptor, 'value')) {
      Object.defineProperty(result, key, { ...descriptor, value: FromValue(descriptor.value) })
    }
  }
  return result
}
// ------------------------------------------------------------------
// RegExp
// ------------------------------------------------------------------
function FromRegExp(value: RegExp): RegExp {
  return new RegExp(value.source, value.flags)
}
// ------------------------------------------------------------------
// RegExp
// ------------------------------------------------------------------
function FromUnknown(value: unknown): unknown {
  return value
}
// ------------------------------------------------------------------
// Value
// ------------------------------------------------------------------
function FromValue(value: unknown): unknown {
  return (
    value instanceof RegExp ? FromRegExp(value) :
    IsBase(value) ? FromBase(value) :
    Guard.IsArray(value) ? FromArray(value) : 
    Guard.IsObject(value) ? FromObject(value) : 
    FromUnknown(value)
  )
}
/**
 * Clones a value using the TypeBox type cloning strategy. This function preserves non-enumerable 
 * properties from the source value. This is to ensure cloned types retain discriminable 
 * hidden properties.
 */
export function Clone<Value extends unknown = unknown>(value: Value): Value {
  Metrics.clone += 1
  return FromValue(value) as never
}
