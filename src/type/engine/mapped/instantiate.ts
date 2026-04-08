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

import { Memory } from '../../../system/memory/index.ts'
import { type TSchema, type TSchemaOptions } from '../../types/schema.ts'
import { type TLiteral, IsLiteralNumber, IsLiteralString } from '../../types/literal.ts'
import { type TObject, Object } from '../../types/object.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TIdentifier } from '../../types/identifier.ts'
import { type TTemplateLiteral, IsTemplateLiteral } from '../../types/template-literal.ts'
import { type TMappedDeferred, MappedDeferred } from '../../action/mapped.ts'
import { type TTemplateLiteralDecode, TemplateLiteralDecode } from '../template-literal/decode.ts'

import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'
import { type TMappedVariants, MappedVariants } from './mapped-variants.ts'
import { type TEvaluateIntersect, EvaluateIntersect } from '../evaluate/index.ts'

// ------------------------------------------------------------------
// CanonicalAs
// ------------------------------------------------------------------
type TCanonicalAs<InstantiatedAs extends TSchema,
  Result extends TSchema = InstantiatedAs extends TTemplateLiteral<infer Pattern extends string> 
    ? TTemplateLiteralDecode<Pattern> 
    : InstantiatedAs
> = Result
function CanonicalAs<InstantiatedAs extends TSchema>(instantiatedAs: InstantiatedAs): TCanonicalAs<InstantiatedAs> {
  const result = IsTemplateLiteral(instantiatedAs) ? TemplateLiteralDecode(instantiatedAs.pattern): instantiatedAs
  return result as never
}
// ------------------------------------------------------------------
// MappedVariant
// ------------------------------------------------------------------
type TMappedVariant<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Variant extends TSchema, As extends TSchema, Property extends TSchema,
  VariantContext extends TProperties = Memory.TAssign<Context, { [_ in Identifier['name']]: Variant }>,
  InstantiatedAs extends TSchema = TInstantiateType<VariantContext, State, As>,
  CanonicalAs extends TSchema = TCanonicalAs<InstantiatedAs>,
  InstantiatedProperty extends TSchema = TInstantiateType<VariantContext, State, Property>,
  Result extends TProperties = CanonicalAs extends TLiteral<string | number>
    ? { [_ in CanonicalAs['const']]: InstantiatedProperty }
    : {}
> = Result
function MappedVariant<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Variant extends TSchema, As extends TSchema, Property extends TSchema>
  (context: Context, state: State, identifier: Identifier, variant: Variant, as: As, property: Property): 
    TMappedVariant<Context, State, Identifier, Variant, As, Property> {
  const variantContext = Memory.Assign(context, { [identifier['name']]: variant })
  const instantiatedAs = InstantiateType(variantContext, state, as)
  const canonicalAs = CanonicalAs(instantiatedAs)
  const instantiatedProperty = InstantiateType(variantContext, state, property)
  return (IsLiteralNumber(canonicalAs) || IsLiteralString(canonicalAs)
    ? { [canonicalAs.const]: instantiatedProperty }
    : {}) as never
}
// ------------------------------------------------------------------
// MappedProperties
// ------------------------------------------------------------------
type TMappedProperties<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Variants extends TSchema[], As extends TSchema, Property extends TSchema, Result extends TProperties[] = []> = (
  Variants extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TMappedProperties<Context, State, Identifier, Right, As, Property, [...Result, TMappedVariant<Context, State, Identifier, Left, As, Property>]>
    : Result
)
function MappedProperties<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Variants extends TSchema[], As extends TSchema, Property extends TSchema>
  (context: Context, state: State, identifier: Identifier, variants: [...Variants], as: As, property: Property): 
    TMappedProperties<Context, State, Identifier, Variants, As, Property> {
  return variants.reduce((result, left) => {
    return [...result, MappedVariant(context, state, identifier, left, as, property) ]
  }, [] as TProperties[]) as never
}
// ------------------------------------------------------------------
// MappedObjects
// ------------------------------------------------------------------
type TReduceProperties<Properties extends TProperties[], Result extends TSchema[] = []> = (
  Properties extends [infer Left extends TProperties, ...infer Right extends TProperties[]]
    ? TReduceProperties<Right, [...Result, TObject<Left>]>
    : Result
)
function MappedObjects<Properties extends TProperties[]>(properties: [...Properties]): TReduceProperties<Properties> {
  return properties.reduce<TSchema[]>((result, left) => {
    return [...result, Object(left)]
  }, []) as never
}
// ------------------------------------------------------------------
// MappedAction
// ------------------------------------------------------------------
type TMappedAction<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Type extends TSchema, As extends TSchema, Property extends TSchema,
  Variants extends TSchema[] = TMappedVariants<Type>,
  MappedProperties extends TProperties[] = TMappedProperties<Context, State, Identifier, Variants, As, Property>,
  MappedObjects extends TSchema[] = TReduceProperties<MappedProperties>,
  Result extends TSchema = TEvaluateIntersect<MappedObjects>
> = Result
function MappedAction<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Type extends TSchema, As extends TSchema, Property extends TSchema>
  (context: Context, state: State, identifier: Identifier, type: Type, as: As, property: Property): 
    TMappedAction<Context, State, Identifier, Type, As, Property> {
  const variants = MappedVariants(type) as TSchema[]
  const mappedProperties = MappedProperties(context, state, identifier, variants, as, property) as TProperties[]
  const mappedObjects = MappedObjects(mappedProperties) as TSchema[]
  const result = EvaluateIntersect(mappedObjects)
  return result as never
}
// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TMappedImmediate<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Type extends TSchema, As extends TSchema, Property extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>,
> = TMappedAction<Context, State, Identifier, InstantiatedType, As, Property>

function MappedImmediate<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Type extends TSchema, As extends TSchema, Property extends TSchema>
  (context: Context, state: State, identifier: Identifier, type: Type, as: As, property: Property, options: TSchemaOptions): 
    TMappedImmediate<Context, State, Identifier, Type, As, Property> {
  const instantiatedType = InstantiateType(context, state, type)
  return Memory.Update(MappedAction(context, state, identifier, instantiatedType, as, property), {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TMappedInstantiate<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Type extends TSchema, As extends TSchema, Property extends TSchema> 
  = TCanInstantiate<Context, [Type]> extends true
    ? TMappedImmediate<Context, State, Identifier, Type, As, Property>
    : TMappedDeferred<Identifier, Type, As, Property>

export function MappedInstantiate<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Type extends TSchema, As extends TSchema, Property extends TSchema>
  (context: Context, state: State, identifier: Identifier, type: Type, as: As, property: Property, options: TSchemaOptions): 
    TMappedInstantiate<Context, State,Identifier, Type, As, Property> {
  return (
    CanInstantiate(context, [type])
      ? MappedImmediate(context, state, identifier, type, as, property, options)
      : MappedDeferred(identifier, type, as, property, options)
  ) as never
}