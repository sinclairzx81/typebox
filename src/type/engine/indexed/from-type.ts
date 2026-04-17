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
import { type TArray, IsArray } from '../../types/array.ts'
import { type TNever, Never } from '../../types/never.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TObject, IsObject } from '../../types/object.ts'
import { type TTuple, IsTuple } from '../../types/tuple.ts'
import { type TFromArray, FromArray } from './from-array.ts'
import { type TFromObject, FromObject } from './from-object.ts'
import { type TFromTuple, FromTuple } from './from-tuple.ts'

export type TFromType<Type extends TSchema, Indexer extends TSchema> = ( 
  Type extends TArray<infer Type extends TSchema> ? TFromArray<Type, Indexer> :
  Type extends TObject<infer Properties extends TProperties> ? TFromObject<Properties, Indexer> :
  Type extends TTuple<infer Types extends TSchema[]> ? TFromTuple<Types, Indexer> :  
  TNever
)
export function FromType<Type extends TSchema, Indexer extends TSchema>(type: Type, indexer: Indexer): TFromType<Type, Indexer> {
  return (
    IsArray(type) ? FromArray(type.items, indexer) :
    IsObject(type) ? FromObject(type.properties, indexer) :
    IsTuple(type) ? FromTuple(type.items, indexer) :
    Never()
  ) as never
}