/*--------------------------------------------------------------------------

@sinclair/typebox/type

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

import { CloneType } from '../clone/type'
import { Ensure } from '../helpers/index'
import type { SchemaOptions, TSchema } from '../schema/index'
import type { Static } from '../static/index'
import { Kind } from '../symbols/index'

export interface ArrayOptions extends SchemaOptions {
  /** The minimum number of items in this array */
  minItems?: number
  /** The maximum number of items in this array */
  maxItems?: number
  /** Should this schema contain unique items */
  uniqueItems?: boolean
  /** A schema for which some elements should match */
  contains?: TSchema
  /** A minimum number of contains schema matches */
  minContains?: number
  /** A maximum number of contains schema matches */
  maxContains?: number
}
type ArrayStatic<T extends TSchema, P extends unknown[]> = Ensure<Static<T, P>[]>
export interface TArray<T extends TSchema = TSchema> extends TSchema, ArrayOptions {
  [Kind]: 'Array'
  static: ArrayStatic<T, this['params']>
  type: 'array'
  items: T
}
/** `[Json]` Creates an Array type */
export function Array<T extends TSchema>(schema: T, options: ArrayOptions = {}): TArray<T> {
  return {
    ...options,
    [Kind]: 'Array',
    type: 'array',
    items: CloneType(schema),
  } as never
}
