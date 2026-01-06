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

import { Guard } from '../../guard/index.ts'
import { Memory } from '../../system/memory/index.ts'
import { type TSchema, IsSchema } from './schema.ts'

// ------------------------------------------------------------------
// OptionalRemove
// ------------------------------------------------------------------
/** Removes Optional from the given type. */
export type TOptionalRemove<Type extends TSchema,
  Result extends TSchema = Type extends TOptional<infer Type extends TSchema> ? Type : Type
> = Result
/** Removes Optional from the given type. */
export function OptionalRemove<Type extends TSchema>(type: Type): TOptionalRemove<Type> {
  const result = Memory.Discard(type, ['~optional'])
  return result as never
}
// ------------------------------------------------------------------
// OptionalAdd
// ------------------------------------------------------------------
/** Adds Optional to the given type. */
export type TOptionalAdd<Type extends TSchema = TSchema,
  Result extends TSchema = '~optional' extends keyof Type ? Type : TOptional<Type>
> = Result
/** Adds Optional to the given type. */
export function OptionalAdd<Type extends TSchema>(type: Type): TOptionalAdd<Type> {
  return Memory.Update(type, { '~optional': true }, {}) as never
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
export type TOptional<Type extends TSchema = TSchema> = (
  Type & { '~optional': true }
)
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Applies an Optional modifier to the given type. */
export function Optional<Type extends TSchema>(type: Type): TOptionalAdd<Type> {
  return OptionalAdd(type) 
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is TOptional */
export function IsOptional(value: unknown): value is TOptional<TSchema> {
  return IsSchema(value) && Guard.HasPropertyKey(value, '~optional')
}