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
import { type TInstantiate, Instantiate } from '../engine/instantiate.ts'

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
/** Creates a deferred Lowercase action. */
export type TLowercaseDeferred<Type extends TSchema> = (
  TDeferred<'Lowercase', [Type]>
)
/** Creates a deferred Lowercase action. */
export function LowercaseDeferred<Type extends TSchema>(type: Type, options: TSchemaOptions = {}): TLowercaseDeferred<Type> {
  return Deferred('Lowercase', [type], options)
}

// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Applies a Lowercase action to the given type. */
export type TLowercase<Type extends TSchema> = (
  TInstantiate<{}, TLowercaseDeferred<Type>>
)
/** Applies a Lowercase action to the given type. */
export function Lowercase<Type extends TSchema>(type: Type, options: TSchemaOptions = {}): TLowercase<Type> {
  return Instantiate({}, LowercaseDeferred(type, options)) as never
}
