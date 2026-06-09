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

// deno-lint-ignore-file ban-types
// deno-fmt-ignore-file

import { Guard } from '../../../guard/index.ts'
import { Memory } from '../../../system/memory/index.ts'
import { type TSchemaOptions } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TState, State } from '../instantiate.ts'

// ------------------------------------------------------------------
// Module: Instantiation Infrastructure
// ------------------------------------------------------------------
import { type TCyclicCandidates, CyclicCandidates } from '../cyclic/candidates.ts'
import { type TInstantiateCyclic, InstantiateCyclic } from '../cyclic/instantiate.ts'
import { type TInstantiateType, InstantiateType } from '../instantiate.ts'

// ------------------------------------------------------------------
// InstantiateCyclics
// ------------------------------------------------------------------
type TInstantiateCyclics<Context extends TProperties, Declarations extends TProperties, CyclicKeys extends string[], 
  DeclarationContext extends TProperties = Memory.TAssign<Context, Declarations>,
  Result extends TProperties = {
    [Key in Extract<keyof Declarations, CyclicKeys[number]>]: TInstantiateCyclic<DeclarationContext, Key, Declarations[Key]>
  }
> = Result
function InstantiateCyclics<Context extends TProperties, Declarations extends TProperties, CyclicKeys extends string[]>
  (context: Context, declarations: Declarations, cyclicKeys: [...CyclicKeys]):
  TInstantiateCyclics<Context, Declarations, CyclicKeys> {
  const declarationContext = Memory.Assign(context, declarations)
  const declarationKeys = Guard.Keys(declarations).filter(key => cyclicKeys.includes(key))
  return declarationKeys.reduce((result, key) => {
    return { ...result, [key]: InstantiateCyclic(declarationContext, key, declarations[key]) }
  }, {}) as never
}
// ------------------------------------------------------------------
// InstantiateNonCyclics
// ------------------------------------------------------------------
type TInstantiateNonCyclics<Context extends TProperties, Declarations extends TProperties, CyclicKeys extends string[], 
  DeclarationContext extends TProperties = Memory.TAssign<Context, Declarations>,
  Result extends TProperties = {
    [Key in Exclude<keyof Declarations, CyclicKeys[number]>]: TInstantiateType<DeclarationContext, TState<[], []>, Declarations[Key]>
  }
> = Result
function InstantiateNonCyclics<Context extends TProperties, Declarations extends TProperties, CyclicKeys extends string[]>
  (context: Context, declarations: Declarations, cyclicKeys: [...CyclicKeys]):
  TInstantiateCyclics<Context, Declarations, CyclicKeys> {
  const declarationContext = Memory.Assign(context, declarations)
  const declarationKeys = Guard.Keys(declarations).filter(key => !cyclicKeys.includes(key))
  return declarationKeys.reduce((result, key) => {
    return { ...result, [key]: InstantiateType(declarationContext, State([], []), declarations[key]) }
  }, {}) as never
}
// ------------------------------------------------------------------
// InstantiateModule
// ------------------------------------------------------------------
type TInstantiateModule<Context extends TProperties, Declarations extends TProperties,
  CyclicCandidates extends string[] = TCyclicCandidates<Declarations>,
  InstantiatedCyclics extends TProperties = TInstantiateCyclics<Context, Declarations, CyclicCandidates>,
  InstantiatedNonCyclics extends TProperties = TInstantiateNonCyclics<Context, Declarations, CyclicCandidates>,
  InstantiatedModule extends TProperties = InstantiatedCyclics & InstantiatedNonCyclics
> = { [Key in keyof InstantiatedModule]: InstantiatedModule[Key] } & {} // safe: no-key-overlap
function InstantiateModule<Context extends TProperties, Declarations extends TProperties>
  (context: Context, declarations: Declarations, options: TSchemaOptions):
  TInstantiateModule<Context, Declarations> {
  const cyclicCandidates = CyclicCandidates(declarations) as string[]
  const instantiatedCyclics = InstantiateCyclics(context, declarations, cyclicCandidates)
  const instantiatedNonCyclics = InstantiateNonCyclics(context, declarations, cyclicCandidates)
  const instantiatedModule = { ...instantiatedCyclics, ...instantiatedNonCyclics }
  return Memory.Update(instantiatedModule, {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TModuleInstantiate<Context extends TProperties, _State extends TState, Declarations extends TProperties,
  InstantiatedModule extends TProperties = TInstantiateModule<Context, Declarations>,
> = InstantiatedModule
export function ModuleInstantiate<Context extends TProperties, State extends TState, Declarations extends TProperties>
  (context: Context, _state: State, declarations: Declarations, options: TSchemaOptions):
  TModuleInstantiate<Context, State, Declarations> {
  const instantiatedModule = InstantiateModule(context, declarations, options)
  return instantiatedModule as never
}