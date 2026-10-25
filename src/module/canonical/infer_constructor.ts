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
export type XConstructorLike = Type.TConstructor
export function IsConstructorLike(schema: Schema.XSchema): schema is XConstructorLike {
  return Schema.IsSchemaObject(schema) 
    && Guard.HasPropertyKey(schema, 'type') 
    && Guard.HasPropertyKey(schema, 'parameters') 
    && Guard.HasPropertyKey(schema, 'instanceType') 
    && Guard.IsEqual(schema.type, 'constructor') 
    && Guard.IsArray(schema.parameters) 
    && schema.parameters.every((schema) => Schema.IsSchema(schema)) 
    && Guard.IsObject(schema.instanceType)
}
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
export function InferConstructor(stack: Schema.XStack, schema: XConstructorLike): Type.TSchema {
  const parameters = schema.parameters.map((schema) => InferType(stack, schema))
  const instanceType = InferType(stack, schema.instanceType)
  return Type.Constructor(parameters, instanceType)
}
