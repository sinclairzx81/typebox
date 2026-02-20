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

import { Settings } from '../../system/system.ts'
import { Arguments } from '../../system/arguments/index.ts'
import { type TLocalizedValidationError } from '../../error/errors.ts'
import { type TProperties, type TSchema, type StaticParse } from '../../type/index.ts'

import { AssertError } from '../assert/index.ts'
import { Check } from '../check/index.ts'
import { Errors } from '../errors/index.ts'
import { Clean } from '../clean/index.ts'
import { Clone } from '../clone/index.ts'
import { Convert } from '../convert/index.ts'
import { Default } from '../default/index.ts'
import { Pipeline } from '../pipeline/index.ts'

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
export class ParseError extends AssertError {
  constructor(value: unknown, errors: TLocalizedValidationError[]) {
    super('Parse', value, errors)
  }
}
function Assert(context: TProperties, type: TSchema, value: unknown): unknown {
  if (!Check(context, type, value)) throw new ParseError(value, Errors(context, type, value))
  return value
}
// ------------------------------------------------------------------
// Parser
// ------------------------------------------------------------------
export const Parser = Pipeline([
  (_context, _type, value) => Clone(value),
  (context, type, value) => Default(context, type, value),
  (context, type, value) => Convert(context, type, value),
  (context, type, value) => Clean(context, type, value),
  (context, type, value) => Assert(context, type, value)
])
/**  Parses a value with the given type. */
export function Parse<const Type extends TSchema, 
  Result extends unknown = StaticParse<Type>
>(type: Type, value: unknown): Result

/**  Parses a value with the given type. */
export function Parse<Context extends TProperties, const Type extends TSchema, 
  Result extends unknown = StaticParse<Type, Context>
>(context: Context, type: Type, value: unknown): Result

/**  Parses a value with the given type. */
export function Parse(...args: unknown[]): never {
  const [context, type, value] = Arguments.Match<[TProperties, TSchema, unknown]>(args, {
    3: (context, type, value) => [context, type, value],
    2: (type, value) => [{}, type, value],
  })
  const checked = Check(context, type, value)
  if(checked) return value as never
  if(Settings.Get().correctiveParse) return Parser(context, type, value) as never
  throw new ParseError(value, Errors(context, type, value))
}