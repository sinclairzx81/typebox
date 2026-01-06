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

import { Memory } from '../../system/memory/index.ts'
import { Guard } from '../../guard/index.ts'
import { type TSchema, IsSchema } from './schema.ts'

// ------------------------------------------------------------------
// ReadonlyRemove
// ------------------------------------------------------------------
/** Removes a Readonly property modifier from the given type. */
export type TReadonlyRemove<Type extends TSchema,
  Result extends TSchema = Type extends TReadonly<infer Type extends TSchema> ? Type : Type
> = Result
/** Removes a Readonly property modifier from the given type. */
export function ReadonlyRemove<Type extends TSchema>(type: Type): TReadonlyRemove<Type> {
  return Memory.Discard(type, ['~readonly']) as never
}
// ------------------------------------------------------------------
// ReadonlyAdd
// ------------------------------------------------------------------
/** Adds a Readonly property modifier to the given type. */
export type TReadonlyAdd<Type extends TSchema = TSchema> = (
  '~readonly' extends keyof Type ? Type : TReadonly<Type>
)
/** Adds a Readonly property modifier to the given type. */
export function ReadonlyAdd<Type extends TSchema>(type: Type): TReadonlyAdd<Type> {
  return Memory.Update(type, { '~readonly': true }, { }) as never
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
export type TReadonly<Type extends TSchema = TSchema> = (
  Type & { '~readonly': true }
)
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Applies an Readonly property modifier to the given type. */
export function Readonly<Type extends TSchema>(type: Type): TReadonlyAdd<Type> {
  return ReadonlyAdd(type) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is a TReadonly */
export function IsReadonly(value: unknown): value is TReadonly<TSchema> {
  return IsSchema(value) && Guard.HasPropertyKey(value, '~readonly')
}


