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
import type { TProperties } from '../object/index'
import { MappedResult, type TMappedResult } from '../mapped/index'
import { Extends, type TExtends } from './extends'

// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<
  P extends TProperties,
  Right extends TSchema,
  False extends TSchema,
  True extends TSchema
> = (
  { [K2 in keyof P]: TExtends<P[K2], Right, False, True> }   
)
// prettier-ignore
function FromProperties<
  P extends TProperties,
  Right extends TSchema,
  True extends TSchema,
  False extends TSchema
>(P: P, Right: Right, True: True, False: False, options: SchemaOptions): TFromProperties<P, Right, True, False> {
  const Acc = {} as TProperties
  for(const K2 of globalThis.Object.getOwnPropertyNames(P)) Acc[K2] = Extends(P[K2], Right, True, False, options)
  return Acc as never
}
// ------------------------------------------------------------------
// FromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
type TFromMappedResult<
  Left extends TMappedResult,
  Right extends TSchema,
  True extends TSchema,
  False extends TSchema
> = (
  TFromProperties<Left['properties'], Right, True, False>
)
// prettier-ignore
function FromMappedResult<
  Left extends TMappedResult,
  Right extends TSchema,
  True extends TSchema,
  False extends TSchema
>(Left: Left, Right: Right, True: True, False: False, options: SchemaOptions): TFromMappedResult<Left, Right, True, False> {
  return FromProperties(Left.properties, Right, True, False, options) as never
}
// ------------------------------------------------------------------
// ExtendsFromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
export type TExtendsFromMappedResult<
  Left extends TMappedResult,
  Right extends TSchema,
  True extends TSchema,
  False extends TSchema,
  P extends TProperties = TFromMappedResult<Left, Right, True, False>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function ExtendsFromMappedResult<
  Left extends TMappedResult,
  Right extends TSchema,
  True extends TSchema,
  False extends TSchema,
  P extends TProperties = TFromMappedResult<Left, Right, True, False>
>(Left: Left, Right: Right, True: True, False: False, options: SchemaOptions): TMappedResult<P> {
  const P = FromMappedResult(Left, Right, True, False, options)
  return MappedResult(P) as never
}
