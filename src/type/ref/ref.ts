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

import type { TSchema, SchemaOptions } from '../schema/index'
import { TypeBoxError } from '../error/index'
import { CreateType } from '../create/type'
import { Kind } from '../symbols/index'
import { TUnsafe } from '../unsafe/index'
import { Static } from '../static/index'

// ------------------------------------------------------------------
// TRef
// ------------------------------------------------------------------
export interface TRef<Ref extends string = string> extends TSchema {
  [Kind]: 'Ref'
  static: unknown
  $ref: Ref
}

export type TRefUnsafe<Type extends TSchema> = TUnsafe<Static<Type>>

/** `[Json]` Creates a Ref type.*/
export function Ref<Ref extends string>($ref: Ref, options?: SchemaOptions): TRef<Ref>
/**
 * @deprecated `[Json]` Creates a Ref type. The referenced type MUST contain a $id. The Ref(TSchema) signature was
 * deprecated on 0.34.0 in support of a new type referencing model (Module). Existing implementations using Ref(TSchema)
 * can migrate using the following. The Ref(TSchema) validation behavior of Ref will be preserved how the construction
 * of legacy Ref(TSchema) will require wrapping in TUnsafe (where TUnsafe is used for inference only)
 *
 * ```typescript
 * const R = Type.Ref(T)
 * ```
 * to
 *
 * ```typescript
 * const R = Type.Unsafe<Static<T>>(T.$id)
 * ```
 */
export function Ref<Type extends TSchema>(type: Type, options?: SchemaOptions): TRefUnsafe<Type>
/** `[Json]` Creates a Ref type. The referenced type must contain a $id */
export function Ref(...args: any[]): unknown {
  const [$ref, options] = typeof args[0] === 'string' ? [args[0], args[1]] : [args[0].$id, args[1]]
  if (typeof $ref !== 'string') throw new TypeBoxError('Ref: $ref must be a string')
  return CreateType({ [Kind]: 'Ref', $ref }, options) as never
}
