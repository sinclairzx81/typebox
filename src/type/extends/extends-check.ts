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

import { type TAny, Any } from '../any/index'
import { type TArray } from '../array/index'
import { type TAsyncIterator } from '../async-iterator/index'
import { type TBigInt } from '../bigint/index'
import { type TBoolean } from '../boolean/index'
import { type TConstructor } from '../constructor/index'
import { type TDate } from '../date/index'
import { type TFunction, Function as FunctionType } from '../function/index'
import { type TInteger } from '../integer/index'
import { type TIntersect } from '../intersect/index'
import { type TIterator } from '../iterator/index'
import { type TLiteral } from '../literal/index'
import { type TNever } from '../never/index'
import { type TNot } from '../not/index'
import { type TNull } from '../null/index'
import { type TNumber, Number } from '../number/index'
import { type TObject } from '../object/index'
import { type TPromise } from '../promise/index'
import { type TRecord } from '../record/index'
import { type TSchema } from '../schema/index'
import { type TString, String } from '../string/index'
import { type TSymbol } from '../symbol/index'
import { type TTuple } from '../tuple/index'
import { type TUint8Array } from '../uint8array/index'
import { type TUndefined } from '../undefined/index'
import { type TUnion } from '../union/index'
import { type TUnknown, Unknown } from '../unknown/index'
import { type TVoid } from '../void/index'

import { TemplateLiteralToUnion } from '../template-literal/index'
import { PatternNumberExact, PatternStringExact } from '../patterns/index'
import { Kind, Hint } from '../symbols/index'
import { TypeBoxError } from '../error/index'
import { TypeGuard, ValueGuard } from '../guard/index'

export class ExtendsResolverError extends TypeBoxError {}

export enum ExtendsResult {
  Union,
  True,
  False,
}
// ------------------------------------------------------------------
// IntoBooleanResult
// ------------------------------------------------------------------
// prettier-ignore
function IntoBooleanResult(result: ExtendsResult) {
  return result === ExtendsResult.False ? result : ExtendsResult.True
}
// ------------------------------------------------------------------
// Throw
// ------------------------------------------------------------------
// prettier-ignore
function Throw(message: string): never {
  throw new ExtendsResolverError(message)
}
// ------------------------------------------------------------------
// StructuralRight
// ------------------------------------------------------------------
// prettier-ignore
function IsStructuralRight(right: TSchema): boolean {
  return (
    TypeGuard.IsNever(right) ||
    TypeGuard.IsIntersect(right) ||
    TypeGuard.IsUnion(right) ||
    TypeGuard.IsUnknown(right) ||
    TypeGuard.IsAny(right)
  )
}
// prettier-ignore
function StructuralRight(left: TSchema, right: TSchema) {
  return (
    TypeGuard.IsNever(right) ? FromNeverRight(left, right) :
    TypeGuard.IsIntersect(right) ? FromIntersectRight(left, right) :
    TypeGuard.IsUnion(right) ? FromUnionRight(left, right) :
    TypeGuard.IsUnknown(right) ? FromUnknownRight(left, right) :
    TypeGuard.IsAny(right) ? FromAnyRight(left, right) :
    Throw('StructuralRight')
  )
}
// ------------------------------------------------------------------
// Any
// ------------------------------------------------------------------
// prettier-ignore
function FromAnyRight(left: TSchema, right: TAny) {
  return ExtendsResult.True
}
// prettier-ignore
function FromAny(left: TAny, right: TSchema) {
  return (
    TypeGuard.IsIntersect(right) ? FromIntersectRight(left, right) :
    (TypeGuard.IsUnion(right) && right.anyOf.some((schema) => TypeGuard.IsAny(schema) || TypeGuard.IsUnknown(schema))) ? ExtendsResult.True :
    TypeGuard.IsUnion(right) ? ExtendsResult.Union :
    TypeGuard.IsUnknown(right) ? ExtendsResult.True :
    TypeGuard.IsAny(right) ? ExtendsResult.True :
    ExtendsResult.Union
  )
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
// prettier-ignore
function FromArrayRight(left: TSchema, right: TArray) {
  return (
    TypeGuard.IsUnknown(left) ? ExtendsResult.False :
    TypeGuard.IsAny(left) ? ExtendsResult.Union :
    TypeGuard.IsNever(left) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// prettier-ignore
function FromArray(left: TArray, right: TSchema) {
  return (
    TypeGuard.IsObject(right) && IsObjectArrayLike(right) ? ExtendsResult.True :
    IsStructuralRight(right) ? StructuralRight(left, right) :
    !TypeGuard.IsArray(right) ? ExtendsResult.False :
    IntoBooleanResult(Visit(left.items, right.items))
  )
}
// ------------------------------------------------------------------
// AsyncIterator
// ------------------------------------------------------------------
// prettier-ignore
function FromAsyncIterator(left: TAsyncIterator, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    !TypeGuard.IsAsyncIterator(right) ? ExtendsResult.False :
    IntoBooleanResult(Visit(left.items, right.items))
  )
}
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
// prettier-ignore
function FromBigInt(left: TBigInt, right: TSchema): ExtendsResult {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    TypeGuard.IsRecord(right) ? FromRecordRight(left, right) :
    TypeGuard.IsBigInt(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
// prettier-ignore
function FromBooleanRight(left: TSchema, right: TBoolean) {
  return (
    TypeGuard.IsLiteralBoolean(left) ? ExtendsResult.True : 
    TypeGuard.IsBoolean(left) ? ExtendsResult.True : 
    ExtendsResult.False
  )
}
// prettier-ignore
function FromBoolean(left: TBoolean, right: TSchema): ExtendsResult {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    TypeGuard.IsRecord(right) ? FromRecordRight(left, right) :
    TypeGuard.IsBoolean(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
// prettier-ignore
function FromConstructor(left: TConstructor, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    !TypeGuard.IsConstructor(right) ? ExtendsResult.False :
    left.parameters.length > right.parameters.length ? ExtendsResult.False :
    (!left.parameters.every((schema, index) => IntoBooleanResult(Visit(right.parameters[index], schema)) === ExtendsResult.True)) ? ExtendsResult.False :
    IntoBooleanResult(Visit(left.returns, right.returns))
  )
}
// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
// prettier-ignore
function FromDate(left: TDate, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    TypeGuard.IsRecord(right) ? FromRecordRight(left, right) :
    TypeGuard.IsDate(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
// prettier-ignore
function FromFunction(left: TFunction, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    !TypeGuard.IsFunction(right) ? ExtendsResult.False :
    left.parameters.length > right.parameters.length ? ExtendsResult.False :
    (!left.parameters.every((schema, index) => IntoBooleanResult(Visit(right.parameters[index], schema)) === ExtendsResult.True)) ? ExtendsResult.False :
    IntoBooleanResult(Visit(left.returns, right.returns))
  )
}
// ------------------------------------------------------------------
// Integer
// ------------------------------------------------------------------
// prettier-ignore
function FromIntegerRight(left: TSchema, right: TInteger) {
  return (
    TypeGuard.IsLiteral(left) && ValueGuard.IsNumber(left.const) ? ExtendsResult.True :
    TypeGuard.IsNumber(left) || TypeGuard.IsInteger(left) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// prettier-ignore
function FromInteger(left: TInteger, right: TSchema): ExtendsResult {
  return (
    TypeGuard.IsInteger(right) || TypeGuard.IsNumber(right) ? ExtendsResult.True :
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    TypeGuard.IsRecord(right) ? FromRecordRight(left, right) :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
// prettier-ignore
function FromIntersectRight(left: TSchema, right: TIntersect): ExtendsResult {
  return right.allOf.every((schema) => Visit(left, schema) === ExtendsResult.True)
    ? ExtendsResult.True
    : ExtendsResult.False
}
// prettier-ignore
function FromIntersect(left: TIntersect, right: TSchema) {
  return left.allOf.some((schema) => Visit(schema, right) === ExtendsResult.True)
    ? ExtendsResult.True
    : ExtendsResult.False
}
// ------------------------------------------------------------------
// Iterator
// ------------------------------------------------------------------
// prettier-ignore
function FromIterator(left: TIterator, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    !TypeGuard.IsIterator(right) ? ExtendsResult.False :
    IntoBooleanResult(Visit(left.items, right.items))
  )
}
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
// prettier-ignore
function FromLiteral(left: TLiteral, right: TSchema): ExtendsResult {
  return (
    TypeGuard.IsLiteral(right) && right.const === left.const ? ExtendsResult.True :
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    TypeGuard.IsRecord(right) ? FromRecordRight(left, right) :
    TypeGuard.IsString(right) ? FromStringRight(left, right) :
    TypeGuard.IsNumber(right) ? FromNumberRight(left, right) :
    TypeGuard.IsInteger(right) ? FromIntegerRight(left, right) :
    TypeGuard.IsBoolean(right) ? FromBooleanRight(left, right) :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Never
// ------------------------------------------------------------------
// prettier-ignore
function FromNeverRight(left: TSchema, right: TNever) {
  return ExtendsResult.False
}
// prettier-ignore
function FromNever(left: TNever, right: TSchema) {
  return ExtendsResult.True
}
// ------------------------------------------------------------------
// Not
// ------------------------------------------------------------------
// prettier-ignore
function UnwrapTNot<T extends TNot>(schema: T): TUnknown | TNot['not'] {
  let [current, depth]: [TSchema, number] = [schema, 0]
  while (true) {
    if (!TypeGuard.IsNot(current)) break
    current = current.not
    depth += 1
  }
  return depth % 2 === 0 ? current : Unknown()
}
// prettier-ignore
function FromNot(left: TSchema, right: TSchema) {
  // TypeScript has no concept of negated types, and attempts to correctly check the negated
  // type at runtime would put TypeBox at odds with TypeScripts ability to statically infer
  // the type. Instead we unwrap to either unknown or T and continue evaluating.
  // prettier-ignore
  return (
    TypeGuard.IsNot(left) ? Visit(UnwrapTNot(left), right) :
    TypeGuard.IsNot(right) ? Visit(left, UnwrapTNot(right)) :
    Throw('Invalid fallthrough for Not')
  )
}
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
// prettier-ignore
function FromNull(left: TNull, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    TypeGuard.IsRecord(right) ? FromRecordRight(left, right) :
    TypeGuard.IsNull(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
// prettier-ignore
function FromNumberRight(left: TSchema, right: TNumber) {
  return (
    TypeGuard.IsLiteralNumber(left) ? ExtendsResult.True :
    TypeGuard.IsNumber(left) || TypeGuard.IsInteger(left) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// prettier-ignore
function FromNumber(left: TNumber, right: TSchema): ExtendsResult {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    TypeGuard.IsRecord(right) ? FromRecordRight(left, right) :
    TypeGuard.IsInteger(right) || TypeGuard.IsNumber(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
// prettier-ignore
function IsObjectPropertyCount(schema: TObject, count: number) {
  return Object.getOwnPropertyNames(schema.properties).length === count
}
// prettier-ignore
function IsObjectStringLike(schema: TObject) {
  return IsObjectArrayLike(schema)
}
// prettier-ignore
function IsObjectSymbolLike(schema: TObject) {
  return IsObjectPropertyCount(schema, 0) || (
    IsObjectPropertyCount(schema, 1) && 'description' in schema.properties && TypeGuard.IsUnion(schema.properties.description) && schema.properties.description.anyOf.length === 2 && ((
      TypeGuard.IsString(schema.properties.description.anyOf[0]) &&
      TypeGuard.IsUndefined(schema.properties.description.anyOf[1])
    ) || (
        TypeGuard.IsString(schema.properties.description.anyOf[1]) &&
        TypeGuard.IsUndefined(schema.properties.description.anyOf[0])
      ))
  )
}
// prettier-ignore
function IsObjectNumberLike(schema: TObject) {
  return IsObjectPropertyCount(schema, 0)
}
// prettier-ignore
function IsObjectBooleanLike(schema: TObject) {
  return IsObjectPropertyCount(schema, 0)
}
// prettier-ignore
function IsObjectBigIntLike(schema: TObject) {
  return IsObjectPropertyCount(schema, 0)
}
// prettier-ignore
function IsObjectDateLike(schema: TObject) {
  return IsObjectPropertyCount(schema, 0)
}
// prettier-ignore
function IsObjectUint8ArrayLike(schema: TObject) {
  return IsObjectArrayLike(schema)
}
// prettier-ignore
function IsObjectFunctionLike(schema: TObject) {
  const length = Number()
  return IsObjectPropertyCount(schema, 0) || (IsObjectPropertyCount(schema, 1) && 'length' in schema.properties && IntoBooleanResult(Visit(schema.properties['length'], length)) === ExtendsResult.True)
}
// prettier-ignore
function IsObjectConstructorLike(schema: TObject) {
  return IsObjectPropertyCount(schema, 0)
}
// prettier-ignore
function IsObjectArrayLike(schema: TObject) {
  const length = Number()
  return IsObjectPropertyCount(schema, 0) || (IsObjectPropertyCount(schema, 1) && 'length' in schema.properties && IntoBooleanResult(Visit(schema.properties['length'], length)) === ExtendsResult.True)
}
// prettier-ignore
function IsObjectPromiseLike(schema: TObject) {
  const then = FunctionType([Any()], Any())
  return IsObjectPropertyCount(schema, 0) || (IsObjectPropertyCount(schema, 1) && 'then' in schema.properties && IntoBooleanResult(Visit(schema.properties['then'], then)) === ExtendsResult.True)
}
// ------------------------------------------------------------------
// Property
// ------------------------------------------------------------------
// prettier-ignore
function Property(left: TSchema, right: TSchema) {
  return (
    Visit(left, right) === ExtendsResult.False ? ExtendsResult.False :
    TypeGuard.IsOptional(left) && !TypeGuard.IsOptional(right) ? ExtendsResult.False :
    ExtendsResult.True
  )
}
// prettier-ignore
function FromObjectRight(left: TSchema, right: TObject) {
  return (
    TypeGuard.IsUnknown(left) ? ExtendsResult.False :
    TypeGuard.IsAny(left) ? ExtendsResult.Union : (
      TypeGuard.IsNever(left) ||
      (TypeGuard.IsLiteralString(left) && IsObjectStringLike(right)) ||
      (TypeGuard.IsLiteralNumber(left) && IsObjectNumberLike(right)) ||
      (TypeGuard.IsLiteralBoolean(left) && IsObjectBooleanLike(right)) ||
      (TypeGuard.IsSymbol(left) && IsObjectSymbolLike(right)) ||
      (TypeGuard.IsBigInt(left) && IsObjectBigIntLike(right)) ||
      (TypeGuard.IsString(left) && IsObjectStringLike(right)) ||
      (TypeGuard.IsSymbol(left) && IsObjectSymbolLike(right)) ||
      (TypeGuard.IsNumber(left) && IsObjectNumberLike(right)) ||
      (TypeGuard.IsInteger(left) && IsObjectNumberLike(right)) ||
      (TypeGuard.IsBoolean(left) && IsObjectBooleanLike(right)) ||
      (TypeGuard.IsUint8Array(left) && IsObjectUint8ArrayLike(right)) ||
      (TypeGuard.IsDate(left) && IsObjectDateLike(right)) ||
      (TypeGuard.IsConstructor(left) && IsObjectConstructorLike(right)) ||
      (TypeGuard.IsFunction(left) && IsObjectFunctionLike(right))
    ) ? ExtendsResult.True :
    (TypeGuard.IsRecord(left) && TypeGuard.IsString(RecordKey(left))) ? (() => {
      // When expressing a Record with literal key values, the Record is converted into a Object with
      // the Hint assigned as `Record`. This is used to invert the extends logic.
      return right[Hint] === 'Record' ? ExtendsResult.True : ExtendsResult.False
    })() :
    (TypeGuard.IsRecord(left) && TypeGuard.IsNumber(RecordKey(left))) ? (() => {
      return IsObjectPropertyCount(right, 0) ? ExtendsResult.True : ExtendsResult.False
    })() :
    ExtendsResult.False
  )
}
// prettier-ignore
function FromObject(left: TObject, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsRecord(right) ? FromRecordRight(left, right) :
    !TypeGuard.IsObject(right) ? ExtendsResult.False :
    (() => {
        for (const key of Object.getOwnPropertyNames(right.properties)) {
          if (!(key in left.properties) && !TypeGuard.IsOptional(right.properties[key])) {
          return ExtendsResult.False
        }
        if (TypeGuard.IsOptional(right.properties[key])) {
          return ExtendsResult.True
        }
        if (Property(left.properties[key], right.properties[key]) === ExtendsResult.False) {
          return ExtendsResult.False
        }
      }
      return ExtendsResult.True
    })()
  )
}
// ------------------------------------------------------------------
// Promise
// ------------------------------------------------------------------
// prettier-ignore
function FromPromise(left: TPromise, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) && IsObjectPromiseLike(right) ? ExtendsResult.True :
    !TypeGuard.IsPromise(right) ? ExtendsResult.False :
    IntoBooleanResult(Visit(left.item, right.item))
  )
}
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
// prettier-ignore
function RecordKey(schema: TRecord) {
  return (
    PatternNumberExact in schema.patternProperties ? Number() :
    PatternStringExact in schema.patternProperties ? String() :
    Throw('Unknown record key pattern')
  )
}
// prettier-ignore
function RecordValue(schema: TRecord) {
  return (
    PatternNumberExact in schema.patternProperties ? schema.patternProperties[PatternNumberExact] :
    PatternStringExact in schema.patternProperties ? schema.patternProperties[PatternStringExact] :
    Throw('Unable to get record value schema')
  )
}
// prettier-ignore
function FromRecordRight(left: TSchema, right: TRecord) {
  const [Key, Value] = [RecordKey(right), RecordValue(right)]
  return (
    (
      TypeGuard.IsLiteralString(left) && TypeGuard.IsNumber(Key) && IntoBooleanResult(Visit(left, Value)) === ExtendsResult.True) ? ExtendsResult.True :
      TypeGuard.IsUint8Array(left) && TypeGuard.IsNumber(Key) ? Visit(left, Value) :
      TypeGuard.IsString(left) && TypeGuard.IsNumber(Key) ? Visit(left, Value) :
      TypeGuard.IsArray(left) && TypeGuard.IsNumber(Key) ? Visit(left, Value) :
      TypeGuard.IsObject(left) ? (() => {
        for (const key of Object.getOwnPropertyNames(left.properties)) {
          if (Property(Value, left.properties[key]) === ExtendsResult.False) {
            return ExtendsResult.False
          }
        }
        return ExtendsResult.True
      })() :
    ExtendsResult.False
  )
}
// prettier-ignore
function FromRecord(left: TRecord, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    !TypeGuard.IsRecord(right) ? ExtendsResult.False :
    Visit(RecordValue(left), RecordValue(right))
  )
}
// ------------------------------------------------------------------
// RegExp
// ------------------------------------------------------------------
// prettier-ignore
function FromRegExp(left: TSchema, right: TSchema) {
  // Note: RegExp types evaluate as strings, not RegExp objects.
  // Here we remap either into string and continue evaluating.
  const L = TypeGuard.IsRegExp(left) ? String() : left
  const R = TypeGuard.IsRegExp(right) ? String() : right
  return Visit(L, R)
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
// prettier-ignore
function FromStringRight(left: TSchema, right: TString) {
  return (
    TypeGuard.IsLiteral(left) && ValueGuard.IsString(left.const) ? ExtendsResult.True :
    TypeGuard.IsString(left) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// prettier-ignore
function FromString(left: TString, right: TSchema): ExtendsResult {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    TypeGuard.IsRecord(right) ? FromRecordRight(left, right) :
    TypeGuard.IsString(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Symbol
// ------------------------------------------------------------------
// prettier-ignore
function FromSymbol(left: TSymbol, right: TSchema): ExtendsResult {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    TypeGuard.IsRecord(right) ? FromRecordRight(left, right) :
    TypeGuard.IsSymbol(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// TemplateLiteral
// ------------------------------------------------------------------
// prettier-ignore
function FromTemplateLiteral(left: TSchema, right: TSchema) {
  // TemplateLiteral types are resolved to either unions for finite expressions or string
  // for infinite expressions. Here we call to TemplateLiteralResolver to resolve for
  // either type and continue evaluating.
  return (
    TypeGuard.IsTemplateLiteral(left) ? Visit(TemplateLiteralToUnion(left), right) :
    TypeGuard.IsTemplateLiteral(right) ? Visit(left, TemplateLiteralToUnion(right)) :
    Throw('Invalid fallthrough for TemplateLiteral')
  )
}
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
function IsArrayOfTuple(left: TTuple, right: TSchema) {
  return (
    TypeGuard.IsArray(right) &&
    left.items !== undefined &&
    left.items.every((schema) => Visit(schema, right.items) === ExtendsResult.True)
  )
}
// prettier-ignore
function FromTupleRight(left: TSchema, right: TTuple) {
  return (
    TypeGuard.IsNever(left) ? ExtendsResult.True :
    TypeGuard.IsUnknown(left) ? ExtendsResult.False :
    TypeGuard.IsAny(left) ? ExtendsResult.Union :
    ExtendsResult.False
  )
}
// prettier-ignore
function FromTuple(left: TTuple, right: TSchema): ExtendsResult {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) && IsObjectArrayLike(right) ? ExtendsResult.True :
    TypeGuard.IsArray(right) && IsArrayOfTuple(left, right) ? ExtendsResult.True :
    !TypeGuard.IsTuple(right) ? ExtendsResult.False :
    (ValueGuard.IsUndefined(left.items) && !ValueGuard.IsUndefined(right.items)) || (!ValueGuard.IsUndefined(left.items) && ValueGuard.IsUndefined(right.items)) ? ExtendsResult.False :
    (ValueGuard.IsUndefined(left.items) && !ValueGuard.IsUndefined(right.items)) ? ExtendsResult.True :
    left.items!.every((schema, index) => Visit(schema, right.items![index]) === ExtendsResult.True) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Uint8Array
// ------------------------------------------------------------------
// prettier-ignore
function FromUint8Array(left: TUint8Array, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    TypeGuard.IsRecord(right) ? FromRecordRight(left, right) :
    TypeGuard.IsUint8Array(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
// prettier-ignore
function FromUndefined(left: TUndefined, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    TypeGuard.IsRecord(right) ? FromRecordRight(left, right) :
    TypeGuard.IsVoid(right) ? FromVoidRight(left, right) :
    TypeGuard.IsUndefined(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
function FromUnionRight(left: TSchema, right: TUnion): ExtendsResult {
  return right.anyOf.some((schema) => Visit(left, schema) === ExtendsResult.True)
    ? ExtendsResult.True
    : ExtendsResult.False
}
// prettier-ignore
function FromUnion(left: TUnion, right: TSchema): ExtendsResult {
  return left.anyOf.every((schema) => Visit(schema, right) === ExtendsResult.True)
    ? ExtendsResult.True
    : ExtendsResult.False
}
// ------------------------------------------------------------------
// Unknown
// ------------------------------------------------------------------
// prettier-ignore
function FromUnknownRight(left: TSchema, right: TUnknown) {
  return ExtendsResult.True
}
// prettier-ignore
function FromUnknown(left: TUnknown, right: TSchema) {
  return (
    TypeGuard.IsNever(right) ? FromNeverRight(left, right) :
    TypeGuard.IsIntersect(right) ? FromIntersectRight(left, right) :
    TypeGuard.IsUnion(right) ? FromUnionRight(left, right) :
    TypeGuard.IsAny(right) ? FromAnyRight(left, right) :
    TypeGuard.IsString(right) ? FromStringRight(left, right) :
    TypeGuard.IsNumber(right) ? FromNumberRight(left, right) :
    TypeGuard.IsInteger(right) ? FromIntegerRight(left, right) :
    TypeGuard.IsBoolean(right) ? FromBooleanRight(left, right) :
    TypeGuard.IsArray(right) ? FromArrayRight(left, right) :
    TypeGuard.IsTuple(right) ? FromTupleRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    TypeGuard.IsUnknown(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Void
// ------------------------------------------------------------------
// prettier-ignore
function FromVoidRight(left: TSchema, right: TVoid) {
  return (
    TypeGuard.IsUndefined(left) ? ExtendsResult.True :
    TypeGuard.IsUndefined(left) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// prettier-ignore
function FromVoid(left: TVoid, right: TSchema) {
  return (
    TypeGuard.IsIntersect(right) ? FromIntersectRight(left, right) :
    TypeGuard.IsUnion(right) ? FromUnionRight(left, right) :
    TypeGuard.IsUnknown(right) ? FromUnknownRight(left, right) :
    TypeGuard.IsAny(right) ? FromAnyRight(left, right) :
    TypeGuard.IsObject(right) ? FromObjectRight(left, right) :
    TypeGuard.IsVoid(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// prettier-ignore
function Visit(left: TSchema, right: TSchema): ExtendsResult {
  return (
    // resolvable
    (TypeGuard.IsTemplateLiteral(left) || TypeGuard.IsTemplateLiteral(right)) ? FromTemplateLiteral(left, right) :
    (TypeGuard.IsRegExp(left) || TypeGuard.IsRegExp(right)) ? FromRegExp(left, right) :
    (TypeGuard.IsNot(left) || TypeGuard.IsNot(right)) ? FromNot(left, right) :
    // standard
    TypeGuard.IsAny(left) ? FromAny(left, right) :
    TypeGuard.IsArray(left) ? FromArray(left, right) :
    TypeGuard.IsBigInt(left) ? FromBigInt(left, right) :
    TypeGuard.IsBoolean(left) ? FromBoolean(left, right) :
    TypeGuard.IsAsyncIterator(left) ? FromAsyncIterator(left, right) :
    TypeGuard.IsConstructor(left) ? FromConstructor(left, right) :
    TypeGuard.IsDate(left) ? FromDate(left, right) :
    TypeGuard.IsFunction(left) ? FromFunction(left, right) :
    TypeGuard.IsInteger(left) ? FromInteger(left, right) :
    TypeGuard.IsIntersect(left) ? FromIntersect(left, right) :
    TypeGuard.IsIterator(left) ? FromIterator(left, right) :
    TypeGuard.IsLiteral(left) ? FromLiteral(left, right) :
    TypeGuard.IsNever(left) ? FromNever(left, right) :
    TypeGuard.IsNull(left) ? FromNull(left, right) :
    TypeGuard.IsNumber(left) ? FromNumber(left, right) :
    TypeGuard.IsObject(left) ? FromObject(left, right) :
    TypeGuard.IsRecord(left) ? FromRecord(left, right) :
    TypeGuard.IsString(left) ? FromString(left, right) :
    TypeGuard.IsSymbol(left) ? FromSymbol(left, right) :
    TypeGuard.IsTuple(left) ? FromTuple(left, right) :
    TypeGuard.IsPromise(left) ? FromPromise(left, right) :
    TypeGuard.IsUint8Array(left) ? FromUint8Array(left, right) :
    TypeGuard.IsUndefined(left) ? FromUndefined(left, right) :
    TypeGuard.IsUnion(left) ? FromUnion(left, right) :
    TypeGuard.IsUnknown(left) ? FromUnknown(left, right) :
    TypeGuard.IsVoid(left) ? FromVoid(left, right) :
    Throw(`Unknown left type operand '${left[Kind]}'`)
  )
}
export function ExtendsCheck(left: TSchema, right: TSchema): ExtendsResult {
  return Visit(left, right)
}
