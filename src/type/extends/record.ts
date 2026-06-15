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

import { Guard } from '../../guard/index.ts'
import { type TSchema } from '../types/schema.ts'
import { type TProperties } from '../types/properties.ts'
import { type TAny, IsAny } from '../types/any.ts'
import { type TUnknown, IsUnknown } from '../types/unknown.ts'
import { type TObject, IsObject } from '../types/object.ts'
import { type TRecordPatternToType,  type TRecord, IsRecord, RecordPatternToType, RecordPattern, RecordValue } from '../types/record.ts'
import { type TExtendsLeft, ExtendsLeft } from './extends_left.ts'
import * as Result from './result.ts'

// ------------------------------------------------------------------
// FromObject
// ------------------------------------------------------------------
export type TFromObject<Inferred extends TProperties, Properties extends TProperties> = 
  keyof Properties extends never
    ? Result.TExtendsTrue<Inferred>
    : Result.TExtendsFalse
function FromObject<Inferred extends TProperties, Properties extends TProperties>
  (inferred: Inferred, properties: Properties): TFromObject<Inferred, Properties> {
  return (Guard.IsEqual(Guard.Keys(properties).length, 0)
    ? Result.ExtendsTrue(inferred)
    : Result.ExtendsFalse()) as never
}
// ------------------------------------------------------------------
// FromRecord
// ------------------------------------------------------------------
type TFromRecord<Inferred extends TProperties, _LeftKey extends TSchema, LeftValue extends TSchema, _RightKey extends TSchema, RightValue extends TSchema> = (
  TExtendsLeft<Inferred, LeftValue, RightValue>
)
function FromRecord<Inferred extends TProperties, LeftKey extends TSchema, LeftValue extends TSchema, RightKey extends TSchema, RightValue extends TSchema>
  (inferred: Inferred, _leftKey: LeftKey, leftValue: LeftValue, _rightKey: RightKey, rightValue: RightValue): 
    TFromRecord<Inferred, LeftKey, LeftValue, RightKey, RightValue> {
  return ExtendsLeft(inferred, leftValue, rightValue) as never
}
// ------------------------------------------------------------------
// Extends
// ------------------------------------------------------------------
export type TExtendsRecord<Inferred extends TProperties, LeftPattern extends string, LeftValue extends TSchema, Right extends TSchema> = (
  Right extends TRecord<infer Pattern extends string, infer Value extends TSchema> ? TFromRecord<Inferred, TRecordPatternToType<LeftPattern>, LeftValue, TRecordPatternToType<Pattern>, Value> :
  Right extends TObject<infer Properties extends TProperties> ? TFromObject<Inferred, Properties> :
  Right extends TAny ? Result.TExtendsTrue<Inferred> :
  Right extends TUnknown ? Result.TExtendsTrue<Inferred> :
  Result.TExtendsFalse
)
export function ExtendsRecord<Inferred extends TProperties, Pattern extends string, Value extends TSchema, Right extends TSchema>
  (inferred: Inferred, leftPattern: Pattern, leftValue: Value, right: Right): 
    TExtendsRecord<Inferred, Pattern, Value, Right> {
  return (
    IsRecord(right) ? FromRecord(inferred, RecordPatternToType(leftPattern), leftValue, RecordPatternToType(RecordPattern(right)), RecordValue(right)) :
    IsObject(right) ? FromObject(inferred, right.properties) :
    IsAny(right) ? Result.ExtendsTrue(inferred) :
    IsUnknown(right) ? Result.ExtendsTrue(inferred) :
    Result.ExtendsFalse()
  ) as never
}