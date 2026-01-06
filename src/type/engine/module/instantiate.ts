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

import { Guard } from '../../../guard/index.ts'
import { Memory } from '../../../system/memory/index.ts'
import { type TSchemaOptions } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TState } from '../instantiate.ts'

// ------------------------------------------------------------------
// Module: Instantiation Infrastructure
// ------------------------------------------------------------------
import { type TCyclicCandidates, CyclicCandidates } from '../cyclic/candidates.ts'
import { type TInstantiateCyclic, InstantiateCyclic } from '../cyclic/instantiate.ts'
import { type TInstantiateType, InstantiateType } from '../instantiate.ts'

// ------------------------------------------------------------------
// InstantiateCyclics
// ------------------------------------------------------------------
type TInstantiateCyclics<Context extends TProperties, CyclicKeys extends string[], Result extends TProperties = {
  [Key in Extract<keyof Context, CyclicKeys[number]>]: TInstantiateCyclic<Context, Key, Context[Key]>
}> = Result
function InstantiateCyclics<Context extends TProperties, CyclicKeys extends string[]>
  (context: Context, cyclicKeys: [...CyclicKeys]):
  TInstantiateCyclics<Context, CyclicKeys> {
  const keys = Guard.Keys(context).filter(key => cyclicKeys.includes(key))
  return keys.reduce((result, key) => {
    return { ...result, [key]: InstantiateCyclic(context, key, context[key]) }
  }, {}) as never
}
// ------------------------------------------------------------------
// InstantiateNonCyclics
// ------------------------------------------------------------------
type TInstantiateNonCyclics<Context extends TProperties, CyclicKeys extends string[], Result extends TProperties = {
  [Key in Exclude<keyof Context, CyclicKeys[number]>]: TInstantiateType<Context, { callstack: [] }, Context[Key]>
}> = Result
function InstantiateNonCyclics<Context extends TProperties, CyclicKeys extends string[]>
  (context: Context, cyclicKeys: [...CyclicKeys]):
  TInstantiateCyclics<Context, CyclicKeys> {
  const keys = Guard.Keys(context).filter(key => !cyclicKeys.includes(key))
  return keys.reduce((result, key) => {
    return { ...result, [key]: InstantiateType(context, { callstack: [] }, context[key]) }
  }, {}) as never
}
// ------------------------------------------------------------------
// InstantiateModule
// ------------------------------------------------------------------
type TInstantiateModule<Context extends TProperties,
  CyclicCandidates extends string[] = TCyclicCandidates<Context>,
  InstantiatedCyclics extends TProperties = TInstantiateCyclics<Context, CyclicCandidates>,
  InstantiatedNonCyclics extends TProperties = TInstantiateNonCyclics<Context, CyclicCandidates>,
  InstantiatedModule extends TProperties = InstantiatedCyclics & InstantiatedNonCyclics
> = { [Key in keyof InstantiatedModule]: InstantiatedModule[Key] } & {} // safe: no-key-overlap
function InstantiateModule<Context extends TProperties>
  (context: Context, options: TSchemaOptions):
  TInstantiateModule<Context> {
  const cyclicCandidates = CyclicCandidates(context) as string[]
  const instantiatedCyclics = InstantiateCyclics(context, cyclicCandidates)
  const instantiatedNonCyclics = InstantiateNonCyclics(context, cyclicCandidates)
  const instantiatedModule = { ...instantiatedCyclics, ...instantiatedNonCyclics }
  return Memory.Update(instantiatedModule, {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TModuleInstantiate<Context extends TProperties, _State extends TState, Properties extends TProperties,
  ModuleContext extends TProperties = Memory.TAssign<Context, Properties>,
  InstantiatedModule extends TProperties = TInstantiateModule<ModuleContext>,
> = InstantiatedModule
export function ModuleInstantiate<Context extends TProperties, State extends TState, Properties extends TProperties>
  (context: Context, _state: State, properties: Properties, options: TSchemaOptions):
  TModuleInstantiate<Context, State, Properties> {
  const moduleContext = Memory.Assign(context, properties)
  const instantiatedModule = InstantiateModule(moduleContext, options)
  return instantiatedModule as never
}