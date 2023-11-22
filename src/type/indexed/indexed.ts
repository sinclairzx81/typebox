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
import { IndexResult, type TIndexResult } from './indexed-result'
import { IndexPropertyKeys, type TIndexPropertyKeys } from './indexed-property-keys'
import { IndexFromMappedKey, type TIndexFromMappedKey } from './indexed-from-mapped-key'
import { TMappedKey } from '../mapped/index'
import { CloneType } from '../clone/type'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import { 
  TMappedKey as IsMappedKey,
  TSchema as IsSchemaType
} from '../guard/type'

// ------------------------------------------------------------------
// TIndex
// ------------------------------------------------------------------
export type TIndex<T extends TSchema, K extends PropertyKey[]> = TIndexResult<T, K>

/** `[Json]` Returns an indexed mapped key result */
export function Index<T extends TSchema, K extends TMappedKey>(T: T, K: K, options?: SchemaOptions): TIndexFromMappedKey<T, K>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<T extends TSchema, K extends TSchema, I extends PropertyKey[] = TIndexPropertyKeys<K>>(T: T, K: K, options?: SchemaOptions): TIndex<T, I>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<T extends TSchema, K extends PropertyKey[]>(T: T, K: readonly [...K], options?: SchemaOptions): TIndex<T, K>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index(T: TSchema, K: any, options: SchemaOptions = {}): any {
  // prettier-ignore
  return (
    IsMappedKey(K) ? CloneType(IndexFromMappedKey(T, K, options)) :
    IsSchemaType(K) ? IndexResult(T, IndexPropertyKeys(K), options) :
    IndexResult(T, K as string[], options)
  )
}
