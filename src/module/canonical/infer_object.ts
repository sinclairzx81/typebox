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

import { Guard } from '../../guard/index.ts'
import * as Schema from '../../schema/index.ts'
import * as Type from '../../type/index.ts'
import { InferType } from './infer_type.ts'

// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
type XObjectLike = { type: 'object' } // not { patternProperties: {} }
                                      // not { propertyNames: {} }
export function IsObjectLike(schema: Schema.XSchema): schema is XObjectLike {
  return Schema.IsSchemaObject(schema) 
    && Schema.IsType(schema) 
    && Guard.IsEqual(schema.type, 'object')
    && !Schema.IsPatternProperties(schema)
    && !Schema.IsPropertyNames(schema)
}
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
export function InferObject(stack: Schema.XStack, schema: XObjectLike): Type.TObject {
  const properties = Schema.IsProperties(schema) ? schema.properties : {}
  const required = Schema.IsRequired(schema) ? schema.required : []
  const keys = Guard.Keys(properties)
  // declared 
  const declared = keys.reduce<Type.TProperties>((result, key) => {
    const inferred = InferType(stack, properties[key])
    const property = required.includes(key) ? inferred : Type.Optional(inferred)
    return { ...result, [key]: property }
  }, {})
  // undeclared
  const undeclared = required.reduce<Type.TProperties>((result, key) => {
    return keys.includes(key) ? result : { ...result, [key]: Type.Unknown() }
  }, {})
  return Type.Object({ ...declared, ...undeclared })
}
