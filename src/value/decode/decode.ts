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

import { HasTransform, TransformDecode, TransformDecodeCheckError } from '../transform/index'
import { Check } from '../check/index'
import { Errors } from '../../errors/index'

import type { TSchema } from '../../type/schema/index'
import type { StaticDecode } from '../../type/static/index'

/** Decodes a value or throws if error */
export function Decode<T extends TSchema, Static = StaticDecode<T>, Result extends Static = Static>(schema: T, references: TSchema[], value: unknown): Result
/** Decodes a value or throws if error */
export function Decode<T extends TSchema, Static = StaticDecode<T>, Result extends Static = Static>(schema: T, value: unknown): Result
/** Decodes a value or throws if error */
export function Decode(...args: any[]): any {
  const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
  if (!Check(schema, references, value)) throw new TransformDecodeCheckError(schema, value, Errors(schema, references, value).First()!)
  return HasTransform(schema, references) ? TransformDecode(schema, references, value) : value
}
