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
export interface XPattern<Pattern extends string | RegExp = string | RegExp> {
  pattern: Pattern
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** 
 * Returns true if the schema contains a valid pattern property
 * @specification Json Schema 7
 */
export function IsPattern(schema: XSchemaObject): schema is XPattern {
  return Guard.HasPropertyKey(schema, 'pattern') 
    && (Guard.IsString(schema.pattern)
    || schema.pattern instanceof RegExp)
}