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

import type { TProperties, TObject, TSchema } from '../../type/index.ts'
import { Guard } from '../../guard/index.ts'
import { Check } from '../check/index.ts'
import { Create } from '../create/index.ts'

import { IsAdditionalProperties } from '../../schema/types/index.ts'

import { FromType } from './from-type.ts'

export function FromObject(context: TProperties, type: TObject, value: unknown): unknown {
  if (Check(context, type, value)) return value
  if(!Guard.IsObjectNotArray(value)) return Create(context, type)
  // Dependencies
  const required = new Set(Guard.IsUndefined(type.required) ? [] : type.required)
  // Properties
  const result = {} as Record<PropertyKey, unknown>
  for (const [key, schema] of Guard.Entries<TSchema>(type.properties)) {
    if (!required.has(key) && Guard.IsUndefined(value[key])) continue
    result[key] = key in value
      ? FromType(context, schema, value[key])
      : Create(context, schema)
  }
  // AdditionalProperties
  const evaluatedKeys = Guard.Keys(type.properties)
  if (IsAdditionalProperties(type) && Guard.IsObject(type.additionalProperties)) {
    for (const key of Guard.Keys(value)) {
      if (evaluatedKeys.includes(key)) continue
      result[key] = FromType(context, type.additionalProperties, value[key])
    }
  }
  return result
}
