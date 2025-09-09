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
import { Guard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TCyclic, Cyclic } from '../../types/cyclic.ts'
import { type TObject, Object } from '../../types/object.ts'

import { type TCyclicDependencies, CyclicDependencies } from '../cyclic/dependencies.ts'
import { type TInterfaceDeferred, IsInterfaceDeferred } from '../../action/index.ts'
import { type TInstantiateProperties, InstantiateProperties } from '../instantiate.ts'
import { type TInstantiateTypes, InstantiateTypes } from '../instantiate.ts'
import { type TEvaluateIntersect, EvaluateIntersect } from '../evaluate/evaluate.ts'

// ------------------------------------------------------------------
//
// CyclicInterface | ModuleInstantiation
//
// InterfaceDeferred is treated as a cyclic candidate and therefore
// must be instantiated here. The key difference in cyclic cases is
// that we do not instantiate the interfaces referential sub types.
//
// By omitting the Context during property instantiation, TRef
// instances are preserved on the interface. This is different
// to Heritage as these need to be sourced from the Context.
//
// ------------------------------------------------------------------
type TCyclicInterface<Context extends TProperties, Heritage extends TSchema[], Properties extends TProperties,
  InstantiatedHeritage extends TSchema[] = TInstantiateTypes<Context, { callstack: [] }, Heritage>,
  instantiatedProperties extends TProperties = TInstantiateProperties<{}, { callstack: [] }, Properties>,
  EvaluatedInterface extends TSchema = TEvaluateIntersect<[...InstantiatedHeritage, TObject<instantiatedProperties>]>
> = EvaluatedInterface

function CyclicInterface<Context extends TProperties, Heritage extends TSchema[], Properties extends TProperties>
  (context: Context, heritage: [...Heritage], properties: Properties): 
    TCyclicInterface<Context, Heritage, Properties> {
  const instantiatedHeritage = InstantiateTypes(context, { callstack: [] }, heritage) as TSchema[]
  const instantiatedProperties = InstantiateProperties({}, { callstack: [] }, properties)
  const evaluatedInterface = EvaluateIntersect([...instantiatedHeritage, Object(instantiatedProperties)])
  return evaluatedInterface as never
}
// ------------------------------------------------------------------
// CyclicDefinitions
// ------------------------------------------------------------------
type TCyclicDefinitions<Context extends TProperties, Dependencies extends string[],
  Result extends TProperties = {
  [Key in Extract<keyof Context, Dependencies[number]>]: 
    Context[Key] extends TInterfaceDeferred<infer Heritage extends TSchema[], infer Properties extends TProperties>
      ? TCyclicInterface<Context, Heritage, Properties>
      : Context[Key]
}> = Result
function CyclicDefinitions<Context extends TProperties, Dependencies extends string[]>
  (context: Context, dependencies: [...Dependencies]): 
    TCyclicDefinitions<Context, Dependencies> {
  const keys = Guard.Keys(context).filter(key => dependencies.includes(key))
  return keys.reduce((result, key) => {
    const type = context[key]
    const instantiatedType = IsInterfaceDeferred(type) ? CyclicInterface(context, 
      type.parameters[0] as TSchema[], 
      type.parameters[1] as TProperties
    ) : type
    return { ...result, [key]: instantiatedType }
  }, {}) as never
}
// ------------------------------------------------------------------
// InstantiateCyclic
// ------------------------------------------------------------------
export type TInstantiateCyclic<Context extends TProperties, Ref extends string, Type extends TSchema,
  Dependencies extends string[] = TCyclicDependencies<Context, Ref, Type>,
  Definitions extends TProperties = TCyclicDefinitions<Context, Dependencies>,
  Result extends TSchema = TCyclic<Definitions, Ref>
> = Result
export function InstantiateCyclic<Context extends TProperties, Ref extends string, Type extends TSchema>
  (context: Context, ref: Ref, type: Type):
  TInstantiateCyclic<Context, Ref, Type> {
  const dependencies = CyclicDependencies(context, ref, type) as string[]
  const definitions = CyclicDefinitions(context, dependencies) as TProperties
  const result = Cyclic(definitions, ref)
  return result as never
}