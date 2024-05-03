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

import type { TSchema, SchemaOptions } from '../schema/index'
import type { Static } from '../static/index'
import type { Ensure } from '../helpers/index'
import { CloneType } from '../clone/type'
import { Kind } from '../symbols/index'

// ------------------------------------------------------------------
// StaticFunctionCall
// ------------------------------------------------------------------
type StaticReturnType<U extends TSchema, P extends unknown[]> = Static<U, P>

// prettier-ignore
type StaticFunctionCall<T extends unknown[], U extends TSchema, P extends unknown[]> =
  Ensure<(...param: [...T]) => StaticReturnType<U, P>>

// ------------------------------------------------------------------
// TFunctionCall
// ------------------------------------------------------------------
export interface TFunctionCall<T extends unknown[] = unknown[], U extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Call'
  static: StaticFunctionCall<T, U, this['params']>
  functionCall: {
    thisArg: unknown
    parameters: [...T]
    returns: U
  }
}
/** `[JavaScript]` Creates a FunctionCall type */
export function FunctionCall<T extends unknown[], U extends TSchema>(thisArg: unknown, parameters: [...T], returns: U, options?: SchemaOptions): TFunctionCall<T, U> {
  return { ...options, [Kind]: 'FunctionCall', functionCall: { thisArg, parameters, returns: CloneType(returns) } } as never
}
