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

import { type TSchema } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TObject, Object } from '../../types/object.ts'
import { type TFromType, FromType } from './from-type.ts'

export type TCollapseToObject<Type extends TSchema,
  Properties extends TProperties = TFromType<Type>,
  Result extends TSchema = TObject<Properties>
> = Result
/**
 * Collapses a type into a TObject schema. This is a lossy fast path used to 
 * normalize arbitrary TSchema types into a TObject structure. This function is 
 * primarily used in indexing operations where a normalized object structure 
 * is required. If the type cannot be collapsed, an empty object schema is returned. 
 */
export function CollapseToObject<Type extends TSchema>(type: Type): TCollapseToObject<Type> {
  const properties = FromType(type)
  const result = Object(properties)
  return result as never
}
