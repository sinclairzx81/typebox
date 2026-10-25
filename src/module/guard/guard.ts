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

// ------------------------------------------------------------------
// Vocabulary
// ------------------------------------------------------------------
const Vocabulary = new Set([
  '$anchor',
  '$defs',
  '$dynamicAnchor',
  '$dynamicRef',
  '$id',
  '$recursiveAnchor',
  '$recursiveRef',
  '$ref',
  '$schema',
  'additionalItems',
  'additionalProperties',
  'allOf',
  'anyOf',
  'const',
  'contains',
  'description',
  'default',
  'dependencies',
  'dependentRequired',
  'dependentSchemas',
  'else',
  'enum',
  'exclusiveMaximum',
  'exclusiveMinimum',
  'format',
  'if',
  'items',
  'maxContains',
  'maxItems',
  'maxLength',
  'maxProperties',
  'maximum',
  'minContains',
  'minItems',
  'minLength',
  'minProperties',
  'minimum',
  'multipleOf',
  'not',
  'oneOf',
  'pattern',
  'patternProperties',
  'prefixItems',
  'properties',
  'propertyNames',
  'required',
  'then',
  'type',
  'unevaluatedItems',
  'unevaluatedProperties',
  'uniqueItems'
])
// ------------------------------------------------------------------
// IsJsonModule
// ------------------------------------------------------------------
function HasDisallowedKeys(value: Record<PropertyKey, unknown>, disallowed: ReadonlySet<string>): boolean {
  return Guard.Keys(value).some((key) => disallowed.has(key))
}
const JsonModuleAllowed = new Set(['$defs', '$schema', 'description'])
const JsonModuleDisallowed = new Set([...Vocabulary].filter((key) => !JsonModuleAllowed.has(key)))
/** Returns true if the value is a Schema.XDefs Json Definition module  */
export function IsJsonModule(value: unknown): value is Schema.XDefs {
  return Guard.IsObject(value) 
    && !IsType(value) 
    && !HasDisallowedKeys(value, JsonModuleDisallowed)
    && Schema.IsDefs(value) 
}
// ------------------------------------------------------------------
// IsTypeModule
// ------------------------------------------------------------------
/** Returns true if the value is a Type.TModule */
export function IsTypeModule(value: unknown): value is Type.TModule {
  return Guard.IsObject(value) 
    && Guard.Keys(value).every((key) => IsType(value[key])) 
    && !Guard.IsEqual(Guard.Keys(value).length, 0)
}
// ------------------------------------------------------------------
// IsJson
// ------------------------------------------------------------------
/** Returns true if the value is Schema.XSchema */
export function IsJson(value: unknown): value is Schema.XSchema {
  return Guard.IsBoolean(value) || (
    Guard.IsObject(value) 
    && !IsJsonModule(value) 
    && !IsType(value)
  )
}
// ------------------------------------------------------------------
// IsType
// ------------------------------------------------------------------
/** Returns true if the value is a Type.TSchema */
export function IsType(value: unknown): value is Type.TSchema {
  return Guard.IsObject(value) && (
    Guard.HasPropertyKey(value, '~kind') ||
    Guard.HasPropertyKey(value, '~refine') ||
    Guard.HasPropertyKey(value, '~unsafe')
  )
}
