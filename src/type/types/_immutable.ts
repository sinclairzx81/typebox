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

import { Memory } from '../../system/memory/index.ts'
import { Guard } from '../../guard/index.ts'
import { type TSchema, IsSchema } from './schema.ts'

// ------------------------------------------------------------------
// ImmutableRemove
// ------------------------------------------------------------------
/** Removes Immutable from the given type. */
export type TImmutableRemove<Type extends TSchema,
  Result extends TSchema = Type extends TImmutable<infer Type extends TSchema> ? Type : Type
> = Result
/** Removes Immutable from the given type. */
export function ImmutableRemove<Type extends TSchema>(type: Type): TImmutableRemove<Type> {
  return Memory.Discard(type, ['~immutable']) as never
}
// ------------------------------------------------------------------
// ImmutableAdd
// ------------------------------------------------------------------
/** Adds Immutable to the given type. */
export type TImmutableAdd<Type extends TSchema = TSchema> = (
  '~immutable' extends keyof Type ? Type : TImmutable<Type>
)
/** Adds Immutable to the given type. */
export function ImmutableAdd<Type extends TSchema>(type: Type): TImmutableAdd<Type> {
  return Memory.Update(type, { '~immutable': true }, { }) as never
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
export type TImmutable<Type extends TSchema = TSchema> = (
  Type & { '~immutable': true }
)
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Applies an Immutable modifier to the given type. */
export function Immutable<Type extends TSchema>(type: Type): TImmutableAdd<Type> {
  return ImmutableAdd(type) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is a TImmutable */
export function IsImmutable(value: unknown): value is TImmutable<TSchema> {
  return IsSchema(value) && Guard.HasPropertyKey(value, '~immutable')
}


