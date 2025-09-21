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

import type { Static, TProperties, TSchema } from '../../type/index.ts'
import { Arguments } from '../../system/arguments/index.ts'
import { Check } from '../check/index.ts'
import { Errors } from '../errors/index.ts'

// ------------------------------------------------------------------
// AssertError
// ------------------------------------------------------------------
export class AssertError extends Error {
  declare readonly cause: { source: string; errors: object[]; value: unknown }
  constructor(source: string, value: unknown, errors: object[]) {
    super(source)
    Object.defineProperty(this, 'cause', {
      value: { source, errors, value },
      writable: false,
      configurable: false,
      enumerable: false
    })
  }
}
/** Asserts the a value matches the given type. This function returns a TypeScript type asserts predicate and will throw AssertError if value does not match. */
export function Assert<Context extends TProperties, const Type extends TSchema, Result extends unknown = Static<Type, Context>>(context: Context, type: Type, value: unknown): asserts value is Result

/** Asserts the a value matches the given type. This function returns a TypeScript type asserts predicate and will throw AssertError if value does not match. */
export function Assert<const Type extends TSchema, Result extends unknown = Static<Type>>(type: Type, value: unknown): asserts value is Result

/** Asserts the a value matches the given type. This function returns a TypeScript type asserts predicate and will throw AssertError if value does not match. */
export function Assert(...args: unknown[]): void {
  const [context, type, value] = Arguments.Match<[TProperties, TSchema, unknown]>(args, {
    3: (context, type, value) => [context, type, value],
    2: (type, value) => [{}, type, value]
  })
  const check = Check(context, type, value)
  if (!check) throw new AssertError('Assert', value, Errors(context, type, value))
}
