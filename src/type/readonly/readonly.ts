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
import { ReadonlyKind } from '../symbols/index'
import { CloneType } from '../clone/type'
import { Discard } from '../discard/index'
import type { TMappedResult } from '../mapped/index'

import { ReadonlyFromMappedResult, type TReadonlyFromMappedResult } from './readonly-from-mapped-result'
import { IsMappedResult } from '../guard/kind'
// ------------------------------------------------------------------
// RemoveReadonly
// ------------------------------------------------------------------
type TRemoveReadonly<T extends TSchema> = T extends TReadonly<infer S> ? S : T
function RemoveReadonly<T extends TSchema>(schema: T) {
  return Discard(CloneType(schema), [ReadonlyKind])
}
// ------------------------------------------------------------------
// AddReadonly
// ------------------------------------------------------------------
type TAddReadonly<T extends TSchema> = T extends TReadonly<infer S> ? TReadonly<S> : Ensure<TReadonly<T>>
function AddReadonly<T extends TSchema>(schema: T) {
  return { ...CloneType(schema), [ReadonlyKind]: 'Readonly' }
}
// prettier-ignore
export type TReadonlyWithFlag<T extends TSchema, F extends boolean> = 
  F extends false 
    ? TRemoveReadonly<T> 
    : TAddReadonly<T>
// prettier-ignore
function ReadonlyWithFlag<T extends TSchema, F extends boolean>(schema: T, F: F) {
  return (
    F === false
      ? RemoveReadonly(schema)
      : AddReadonly(schema)
  )
}
// ------------------------------------------------------------------
// TReadonly
// ------------------------------------------------------------------
export type TReadonly<T extends TSchema> = T & { [ReadonlyKind]: 'Readonly' }

/** `[Json]` Creates a Readonly property */
export function Readonly<T extends TMappedResult, F extends boolean>(schema: T, enable: F): TReadonlyFromMappedResult<T, F>
/** `[Json]` Creates a Readonly property */
export function Readonly<T extends TSchema, F extends boolean>(schema: T, enable: F): TReadonlyWithFlag<T, F>
/** `[Json]` Creates a Readonly property */
export function Readonly<T extends TMappedResult>(schema: T): TReadonlyFromMappedResult<T, true>
/** `[Json]` Creates a Readonly property */
export function Readonly<T extends TSchema>(schema: T): TReadonlyWithFlag<T, true>
/** `[Json]` Creates a Readonly property */
export function Readonly(schema: TSchema, enable?: boolean): any {
  const F = enable ?? true
  return IsMappedResult(schema) ? ReadonlyFromMappedResult(schema, F) : ReadonlyWithFlag(schema, F)
}
