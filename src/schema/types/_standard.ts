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
import type { XSchema } from './schema.ts'

export interface XStandardValidatorV1 {
  version: 1
  vendor: string
  validate: (...args: unknown[]) => object // { value: unknown } | { issues: object[] }
}
export interface XStandardSchemaV1<Validator extends XStandardValidatorV1 = XStandardValidatorV1> {
  '~standard': Validator
}

// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** 
 * Returns true if the schema contains an '~standard` keyword
 * @specification 'StandardSchema'
 */
export function IsStandardSchemaV1(value: XSchema): value is XStandardSchemaV1 {
  return Guard.HasPropertyKey(value, '~standard')
    && Guard.IsObject(value["~standard"])
    && Guard.HasPropertyKey(value['~standard'], 'version')
    && Guard.HasPropertyKey(value['~standard'], 'vendor')
    && Guard.HasPropertyKey(value['~standard'], 'validate')
    && Guard.IsEqual(value['~standard'].version, 1)
    && Guard.IsString(value['~standard'].vendor)
    && Guard.IsFunction(value['~standard'].validate)
}