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
import { type TTemplateLiteralDeferred, TemplateLiteralDeferred } from '../../types/template-literal.ts'
import { type TTemplateLiteralEncode, TemplateLiteralEncode } from './encode.ts'
import { type TState, type TInstantiateTypes, type TCanInstantiate, InstantiateTypes, CanInstantiate } from '../instantiate.ts'

// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
export type TTemplateLiteralAction<Types extends TSchema[],
  Result extends TSchema = TCanInstantiate<Types> extends true
    ? TTemplateLiteralEncode<Types>
    : TTemplateLiteralDeferred<Types>
> = Result
export function TemplateLiteralAction<Types extends TSchema[]>
  (types: [...Types], options: TSchemaOptions): 
    TTemplateLiteralAction<Types> {
  const result = CanInstantiate(types)
    ? Memory.Update(TemplateLiteralEncode(types), {}, options)
    : TemplateLiteralDeferred(types, options)
  return result as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TTemplateLiteralInstantiate<Context extends TProperties, State extends TState, Types extends TSchema[],
  InstantiatedTypes extends TSchema[] = TInstantiateTypes<Context, State, Types>
> = TTemplateLiteralAction<InstantiatedTypes>

export function TemplateLiteralInstantiate<Context extends TProperties, State extends TState, Types extends TSchema[]>
  (context: Context, state: State, types: [...Types], options: TSchemaOptions): 
    TTemplateLiteralInstantiate<Context, State, Types> {
  const instantiatedTypes = InstantiateTypes(context, state, types) as TSchema[]
  return TemplateLiteralAction(instantiatedTypes, options) as never
}