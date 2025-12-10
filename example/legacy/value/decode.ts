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

import { Arguments } from 'typebox/system'
import { type TLocalizedValidationError } from 'typebox/error'
import { type TProperties, type TSchema, type StaticDecode } from 'typebox'

import { AssertError } from 'typebox/value'
import { Check } from 'typebox/value'
import { Errors } from 'typebox/value'
import { Clean } from 'typebox/value'
import { Clone } from 'typebox/value'
import { Convert } from 'typebox/value'
import { Default } from 'typebox/value'
import { Pipeline } from 'typebox/value'
import { Decode as DecodeUnsafe } from 'typebox/value'

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
export class DecodeError extends AssertError {
  constructor(value: unknown, errors: TLocalizedValidationError[]) {
    super('Decode', value, errors)
  }
}
function Assert(context: TProperties, type: TSchema, value: unknown): unknown {
  if (!Check(context, type, value)) throw new DecodeError(value, Errors(context, type, value))
  return value
}
// ------------------------------------------------------------------
// Decoder
// ------------------------------------------------------------------
const Decoder = Pipeline([
  (_context, _type, value) => Clone(value),
  (context, type, value) => Default(context, type, value),
  (context, type, value) => Convert(context, type, value),
  (context, type, value) => Clean(context, type, value),
  (context, type, value) => Assert(context, type, value),
  (context, type, value) => DecodeUnsafe(context, type, value)
])
// ------------------------------------------------------------------
// Decode
// ------------------------------------------------------------------
/**
 * Decodes a value against the given type by applying a sequence of Clone,
 * Default, Convert, and Clone operations, then executing any embedded Decode
 * callbacks. If the processing sequence fails to produce a value matching the 
 * provided type, a DecodeError is thrown.
 */
export function Decode<const Type extends TSchema, 
  Result extends unknown = StaticDecode<Type>
>(type: Type, value: unknown): Result

/**
 * Decodes a value against the given type by applying a sequence of Clone,
 * Default, Convert, and Clone operations, then executing any embedded Decode
 * callbacks. If the processing sequence fails to produce a value matching the 
 * provided type, a DecodeError is thrown.
 */
export function Decode<Context extends TProperties, const Type extends TSchema, 
  Result extends unknown = StaticDecode<Type, Context>
>(context: Context, type: Type, value: unknown): Result

/**
 * Decodes a value against the given type by applying a sequence of Clone,
 * Default, Convert, and Clone operations, then executing any embedded Decode
 * callbacks. If the processing sequence fails to produce a value matching the 
 * provided type, a DecodeError is thrown.
 */
export function Decode(...args: unknown[]): never {
  const [context, type, value] = Arguments.Match<[TProperties, TSchema, unknown]>(args, {
    3: (context, type, value) => [context, type, value],
    2: (type, value) => [{}, type, value],
  })
  return Decoder(context, type, value) as never
}