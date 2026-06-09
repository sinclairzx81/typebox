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

import { type TSchema, type TSchemaOptions } from '../types/schema.ts'
import { type TDeferred, Deferred } from '../types/deferred.ts'
import { type TAddImmutableAction, AddImmutableAction } from '../engine/immutable/instantiate_add.ts'

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
/** Creates a deferred AddImmutable action. */
export type TAddImmutableDeferred<Type extends TSchema> = (
  TDeferred<'AddImmutable', [Type]>
)
/** Creates a deferred AddImmutable action. */
export function AddImmutableDeferred<Type extends TSchema>(type: Type, options: TSchemaOptions = {}): TAddImmutableDeferred<Type> {
  return Deferred('AddImmutable', [type], options)
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Applies an AddImmutable action to a type. */
export type TAddImmutable<Type extends TSchema> = (
  TAddImmutableAction<Type>
)
/** Applies an AddImmutable action to a type. */
export function AddImmutable<Type extends TSchema>(type: Type, options: TSchemaOptions = {}): TAddImmutable<Type> {
  return AddImmutableAction(type, options)
}