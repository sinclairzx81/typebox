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

import { type TSchema } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TKeyValue } from '../../types/_key_value.ts'
import { IsArray, type TArray } from '../../types/array.ts'
import { IsCyclic, type TCyclic } from '../../types/cyclic.ts'
import { IsDependent, type TDependent } from '../../types/dependent.ts'
import { IsIntersect, type TIntersect } from '../../types/intersect.ts'
import { IsObject, type TObject } from '../../types/object.ts'
import { IsRecord, RecordPattern, RecordValue, type TRecord } from '../../types/record.ts'
import { IsRef, type TRef } from '../../types/ref.ts'
import { IsTuple, type TTuple } from '../../types/tuple.ts'
import { IsUnion, type TUnion } from '../../types/union.ts'

import { FromArray, type TFromArray } from './from_array.ts'
import { FromCyclic, type TFromCyclic } from './from_cyclic.ts'
import { FromDependent, type TFromDependent } from './from_dependent.ts'
import { FromIntersect, type TFromIntersect } from './from_intersect.ts'
import { FromObject, type TFromObject } from './from_object.ts'
import { FromRecord, type TFromRecord } from './from_record.ts'
import { FromRef, type TFromRef } from './from_ref.ts'
import { FromTuple, type TFromTuple } from './from_tuple.ts'
import { FromUnion, type TFromUnion } from './from_union.ts'

// ------------------------------------------------------------------
// FromType
// ------------------------------------------------------------------
export type TFromType<Context extends TProperties, Type extends TSchema, Result extends TKeyValue[] = (
  Type extends TArray<infer Type extends TSchema>  ? TFromArray<Context, Type> : 
  Type extends TCyclic<infer Defs extends TProperties, infer Ref extends string> ? TFromCyclic<Context, Defs, Ref> :
  Type extends TDependent<infer If extends TSchema, infer Then extends TSchema, infer Else extends TSchema> ? TFromDependent<Context, If, Then, Else> :
  Type extends TIntersect<infer Types extends TSchema[]> ? TFromIntersect<Context, Types> : 
  Type extends TObject<infer Properties extends TProperties> ? TFromObject<Context, Properties> : 
  Type extends TRecord<infer Pattern extends string, infer Value extends TSchema> ? TFromRecord<Context, Pattern, Value> : 
  Type extends TRef<infer Ref extends string> ? TFromRef<Context, Ref> :
  Type extends TTuple<infer Types extends TSchema[]> ? TFromTuple<Context, Types> : 
  Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion<Context, Types> : 
  []
)> = Result
export function FromType<Context extends TProperties, Type extends TSchema>
  (context: Context, type: Type): TFromType<Context, Type> {
  return (
    IsArray(type) ? FromArray(context, type.items) : 
    IsCyclic(type) ? FromCyclic(context, type.$defs, type.$ref) :
    IsDependent(type) ? FromDependent(context, type.if, type.then, type.else) :
    IsIntersect(type) ? FromIntersect(context, type.allOf) : 
    IsObject(type) ? FromObject(context, type.properties) : 
    IsRecord(type) ? FromRecord(context, RecordPattern(type), RecordValue(type)) : 
    IsRef(type) ? FromRef(context, type.$ref) :
    IsTuple(type) ? FromTuple(context, type.items) : 
    IsUnion(type) ? FromUnion(context, type.anyOf) : 
    []
  ) as never
}
