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

import { type TProperties, type TObject, IsSchema } from '../../type/index.ts'
import { Guard } from '../../guard/index.ts'
import { FromType } from './from-type.ts'
import { Check } from '../check/index.ts'

import { GetAdditionalProperties } from './additional.ts'

// ------------------------------------------------------------------
// FromObject
// ------------------------------------------------------------------
export function FromObject(context: TProperties, type: TObject, value: unknown): unknown {
  if (!Guard.IsObject(value) || Guard.IsArray(value)) return value
  
  const additionalProperties = GetAdditionalProperties(type)
  for (const key of Guard.Keys(value)) {
    if (Guard.HasPropertyKey(type.properties, key)) {
      value[key] = FromType(context, type.properties[key], value[key])
      continue
    }
    const unknownCheck = 
      // 1. additionalProperties: true
      (Guard.IsBoolean(additionalProperties) && Guard.IsEqual(additionalProperties, true))
      // 2. additionalProperties: TSchema
      || IsSchema(additionalProperties) && Check(context, additionalProperties, value[key])

    if(unknownCheck) {
      value[key] = FromType(context, additionalProperties, value[key])
      continue
    }
    delete value[key]
  }
  return value
}