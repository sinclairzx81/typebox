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
// TConstructorStatic
// ------------------------------------------------------------------
type ConstructorStaticReturnType<T extends TSchema, P extends unknown[]> = Static<T, P>
// prettier-ignore
type ConstructorStaticParameters<T extends TSchema[], P extends unknown[], Acc extends unknown[] = []> = 
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? ConstructorStaticParameters<R, P, [...Acc, Static<L, P>]>
    : Acc
// prettier-ignore
type ConstructorStatic<T extends TSchema[], U extends TSchema, P extends unknown[]> = (
  Ensure<new (...param: ConstructorStaticParameters<T, P>) => ConstructorStaticReturnType<U, P>>
)
// ------------------------------------------------------------------
// TConstructor
// ------------------------------------------------------------------
export interface TConstructor<T extends TSchema[] = TSchema[], U extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Constructor'
  static: ConstructorStatic<T, U, this['params']>
  type: 'Constructor'
  parameters: T
  returns: U
}
/** `[JavaScript]` Creates a Constructor type */
export function Constructor<T extends TSchema[], U extends TSchema>(parameters: [...T], returns: U, options?: SchemaOptions): TConstructor<T, U> {
  return {
    ...options,
    [Kind]: 'Constructor',
    type: 'Constructor',
    parameters: CloneRest(parameters),
    returns: CloneType(returns),
  } as unknown as TConstructor<T, U>
}
