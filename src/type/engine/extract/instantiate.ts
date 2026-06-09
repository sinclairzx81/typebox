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

import { Memory } from '../../../system/memory/index.ts'
import { type TSchema, type TSchemaOptions } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'
import { type TExtractDeferred, ExtractDeferred } from '../../action/extract.ts'
import { type TExtractOperation, ExtractOperation } from './operation.ts'

// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
export type TExtractAction<Left extends TSchema, Right extends TSchema,
  Result extends TSchema = TCanInstantiate<[Left, Right]> extends true
    ? TExtractOperation<Left, Right>
    : TExtractDeferred<Left, Right>
> = Result
export function ExtractAction<Left extends TSchema, Right extends TSchema>(left: Left, right: Right, options: TSchemaOptions): TExtractAction<Left, Right> {
  const result = CanInstantiate([left, right])
    ? Memory.Update(ExtractOperation(left, right), {}, options)
    : ExtractDeferred(left, right, options)
  return result as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TExtractInstantiate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema,
  InstantiatedLeft extends TSchema = TInstantiateType<Context, State, Left>,
  InstantiatedRight extends TSchema = TInstantiateType<Context, State, Right>
> = TExtractAction<InstantiatedLeft, InstantiatedRight>

export function ExtractInstantiate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema>
  (context: Context, state: State, left: Left, right: Right, options: TSchemaOptions): 
    TExtractInstantiate<Context, State,Left, Right> {
  const instantiatedLeft = InstantiateType(context, state, left)
  const instantiatedRight = InstantiateType(context, state, right)
  return ExtractAction(instantiatedLeft, instantiatedRight, options) as never
}