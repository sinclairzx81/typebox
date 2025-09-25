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

import { Guard, GlobalsGuard } from '../../guard/index.ts'

// ------------------------------------------------------------------
// ClassInstance
//
// TypeBox does not support cloning arbitrary class instances. It treats
// class instances as atomic values, similar to number, boolean, and
// string. In the future, an implementation could detect the presence of
// a .clone() method, but no formal specification for this behavior
// exists, so we don't.
//
// ------------------------------------------------------------------
function FromClassInstance(value: Record<PropertyKey, unknown>): Record<PropertyKey, unknown> {
  return value // atomic
}
// ------------------------------------------------------------------
// ObjectInstance
// ------------------------------------------------------------------
function FromObjectInstance(value: Record<PropertyKey, unknown>): Record<PropertyKey, unknown> {
  const result = {} as Record<PropertyKey, unknown>
  for (const key of Object.getOwnPropertyNames(value)) {
    result[key] = Clone(value[key])
  }
  for (const key of Object.getOwnPropertySymbols(value)) {
    result[key] = Clone(value[key])
  }
  return result
}

Object.create({})
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
function FromObject(value: Record<PropertyKey, unknown>): Record<PropertyKey, unknown> {
  return (
    Guard.IsClassInstance(value)
      ? FromClassInstance(value)
      : FromObjectInstance(value)
  )
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
function FromArray(value: unknown[]): unknown {
  return value.map((element: any) => Clone(element))
}
// ------------------------------------------------------------------
// TypeArray
// ------------------------------------------------------------------
function FromTypedArray(value: GlobalsGuard.TTypeArray): GlobalsGuard.TTypeArray {
  return value.slice()
}
// ------------------------------------------------------------------
// Map
// ------------------------------------------------------------------
function FromMap(value: Map<unknown, unknown>): Map<unknown, unknown> {
  return new Map(Clone([...value.entries()]))
}
// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
function FromSet(value: Set<unknown>): Set<unknown> {
  return new Set(Clone([...value.values()]))
}
// ------------------------------------------------------------------
// Value
// ------------------------------------------------------------------
function FromValue(value: unknown): unknown {
  return value
}
// ------------------------------------------------------------------
// Clone
// ------------------------------------------------------------------
/** 
 * Returns a Clone of the given value. This function is similar to structuredClone() 
 * but also supports deep cloning instances of Map, Set and TypeArray.
 */
export function Clone<Value extends unknown>(value: Value): Value {
  return (
    GlobalsGuard.IsTypeArray(value) ? FromTypedArray(value) :
    GlobalsGuard.IsMap(value) ? FromMap(value) :
    GlobalsGuard.IsSet(value) ? FromSet(value) :
    Guard.IsArray(value) ? FromArray(value) :
    Guard.IsObject(value) ? FromObject(value) :
    FromValue(value)
  ) as never
}
