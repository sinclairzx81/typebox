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
// deno-lint-ignore-file

import type { TProperties, TObject } from '../../type/index.ts'
import { Guard } from '../../guard/index.ts'
import { FromType } from './from-type.ts'

import { IsAdditionalProperties } from '../../schema/types/index.ts'

export function FromObject(context: TProperties, type: TObject, value: unknown): unknown {
  if (!Guard.IsObject(value)) return value

  const knownPropertyKeys = Guard.Keys(type.properties)
  // Properties
  for (const key of knownPropertyKeys) {
    // note: we need to traverse into the object and test if the return value
    // yielded a non undefined result. Here we interpret an undefined result as
    // a non assignable property and continue.
    const propertyValue = FromType(context, type.properties[key], value[key])
    if (Guard.IsUndefined(propertyValue)) continue
    value[key] = FromType(context, type.properties[key], value[key])
  }
  // return if not additional properties
  if (!IsAdditionalProperties(type)) return value
  
  // AdditionalProperties
  for (const key of Guard.Keys(value)) {
    if (knownPropertyKeys.includes(key)) continue
    value[key] = FromType(context, type.additionalProperties, value[key])
  }
  return value
}