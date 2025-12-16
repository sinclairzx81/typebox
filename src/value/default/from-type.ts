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
// deno-lint-ignore-file

import { IsDefault } from '../../schema/index.ts'

import * as T from '../../type/index.ts'
import { FromArray } from './from-array.ts'
import { FromCyclic } from './from-cyclic.ts'
import { FromDefault } from './from-default.ts'
import { FromIntersect } from './from-intersect.ts'
import { FromObject } from './from-object.ts'
import { FromRecord } from './from-record.ts'
import { FromRef } from './from-ref.ts'
import { FromTuple } from './from-tuple.ts'
import { FromUnion } from './from-union.ts'

export function FromType(context: T.TProperties, type: T.TSchema, value: unknown): unknown {
  const defaulted = IsDefault(type) ? FromDefault(type, value) : value
  return (
    T.IsArray(type) ? FromArray(context, type, defaulted) :
    T.IsCyclic(type) ? FromCyclic(context, type, defaulted) :
    T.IsIntersect(type) ? FromIntersect(context, type, defaulted) :
    T.IsObject(type) ? FromObject(context, type, defaulted) :
    T.IsRecord(type) ? FromRecord(context, type, defaulted) :
    T.IsRef(type) ? FromRef(context, type, defaulted) :
    T.IsTuple(type) ? FromTuple(context, type, defaulted) :
    T.IsUnion(type) ? FromUnion(context, type, defaulted) :
    defaulted
  )
}