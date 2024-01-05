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

export type TypeRegistryValidationFunction<TSchema> = (schema: TSchema, value: unknown) => boolean
/** A registry for user defined types */

const map = new Map<string, TypeRegistryValidationFunction<any>>()
/** Returns the entries in this registry */
export function Entries() {
  return new Map(map)
}
/** Clears all user defined types */
export function Clear() {
  return map.clear()
}
/** Deletes a registered type */
export function Delete(kind: string) {
  return map.delete(kind)
}
/** Returns true if this registry contains this kind */
export function Has(kind: string) {
  return map.has(kind)
}
/** Sets a validation function for a user defined type */
export function Set<TSchema = unknown>(kind: string, func: TypeRegistryValidationFunction<TSchema>) {
  map.set(kind, func)
}
/** Gets a custom validation function for a user defined type */
export function Get(kind: string) {
  return map.get(kind)
}
