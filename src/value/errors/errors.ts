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

import { Arguments } from '../../system/arguments/index.ts'
import type { TProperties, TSchema } from '../../type/index.ts'
import type { TLocalizedValidationError } from '../../error/index.ts'
import { Errors as SchemaErrors,  } from '../../schema/index.ts'

/** 
 * Performs an exhaustive Check on the specified value and reports any errors found.
 * If no errors are found, an empty array is returned. Unlike Check, this function
 * does not terminate at the first occurance of an error. For best performance, call 
 * Check first and call Errors only if Check returns false.
 */
export function Errors<Type extends TSchema>(type: Type, value: unknown): TLocalizedValidationError[]

/** 
 * Performs an exhaustive Check on the specified value and reports any errors found.
 * If no errors are found, an empty array is returned. Unlike Check, this function
 * does not terminate at the first occurance of an error. For best performance, call 
 * Check first and call Errors only if Check returns false.
 */
export function Errors<Context extends TProperties, Type extends TSchema>(context: Context, type: Type, value: unknown): TLocalizedValidationError[]

/** 
 * Performs an exhaustive Check on the specified value and reports any errors found.
 * If no errors are found, an empty array is returned. Unlike Check, this function
 * does not terminate at the first occurance of an error. For best performance, call 
 * Check first and call Errors only if Check returns false.
 */
export function Errors(...args: unknown[]): TLocalizedValidationError[] {
  const [context, type, value] = Arguments.Match<[TProperties, TSchema, unknown]>(args, {
    3: (context, type, value) => [context, type, value],
    2: (type, value) => [{}, type, value],
  })
  const [_, errors] = SchemaErrors(context, type, value)
  return errors
}