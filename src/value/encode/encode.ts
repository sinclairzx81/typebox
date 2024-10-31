/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { HasTransform, TransformEncode, TransformEncodeCheckError } from '../transform/index'
import { Check } from '../check/index'
import { Errors } from '../../errors/index'

import type { TSchema } from '../../type/schema/index'
import type { StaticEncode } from '../../type/static/index'

/** Encodes a value or throws if error */
export function Encode<T extends TSchema, Static = StaticEncode<T>, Result extends Static = Static>(schema: T, references: TSchema[], value: unknown): Result
/** Encodes a value or throws if error */
export function Encode<T extends TSchema, Static = StaticEncode<T>, Result extends Static = Static>(schema: T, value: unknown): Result
/** Encodes a value or throws if error */
export function Encode(...args: any[]): any {
  const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
  const encoded = HasTransform(schema, references) ? TransformEncode(schema, references, value) : value
  if (!Check(schema, references, encoded)) throw new TransformEncodeCheckError(schema, encoded, Errors(schema, references, encoded).First()!)
  return encoded
}
