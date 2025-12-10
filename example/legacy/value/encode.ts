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
import { type TProperties, type TSchema, type StaticEncode } from 'typebox'

import { AssertError } from 'typebox/value'
import { Check } from 'typebox/value'
import { Errors } from 'typebox/value'
import { Clean } from 'typebox/value'
import { Clone } from 'typebox/value'
import { Convert } from 'typebox/value'
import { Default } from 'typebox/value'
import { Pipeline } from 'typebox/value'
import { Encode as EncodeUnsafe } from 'typebox/value'

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
export class EncodeError extends AssertError {
  constructor(value: unknown, errors: TLocalizedValidationError[]) {
    super('Encode', value, errors)
  }
}
function Assert(context: TProperties, type: TSchema, value: unknown): unknown {
  if (!Check(context, type, value)) throw new EncodeError(value, Errors(context, type, value))
  return value
}
// ------------------------------------------------------------------
// Encoder
// ------------------------------------------------------------------
const Encoder = Pipeline([
  (_context, _type, value) => Clone(value),
  (context, type, value) => EncodeUnsafe(context, type, value),
  (context, type, value) => Default(context, type, value),
  (context, type, value) => Convert(context, type, value),
  (context, type, value) => Clean(context, type, value),
  (context, type, value) => Assert(context, type, value),
])
// ------------------------------------------------------------------
// Encode
// ------------------------------------------------------------------
/** Encodes a value. */
export function Encode<const Type extends TSchema, 
  Result extends unknown = StaticEncode<Type>
>(type: Type, value: unknown): Result
/** Encodes a value. */
export function Encode<Context extends TProperties, const Type extends TSchema, 
  Result extends unknown = StaticEncode<Type, Context>
> (context: Context, type: Type, value: unknown): Result
/** Encodes a value. */
export function Encode(...args: unknown[]): never {
  const [context, type, value] = Arguments.Match<[TProperties, TSchema, unknown]>(args, {
    3: (context, type, value) => [context, type, value],
    2: (type, value) => [{}, type, value],
  })
  return Encoder(context, type, value) as never
}

