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

import { Memory } from '../../../system/memory/index.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TState, type TInstantiateType, CanInstantiate, InstantiateType, TCanInstantiate } from '../instantiate.ts'
import { type TOptionsDeferred, type TOptions, OptionsDeferred } from '../../action/options.ts'

// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TOptionsImmediate<Context extends TProperties, State extends TState, Type extends TSchema, Options extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>,
  Result extends TSchema = TOptions<InstantiatedType, Options>
> = Result
function OptionsImmediate<Context extends TProperties, State extends TState, Type extends TSchema, Options extends TSchema>
  (context: Context, state: State, type: Type, options: Options): 
    TOptionsImmediate<Context, State, Type, Options> {
  const instaniatedType = InstantiateType(context, state, type)
  return Memory.Update(instaniatedType, {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TOptionsInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, Options extends TSchema>
  = TCanInstantiate<Context, [Type]> extends true
    ? TOptionsImmediate<Context, State, Type, Options>
    : TOptionsDeferred<Type, Options>

export function OptionsInstantiate<Context extends TProperties, State extends TState, Type extends TSchema, Options extends TSchema>
  (context: Context, state: State, type: Type, options: Options): 
    TOptionsInstantiate<Context, State, Type, Options> {
  return (
    CanInstantiate(context, [type])
      ? OptionsImmediate(context, state, type, options)
      : OptionsDeferred(type, options)
  ) as never
}