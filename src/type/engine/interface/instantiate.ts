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
import { type TObject, Object } from '../../types/object.ts'
import { type TEvaluateIntersect, EvaluateIntersect } from '../evaluate/evaluate.ts'
import { type TInterfaceDeferred, InterfaceDeferred } from '../../action/index.ts'
import { type TState, type TCanInstantiate, CanInstantiate } from '../instantiate.ts'
import { type TInstantiateProperties, InstantiateProperties } from '../instantiate.ts'
import { type TInstantiateTypes, InstantiateTypes } from '../instantiate.ts'

// ------------------------------------------------------------------
// Operation
// ------------------------------------------------------------------
type TInterfaceOperation<Heritage extends TSchema[], Properties extends TProperties,
  Result extends TSchema = TEvaluateIntersect<[...Heritage, TObject<Properties>]>
> = Result
function InterfaceOperation<Heritage extends TSchema[], Properties extends TProperties>
  (heritage: [...Heritage], properties: Properties):
    TInterfaceOperation<Heritage, Properties> {
  const result = EvaluateIntersect([...heritage, Object(properties)])
  return result as never
}
// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
export type TInterfaceAction<Heritage extends TSchema[], Properties extends TProperties,
  Result extends TSchema = TCanInstantiate<Heritage> extends true
  ? TInterfaceOperation<Heritage, Properties>
  : TInterfaceDeferred<Heritage, Properties>
> = Result
export function InterfaceAction<Heritage extends TSchema[], Properties extends TProperties>
  (heritage: [...Heritage], properties: Properties, options: TSchemaOptions):
    TInterfaceAction<Heritage, Properties> {
  const result = CanInstantiate(heritage)
    ? Memory.Update(InterfaceOperation(heritage, properties), {}, options)
    : InterfaceDeferred(heritage, properties, options)
  return result as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TInterfaceInstantiate<Context extends TProperties, State extends TState, Heritage extends TSchema[], Properties extends TProperties,
  InstantiatedHeritage extends TSchema[] = TInstantiateTypes<Context, { callstack: [] }, Heritage>,
  InstantiatedProperties extends TProperties = TInstantiateProperties<Context, { callstack: [] }, Properties>,
> = TInterfaceAction<InstantiatedHeritage, InstantiatedProperties>

export function InterfaceInstantiate<Context extends TProperties, State extends TState, Heritage extends TSchema[], Properties extends TProperties>
  (context: Context, state: State, heritage: [...Heritage], properties: Properties, options: TSchemaOptions):
    TInterfaceInstantiate<Context, State, Heritage, Properties> {
  const instantiatedHeritage = InstantiateTypes(context, state, heritage) as TSchema[]
  const instantiatedProperties = InstantiateProperties(context, state, properties) as TProperties
  return InterfaceAction(instantiatedHeritage, instantiatedProperties, options) as never
}