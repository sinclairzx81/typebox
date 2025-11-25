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

import { Arguments } from '../system/arguments/index.ts'
import { type TProperties, type TSchema } from '../type/index.ts'
import { Validator } from './validator.ts'

/** Compiles a type into a high performance Validator */
export function Compile<const Type extends TSchema,
  Result extends Validator = Validator<{}, Type>
>(type: Type): Result

/** Compiles a type into a high performance Validator */
export function Compile<Context extends TProperties, const Type extends TSchema,
  Result extends Validator = Validator<{}, Type>
>(context: Context, type: Type): Result

/** Compiles a type into a high performance Validator */
export function Compile(...args: unknown[]): Validator {
  const [context, type] = Arguments.Match<[TProperties, TSchema]>(args, {
    2: (context, type) => [context, type],
    1: (type) => [{}, type]
  })
  return new Validator(context, type)
}
