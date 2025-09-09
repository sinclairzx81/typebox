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

import { Guard } from '../../../guard/index.ts'
import { type TSchema, IsSchema } from '../../types/schema.ts'
import { type TLiteral, IsLiteral } from '../../types/literal.ts'
import { type TNumber, IsNumber } from '../../types/number.ts'
import { type TInteger, IsInteger } from '../../types/integer.ts'
import { type TObject, Object } from '../../types/object.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TString, IsString } from '../../types/string.ts'
import { type TRecord, StringKey } from '../../types/record.ts'
import { type TFlatten, Flatten } from '../evaluate/flatten.ts'
import { CreateRecord } from './record-create.ts'

// ------------------------------------------------------------------
//
// (Optimization) StringOrNumberCheck 
//
// Checks an array of Types for any for any occurances of string,
// number or integer. This check is later used as a mechanism to
// early terminate Union Key initalization with a Record that
// uses a simple type for the Key.
//
// ------------------------------------------------------------------
type TStringOrNumberCheck<Types extends TSchema[]> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? Left extends TString | TNumber | TInteger 
      ? true 
      : TStringOrNumberCheck<Right>
    : false
)
function StringOrNumberCheck<Types extends TSchema[]>(types: [...Types]): TStringOrNumberCheck<Types> {
  return types.some(type => IsString(type) || IsNumber(type) || IsInteger(type)) as never
}
// ------------------------------------------------------------------
//
// (Optimization) TryBuildRecord
//
// This function attempts to construct a TRecord by introspecting 
// each variant type. If a string, number, or integer is encountered, 
// it resolves to a Record<StringKey, ...>. Otherwise we resolve as
// undefined and perform a CreateObject<[...]> initialization by
// deeply introspecting Union variants.
//
// ------------------------------------------------------------------
type TTryBuildRecord<Types extends TSchema[], Value extends TSchema,
  Result extends TSchema | undefined = (
    TStringOrNumberCheck<Types> extends true 
      ? TRecord<typeof StringKey, Value> 
      : undefined
  )
> = Result
function TryBuildRecord<Types extends TSchema[], Value extends TSchema>(types: [...Types], value: Value): TTryBuildRecord<Types, Value> {
  return (
    Guard.IsEqual(StringOrNumberCheck(types), true) 
      ? CreateRecord(StringKey, value) 
      : undefined
  ) as never
}
// ------------------------------------------------------------------
//
// CreateProperties
//
// We only support string and number keys. All other keys, including 
// symbols, are ommitted. It is unclear if there is a way to include
// non-serializable symbol properties (future-research)
//
// ------------------------------------------------------------------
type TCreateProperties<Variants extends TSchema[], Value extends TSchema, Result extends TProperties = {}> = (
  Variants extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? Left extends TLiteral<string | number>
      ? TCreateProperties<Right, Value, Result & {[ _ in Left['const']]: Value }>
      : TCreateProperties<Right, Value, Result>
    : { [Key in keyof Result]: Result[Key] }
)
function CreateProperties<Types extends TSchema[], Value extends TSchema>(types: [...Types], value: Value): TCreateProperties<Types, Value> {
  return types.reduce((result, left) => {
    return IsLiteral(left) && (Guard.IsString(left.const) || Guard.IsNumber(left.const))
      ? { ...result, [left.const]: value }
      : result
  }, {} as TProperties) as never
}
// ------------------------------------------------------------------
//
// CreateObject
//
// These functions construct an Object by introspecting each variant
// and testing for String | Number literal type. The Variants array
// for this function is expected to be flattened first as these
// functions only operate 1 level deep.
//
// ------------------------------------------------------------------
type TCreateObject<Variants extends TSchema[], Value extends TSchema,
  Properties extends TProperties = TCreateProperties<Variants, Value>,
  Result extends TSchema = TObject<Properties>
> = Result
function CreateObject<Types extends TSchema[], Value extends TSchema>(types: [...Types], value: Value): TCreateObject<Types, Value> {
  const properties = CreateProperties(types, value)
  const result = Object(properties)
  return result as never
}
// ------------------------------------------------------------------
// FromUnionKey
// ------------------------------------------------------------------
export type TFromUnionKey<Types extends TSchema[], Value extends TSchema,
  Flattened extends TSchema[] = TFlatten<Types>,
  Record extends TSchema | undefined = TTryBuildRecord<Flattened, Value>,
  Result extends TSchema = (
    Record extends TSchema
      ? Record
      : TCreateObject<Flattened, Value>
  )
> = Result
export function FromUnionKey<Types extends TSchema[], Value extends TSchema>(types: [...Types], value: Value): TFromUnionKey<Types, Value> {
  const flattened = Flatten(types) as TSchema[]
  const record = TryBuildRecord(flattened, value)
  return (
    IsSchema(record) // maybe IsRecord?
      ? record
      : CreateObject(flattened, value)
  ) as never
}
