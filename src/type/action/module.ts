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

import { type TSchemaOptions } from '../types/schema.ts'
import { type TProperties } from '../types/properties.ts'
import { type TDeferred, Deferred } from '../types/deferred.ts'
import { type TInstantiate, Instantiate } from '../engine/instantiate.ts'

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
/** Creates a deferred Module action. */
export type TModuleDeferred<Context extends TProperties> = (
  TDeferred<'Module', [Context]>
)
/** Creates a deferred Module action. */
export function ModuleDeferred<Context extends TProperties>(context: Context, options: TSchemaOptions = {}): TModuleDeferred<Context> {
  return Deferred('Module', [context], options)
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Applies a Module transformation action to the embedded property types. */
export type TModule<Context extends TProperties> = (
  TInstantiate<{}, TModuleDeferred<Context>>
)
/** Applies a Module transformation action to the embedded property types. */
export function Module<Context extends TProperties>(context: Context, options: TSchemaOptions = {}): TModule<Context> {
  return Instantiate({}, ModuleDeferred(context, options)) as never
}