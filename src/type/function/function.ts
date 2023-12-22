/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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
import { CloneType, CloneRest } from '../clone/type'
import { Kind } from '../symbols/index'

// ------------------------------------------------------------------
// FunctionStatic
// ------------------------------------------------------------------
type FunctionStaticReturnType<T extends TSchema, P extends unknown[]> = Static<T, P>
// prettier-ignore
type FunctionStaticParameters<T extends TSchema[], P extends unknown[], Acc extends unknown[] = []> = 
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? FunctionStaticParameters<R, P, [...Acc, Static<L, P>]>
    : Acc
// prettier-ignore
type FunctionStatic<T extends TSchema[], U extends TSchema, P extends unknown[]> = (
  Ensure<(...param: FunctionStaticParameters<T, P>) => FunctionStaticReturnType<U, P>>
)
// ------------------------------------------------------------------
// TFunction
// ------------------------------------------------------------------
export interface TFunction<T extends TSchema[] = TSchema[], U extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Function'
  static: FunctionStatic<T, U, this['params']>
  type: 'Function'
  parameters: T
  returns: U
}
/** `[JavaScript]` Creates a Function type */
export function Function<T extends TSchema[], U extends TSchema>(parameters: [...T], returns: U, options?: SchemaOptions): TFunction<T, U> {
  return {
    ...options,
    [Kind]: 'Function',
    type: 'Function',
    parameters: CloneRest(parameters),
    returns: CloneType(returns),
  } as unknown as TFunction<T, U>
}
