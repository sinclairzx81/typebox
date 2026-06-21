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

import { Guard, GlobalsGuard } from '../../guard/index.ts'
import { Metrics } from './metrics.ts'

// ------------------------------------------------------------------
// ClassInstance
//
// TypeBox does not clone arbitrary class instances. Class instances
// cannot be safely cloned without potentially breaking private
// members of the instance.
//
// ------------------------------------------------------------------
function FromClassInstance(value: Record<PropertyKey, unknown>): Record<PropertyKey, unknown> {
  return value // atomic
}
// ------------------------------------------------------------------
// KindedObject
//
// Types have non-enumerable properties that MUST be preserved on Clone. 
// The following is the optimal path for TypeBox types.
// ------------------------------------------------------------------
function IsKindedObject(value: Record<PropertyKey, unknown>): boolean {
  return Guard.HasPropertyKey(value, '~kind')
}
function FromKindedObject(value: Record<PropertyKey, unknown>): Record<PropertyKey, unknown> {
  const result = {} as Record<PropertyKey, unknown>
  const descriptors = Object.getOwnPropertyDescriptors(value)
  for (const key of Object.keys(descriptors)) {
    if (Guard.IsUnsafePropertyKey(key)) continue // (ignore: prototype-pollution)
    const descriptor = descriptors[key]
    if (Guard.HasPropertyKey(descriptor, 'value')) {
      Object.defineProperty(result, key, { ...descriptor, value: FromValue(descriptor.value) })
    }
  }
  return result
}
// ------------------------------------------------------------------
// PlainObject
// ------------------------------------------------------------------
function FromPlainObject(value: Record<PropertyKey, unknown>): Record<PropertyKey, unknown> {
  const result = {} as Record<PropertyKey, unknown>
  for (const key of Guard.Keys(value)) {
    if (Guard.IsUnsafePropertyKey(key)) continue // (ignore: prototype-pollution)
    result[key] = FromValue(value[key])
  }
  for (const key of Guard.Symbols(value)) {
    result[key] = FromValue(value[key])
  }
  return result
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
function FromObject(value: Record<PropertyKey, unknown>): Record<PropertyKey, unknown> {
  return (
    Guard.IsClassInstance(value) ? FromClassInstance(value) :
    IsKindedObject(value) ? FromKindedObject(value) :
    FromPlainObject(value)
  )
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
function FromArray(value: unknown[]): unknown {
  return value.map((element) => FromValue(element))
}
// ------------------------------------------------------------------
// TypeArray
// ------------------------------------------------------------------
function FromTypedArray(value: GlobalsGuard.TTypeArray): GlobalsGuard.TTypeArray {
  return value.slice()
}
// ------------------------------------------------------------------
// RegExp
// ------------------------------------------------------------------
function FromRegExp(value: RegExp): RegExp {
  return new RegExp(value.source, value.flags)
}
// ------------------------------------------------------------------
// Map
// ------------------------------------------------------------------
function FromMap(value: Map<unknown, unknown>): Map<unknown, unknown> {
  return new Map(FromValue([...value.entries()]) as never)
}
// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
function FromSet(value: Set<unknown>): Set<unknown> {
  return new Set(FromValue([...value.values()]) as never)
}
function FromValue(value: unknown): unknown {
  return (
    GlobalsGuard.IsTypeArray(value) ? FromTypedArray(value) :
    GlobalsGuard.IsRegExp(value) ? FromRegExp(value) :
    GlobalsGuard.IsMap(value) ? FromMap(value) :
    GlobalsGuard.IsSet(value) ? FromSet(value) :
    Guard.IsArray(value) ? FromArray(value) :
    Guard.IsObject(value) ? FromObject(value) :
    value
  ) as never
}
// ------------------------------------------------------------------
// Clone
// ------------------------------------------------------------------
/** 
 * Returns a Clone of the given value. This function is similar to structuredClone() 
 * but also supports deep cloning instances of Map, Set and TypeArray.
 */
export function Clone<Value extends unknown = unknown>(value: Value): Value {
  Metrics.clone += 1
  return FromValue(value) as never
}