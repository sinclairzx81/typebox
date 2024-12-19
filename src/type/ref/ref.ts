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
 * @deprecated `[Json]` Creates a Ref type. This signature was deprecated in 0.34.0 where Ref requires callers to pass
 * a `string` value for the reference (and not a schema).
 *
 * To adhere to the 0.34.0 signature, Ref implementations should be updated to the following.
 *
 * ```typescript
 * // pre-0.34.0
 *
 * const T = Type.String({ $id: 'T' })
 *
 * const R = Type.Ref(T)
 * ```
 * should be changed to the following
 *
 * ```typescript
 * // post-0.34.0
 *
 * const T = Type.String({ $id: 'T' })
 *
 * const R = Type.Unsafe<Static<typeof T>>(Type.Ref('T'))
 * ```
 * You can also create a generic function to replicate the pre-0.34.0 signature if required
 *
 * ```typescript
 * const LegacyRef = <T extends TSchema>(schema: T) => Type.Unsafe<Static<T>>(Type.Ref(schema.$id!))
 * ```
 */
export function Ref<Type extends TSchema>(type: Type, options?: SchemaOptions): TRefUnsafe<Type>
/** `[Json]` Creates a Ref type. The referenced type must contain a $id */
export function Ref(...args: any[]): unknown {
  const [$ref, options] = typeof args[0] === 'string' ? [args[0], args[1]] : [args[0].$id, args[1]]
  if (typeof $ref !== 'string') throw new TypeBoxError('Ref: $ref must be a string')
  return CreateType({ [Kind]: 'Ref', $ref }, options) as never
}
