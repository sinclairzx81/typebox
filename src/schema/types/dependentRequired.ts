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

import { Guard } from '../../guard/index.ts'
import { type XSchemaObject } from './schema.ts'

// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
export interface XDependentRequired<DependentRequired extends Record<PropertyKey, string[]> = Record<PropertyKey, string[]>> {
  dependentRequired: DependentRequired
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** 
 * Returns true if the schema contains a valid dependentRequired property
 * @specification Json Schema 2019-09
 */
export function IsDependentRequired(schema: XSchemaObject): schema is XDependentRequired {
  return Guard.HasPropertyKey(schema, 'dependentRequired') 
    && Guard.IsObject(schema.dependentRequired) 
    && Object.values(schema.dependentRequired).every(value => 
      Guard.IsArray(value) 
      && value.every(value => Guard.IsString(value)))
}