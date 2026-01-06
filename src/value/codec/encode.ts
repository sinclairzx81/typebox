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

import { Arguments } from '../../system/arguments/index.ts'
import { type TLocalizedValidationError } from '../../error/errors.ts'
import { type TProperties, type TSchema, type StaticEncode } from '../../type/index.ts'

import { AssertError } from '../assert/index.ts'
import { Check } from '../check/index.ts'
import { Errors } from '../errors/index.ts'
import { Clean } from '../clean/index.ts'
import { Clone } from '../clone/index.ts'
import { Convert } from '../convert/index.ts'
import { Default } from '../default/index.ts'
import { Pipeline } from '../pipeline/index.ts'
import { FromType } from './from-type.ts'

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
// EncodeUnsafe
// ------------------------------------------------------------------
/** Executes Encode callbacks only */
export function EncodeUnsafe(context: TProperties, type: TSchema, value: unknown): unknown {
  return FromType('Encode', context, type, value)
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

