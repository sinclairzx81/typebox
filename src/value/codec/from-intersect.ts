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
import { type TIntersect, type TProperties, type TSchema, IsObject, IsOptional } from '../../type/index.ts'
import { FromType } from './from-type.ts'
import { Callback } from './callback.ts'

// ------------------------------------------------------------------
// ProcessIntersectSchemas
// ------------------------------------------------------------------
// Processes intersection schemas while tracking which properties have been
// handled to prevent duplicate codec execution. When the same property appears
// in multiple schemas within an intersection, only the first occurrence is
// processed to avoid running codecs multiple times.
function ProcessIntersectSchemas(
  direction: string, 
  context: TProperties, 
  schemas: TSchema[], 
  value: unknown
): unknown {
  const nonProcessedKeys = new Set<string>()

  // make sure we don't process optional undefined values
  for (const schema of schemas) {
    if (!IsObject(schema) || !Guard.IsObjectNotArray(value)) continue;
    for (const key of Guard.Keys(schema.properties)) {
      if (nonProcessedKeys.has(key)) continue
      if (!Guard.IsUndefined(value[key]) || !IsOptional(schema.properties[key])) {
        nonProcessedKeys.add(key)
      }
    }
  }
  
  for (const schema of schemas) {
    if (IsObject(schema)) {
      // For object schemas, manually process properties that haven't been seen yet
      if (!Guard.IsObjectNotArray(value)) continue
      
      for (const key of Guard.Keys(schema.properties)) {
        if (nonProcessedKeys.has(key) && Guard.HasPropertyKey(value, key)) {
          // Process this property through its codec
          value[key] = FromType(direction, context, schema.properties[key], value[key])
          nonProcessedKeys.delete(key)
        }
      }
    } else {
      // For non-object schemas, process the entire value
      value = FromType(direction, context, schema, value)
    }
  }
  
  return value
}
// ------------------------------------------------------------------
// Decode
// ------------------------------------------------------------------
function Decode(direction: string, context: TProperties, type: TIntersect, value: unknown): unknown {
  value = ProcessIntersectSchemas(direction, context, type.allOf, value)
  return Callback(direction, context, type, value)
}
// ------------------------------------------------------------------
// Encode
// ------------------------------------------------------------------
function Encode(direction: string, context: TProperties, type: TIntersect, value: unknown): unknown {
  let exterior = Callback(direction, context, type, value)
  exterior = ProcessIntersectSchemas(direction, context, type.allOf, exterior)
  return exterior
}
export function FromIntersect(direction: string, context: TProperties, type: TIntersect, value: unknown): unknown {
  return Guard.IsEqual(direction, 'Decode')
    ? Decode(direction, context, type, value)
    : Encode(direction, context, type, value)
}
