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

import { type TSchema } from '../../types/schema.ts'
import { type TCyclic, IsCyclic } from '../../types/cyclic.ts'
import { type TIntersect, IsIntersect } from '../../types/intersect.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TObject, IsObject } from '../../types/object.ts'
import { type TTuple, IsTuple } from '../../types/tuple.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'

import { type TFromCyclic, FromCyclic } from './from-cyclic.ts'
import { type TFromIntersect, FromIntersect } from './from-intersect.ts'
import { type TFromObject, FromObject } from './from-object.ts'
import { type TFromTuple, FromTuple } from './from-tuple.ts'
import { type TFromUnion, FromUnion } from './from-union.ts'

export type TFromType<Type extends TSchema,
  Result extends TProperties = (
    Type extends TCyclic<infer Defs extends TProperties, infer Ref extends string> ? TFromCyclic<Defs, Ref> :
    Type extends TIntersect<infer Types extends TSchema[]> ? TFromIntersect<Types> :
    Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion<Types> :
    Type extends TTuple<infer Types extends TSchema[]> ? TFromTuple<Types> :
    Type extends TObject<infer Properties extends TProperties> ? TFromObject<Properties> :
    {}
  )
> = Result
export function FromType<Type extends TSchema>(type: Type): TFromType<Type> {
  return (
    IsCyclic(type) ? FromCyclic(type.$defs, type.$ref) :
    IsIntersect(type) ? FromIntersect(type.allOf) :
    IsUnion(type) ? FromUnion(type.anyOf) :
    IsTuple(type) ? FromTuple(type.items) :
    IsObject(type) ? FromObject(type.properties) :
    {}
  ) as never
}
