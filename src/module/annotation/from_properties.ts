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
import * as Type from '../../type/index.ts'
import { FromType } from './from_type.ts'

// ------------------------------------------------------------------
// PropertyKey
// ------------------------------------------------------------------
const IdentifierPattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/
function PropertyKey(key: string): string {
  return IdentifierPattern.test(key) ? key : `${JSON.stringify(key)}`
}
// ------------------------------------------------------------------
// FromProperty
// ------------------------------------------------------------------
function FromProperty(context: Type.TProperties, key: string, type: Type.TSchema): string {
  const isOptional = Type.IsOptional(type)
  const isReadonly = Type.IsReadonly(type)
  const propertyKey = PropertyKey(key)
  return (
    isOptional && isReadonly ? `readonly ${propertyKey}?: ${FromType(context, type)}` :
    !isOptional && isReadonly ? `readonly ${propertyKey}: ${FromType(context, type)}` :
    isOptional && !isReadonly ? `${propertyKey}?: ${FromType(context, type)}` :
    `${propertyKey}: ${FromType(context, type)}`
  )
}
export function FromProperties(context: Type.TProperties, properties: Type.TProperties): string {
  const keys = Guard.Keys(properties)
  if (Guard.IsEqual(keys.length, 0)) return `{}`
  const mapped = keys.map(key => FromProperty(context, key, properties[key]))
  return `{ ${mapped.join(', ')} }`
}
