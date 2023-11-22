/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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
import type { Static } from '../static/index'
import { Kind } from '../symbols/index'
// ------------------------------------------------------------------
// ValueGuard
// ------------------------------------------------------------------
import { IsString, IsUndefined } from '../guard/value'
// ------------------------------------------------------------------
// TRef
// ------------------------------------------------------------------
export interface TRef<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Ref'
  static: Static<T, this['params']>
  $ref: string
}
/** `[Json]` Creates a Ref type. The referenced type must contain a $id */
export function Ref<T extends TSchema>(schema: T, options?: SchemaOptions): TRef<T>
/** `[Json]` Creates a Ref type. */
export function Ref<T extends TSchema>($ref: string, options?: SchemaOptions): TRef<T>
/** `[Json]` Creates a Ref type. */
export function Ref(unresolved: TSchema | string, options: SchemaOptions = {}) {
  if (IsString(unresolved)) return { ...options, [Kind]: 'Ref', $ref: unresolved }
  if (IsUndefined(unresolved.$id)) throw new Error('Reference target type must specify an $id')
  return {
    ...options,
    [Kind]: 'Ref',
    $ref: unresolved.$id!,
  }
}
