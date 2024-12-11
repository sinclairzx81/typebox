
/*--------------------------------------------------------------------------

@sinclair/typebox/prototypes

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { Static, Kind, TSchema, TObject, SchemaOptions, CreateType, TLiteral, TypeRegistry, ValueGuard, KindGuard, TUnion } from '@sinclair/typebox'
import { GetErrorFunction, SetErrorFunction } from 'src/errors/function'
import { Value } from '@sinclair/typebox/value'

// ------------------------------------------------------------------
// DiscriminatedUnionError
// ------------------------------------------------------------------
const errorFunction = GetErrorFunction()

// prettier-ignore
SetErrorFunction((parameter) => {
  if (parameter.schema[Kind] !== 'DiscriminatedUnion') {
    return errorFunction(parameter)
  }
  const union = parameter.schema as TDiscriminatedUnion
  // Try generate error when value matches known discriminator literal
  if (ValueGuard.IsObject(parameter.value) && union.discriminator in parameter.value) {
    const variant = parameter.schema.anyOf.find((variant: TSchema) => union.discriminator in variant.properties
      && (variant.properties[union.discriminator] as TLiteral).const ===
      (parameter.value as Record<PropertyKey, unknown>)[union.discriminator])
    if (KindGuard.IsSchema(variant)) {
      const literal = variant.properties[union.discriminator]
      return `Invalid value for DiscriminatedUnion variant '${literal.const}'`
    }
  }
  // Return generic error containing possible discriminator types.
  const options = union.anyOf.map(object => object.properties[union.discriminator].const) as string[]
  return `Expected value of ${options.map(option => `'${option}'`).join(', ')} for DiscriminatedUnion`
})

// ------------------------------------------------------------------
// TDiscriminatedUnionObject
//
// Constructs a base TObject type requiring 1 discriminator property
// ------------------------------------------------------------------
// prettier-ignore
type TDiscriminatedUnionProperties<Discriminator extends string> = {
  [_ in Discriminator]: TLiteral
}
// prettier-ignore
type TDiscriminatedUnionObject<Discriminator extends string> = TObject<TDiscriminatedUnionProperties<Discriminator>>

// ------------------------------------------------------------------
// DiscriminatedUnion
// ------------------------------------------------------------------
// prettier-ignore
TypeRegistry.Set('DiscriminatedUnion', (schema: TDiscriminatedUnion, value) => {
  return schema.anyOf.some(variant => Value.Check(variant, [], value))
})
// prettier-ignore
export interface TDiscriminatedUnion<Discriminator extends string = string, Types extends TObject[] = TObject[]> extends TSchema {
  [Kind]: 'DiscriminatedUnion'
  static: Static<TUnion<Types>>
  discriminator: Discriminator
  anyOf: Types
}

/** Creates a DiscriminatedUnion. */
// prettier-ignore
export function DiscriminatedUnion<Discriminator extends string, Types extends TDiscriminatedUnionObject<Discriminator>[]>(
  discriminator: Discriminator, types: [...Types], options?: SchemaOptions
): TDiscriminatedUnion<Discriminator, Types> {
  return CreateType({ [Kind]: 'DiscriminatedUnion', anyOf: types, discriminator }, options) as never
}



