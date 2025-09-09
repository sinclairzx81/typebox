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

import { Guard } from '../../guard/index.ts'
import { type TSchema, type TSchemaOptions } from '../types/schema.ts'
import { type TDeferred, Deferred } from '../types/deferred.ts'
import { type TKeysToIndexer, KeysToIndexer } from '../engine/helpers/keys-to-indexer.ts'
import { type TInstantiate, Instantiate } from '../engine/instantiate.ts'

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
/** Creates a deferred Index action. */
export type TIndexDeferred<Type extends TSchema, Indexer extends TSchema> = (
  TDeferred<'Index', [Type, Indexer]>
)
/** Creates a deferred Index action. */
export function IndexDeferred<Type extends TSchema, Indexer extends TSchema>(type: Type, indexer: Indexer, options: TSchemaOptions = {}): TIndexDeferred<Type, Indexer> {
  return Deferred('Index', [type, indexer], options)
}
// ------------------------------------------------------------------
// Index
// ------------------------------------------------------------------
/** Applies a Index action using the given types. */
export type TIndex<Type extends TSchema, Indexer extends TSchema> = (
  TInstantiate<{}, TIndexDeferred<Type, Indexer>>
)
/** Applies a Index action using the given types. */
export function Index<Type extends TSchema, Indexer extends PropertyKey[]>(type: Type, indexer: [...Indexer], options?: TSchemaOptions): TIndex<Type, TKeysToIndexer<Indexer>>
/** Applies a Index action using the given types. */
export function Index<Type extends TSchema, Indexer extends TSchema>(type: Type, indexer: Indexer, options?: TSchemaOptions): TIndex<Type, Indexer> 
/** Applies a Index action using the given types. */
export function Index(type: TSchema, indexer_or_keys: PropertyKey[] | TSchema, options: TSchemaOptions = {}): never {
  const indexer = Guard.IsArray(indexer_or_keys) ? KeysToIndexer(indexer_or_keys as PropertyKey[]) : indexer_or_keys
  return Instantiate({}, IndexDeferred(type, indexer, options)) as never
}
