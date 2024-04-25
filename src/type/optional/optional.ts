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

import type { TSchema } from '../schema/index'
import type { Ensure } from '../helpers/index'
import { OptionalKind } from '../symbols/index'
import { CloneType } from '../clone/type'
import { Discard } from '../discard/index'
import type { TMappedResult } from '../mapped/index'

import { OptionalFromMappedResult, type TOptionalFromMappedResult } from './optional-from-mapped-result'
import { IsMappedResult } from '../guard/kind'
// ------------------------------------------------------------------
// RemoveOptional
// ------------------------------------------------------------------
type TRemoveOptional<T extends TSchema> = T extends TOptional<infer S> ? S : T
function RemoveOptional<T extends TSchema>(schema: T) {
  return Discard(CloneType(schema), [OptionalKind])
}
// ------------------------------------------------------------------
// AddOptional
// ------------------------------------------------------------------
type TAddOptional<T extends TSchema> = T extends TOptional<infer S> ? TOptional<S> : Ensure<TOptional<T>>
function AddOptional<T extends TSchema>(schema: T) {
  return { ...CloneType(schema), [OptionalKind]: 'Optional' }
}
// prettier-ignore
export type TOptionalWithFlag<T extends TSchema, F extends boolean> = 
  F extends false 
    ? TRemoveOptional<T> 
    : TAddOptional<T>
// prettier-ignore
function OptionalWithFlag<T extends TSchema, F extends boolean>(schema: T, F: F) {
  return (
    F === false
      ? RemoveOptional(schema)
      : AddOptional(schema)
  )
}
// ------------------------------------------------------------------
// Optional
// ------------------------------------------------------------------
export type TOptional<T extends TSchema> = T & { [OptionalKind]: 'Optional' }

/** `[Json]` Creates a Optional property */
export function Optional<T extends TMappedResult, F extends boolean>(schema: T, enable: F): TOptionalFromMappedResult<T, F>
/** `[Json]` Creates a Optional property */
export function Optional<T extends TSchema, F extends boolean>(schema: T, enable: F): TOptionalWithFlag<T, F>
/** `[Json]` Creates a Optional property */
export function Optional<T extends TMappedResult>(schema: T): TOptionalFromMappedResult<T, true>
/** `[Json]` Creates a Optional property */
export function Optional<T extends TSchema>(schema: T): TOptionalWithFlag<T, true>
/** `[Json]` Creates a Optional property */
export function Optional(schema: TSchema, enable?: boolean): any {
  const F = enable ?? true
  return IsMappedResult(schema) ? OptionalFromMappedResult(schema, F) : OptionalWithFlag(schema, F)
}
