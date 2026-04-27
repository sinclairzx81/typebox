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

import { type TLocalizedValidationError } from 'typebox/error'
import { type TSchema } from 'typebox'
import Value from 'typebox/value'
import Guard from 'typebox/guard'

function ApplyCustomError(schema: TSchema, error: TLocalizedValidationError): TLocalizedValidationError {
  const subschema = Value.Pointer.Get(schema, error.schemaPath.slice(1))! // trim '#' in URI fragment
  const errorMessage = Guard.IsObject(subschema)                          // use guard to check for `errorMessage` structures
    && Guard.HasPropertyKey(subschema, 'errorMessage') 
    && Guard.IsString(subschema.errorMessage) 
    ? subschema.errorMessage 
    : error.message
  return { ...error, message: errorMessage }
}
/** Application Defined Value.Errors() function that supports overriding error messages with a `errorMessage` property   */
export function CustomErrors(type: TSchema, value: unknown): TLocalizedValidationError[] {
  return Value.Errors(type, value).map(error => ApplyCustomError(type, error))
}
