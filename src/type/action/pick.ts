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
/** Creates a deferred Pick action. */
export type TPickDeferred<Type extends TSchema, Indexer extends TSchema> = (
  TDeferred<'Pick', [Type, Indexer]>
)
/** Creates a deferred Pick action. */
export function PickDeferred<Type extends TSchema, Indexer extends TSchema>(type: Type, indexer: Indexer, options: TSchemaOptions = {}): TPickDeferred<Type, Indexer> {
  return Deferred('Pick', [type, indexer], options)
}
// ------------------------------------------------------------------
// Pick
// ------------------------------------------------------------------
/** Applies a Pick action using the given types. */
export type TPick<Type extends TSchema, Indexer extends TSchema> = (
  TInstantiate<{}, TPickDeferred<Type, Indexer>>
)
/** Applies a Pick action using the given types. */
export function Pick<Type extends TSchema, Indexer extends PropertyKey[]>(type: Type, indexer: readonly [...Indexer], options?: TSchemaOptions): TPick<Type, TKeysToIndexer<Indexer>>
/** Applies a Pick action using the given types. */
export function Pick<Type extends TSchema, Indexer extends TSchema>(type: Type, indexer: Indexer, options?: TSchemaOptions): TPick<Type, Indexer> 
/** Applies a Pick action using the given types. */
export function Pick(type: TSchema, indexer_or_keys: PropertyKey[] | TSchema, options: TSchemaOptions = {}): never {
  const indexer = Guard.IsArray(indexer_or_keys) ? KeysToIndexer(indexer_or_keys as PropertyKey[]) : indexer_or_keys
  return Instantiate({}, PickDeferred(type, indexer, options)) as never
}
