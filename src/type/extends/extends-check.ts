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
import { TypeGuard, ValueGuard } from '../guard/index'

export class ExtendsResolverError extends Error {}

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
    TypeGuard.TNever(right) ||
    TypeGuard.TIntersect(right) ||
    TypeGuard.TUnion(right) ||
    TypeGuard.TUnknown(right) ||
    TypeGuard.TAny(right)
  )
}
// prettier-ignore
function StructuralRight(left: TSchema, right: TSchema) {
  return (
    TypeGuard.TNever(right) ? TNeverRight(left, right) :
    TypeGuard.TIntersect(right) ? TIntersectRight(left, right) :
    TypeGuard.TUnion(right) ? TUnionRight(left, right) :
    TypeGuard.TUnknown(right) ? TUnknownRight(left, right) :
    TypeGuard.TAny(right) ? TAnyRight(left, right) :
    Throw('StructuralRight')
  )
}
// ------------------------------------------------------------------
// Any
// ------------------------------------------------------------------
// prettier-ignore
function TAnyRight(left: TSchema, right: TAny) {
  return ExtendsResult.True
}
// prettier-ignore
function TAny(left: TAny, right: TSchema) {
  return (
    TypeGuard.TIntersect(right) ? TIntersectRight(left, right) :
    (TypeGuard.TUnion(right) && right.anyOf.some((schema) => TypeGuard.TAny(schema) || TypeGuard.TUnknown(schema))) ? ExtendsResult.True :
    TypeGuard.TUnion(right) ? ExtendsResult.Union :
    TypeGuard.TUnknown(right) ? ExtendsResult.True :
    TypeGuard.TAny(right) ? ExtendsResult.True :
    ExtendsResult.Union
  )
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
// prettier-ignore
function TArrayRight(left: TSchema, right: TArray) {
  return (
    TypeGuard.TUnknown(left) ? ExtendsResult.False :
    TypeGuard.TAny(left) ? ExtendsResult.Union :
    TypeGuard.TNever(left) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// prettier-ignore
function TArray(left: TArray, right: TSchema) {
  return (
    TypeGuard.TObject(right) && IsObjectArrayLike(right) ? ExtendsResult.True :
    IsStructuralRight(right) ? StructuralRight(left, right) :
    !TypeGuard.TArray(right) ? ExtendsResult.False :
    IntoBooleanResult(Visit(left.items, right.items))
  )
}
// ------------------------------------------------------------------
// AsyncIterator
// ------------------------------------------------------------------
// prettier-ignore
function TAsyncIterator(left: TAsyncIterator, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    !TypeGuard.TAsyncIterator(right) ? ExtendsResult.False :
    IntoBooleanResult(Visit(left.items, right.items))
  )
}
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
// prettier-ignore
function TBigInt(left: TBigInt, right: TSchema): ExtendsResult {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    TypeGuard.TRecord(right) ? TRecordRight(left, right) :
    TypeGuard.TBigInt(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
// prettier-ignore
function TBooleanRight(left: TSchema, right: TBoolean) {
  return (
    TypeGuard.TLiteralBoolean(left) ? ExtendsResult.True : 
    TypeGuard.TBoolean(left) ? ExtendsResult.True : 
    ExtendsResult.False
  )
}
// prettier-ignore
function TBoolean(left: TBoolean, right: TSchema): ExtendsResult {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    TypeGuard.TRecord(right) ? TRecordRight(left, right) :
    TypeGuard.TBoolean(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
// prettier-ignore
function TConstructor(left: TConstructor, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    !TypeGuard.TConstructor(right) ? ExtendsResult.False :
    left.parameters.length > right.parameters.length ? ExtendsResult.False :
    (!left.parameters.every((schema, index) => IntoBooleanResult(Visit(right.parameters[index], schema)) === ExtendsResult.True)) ? ExtendsResult.False :
    IntoBooleanResult(Visit(left.returns, right.returns))
  )
}
// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
// prettier-ignore
function TDate(left: TDate, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    TypeGuard.TRecord(right) ? TRecordRight(left, right) :
    TypeGuard.TDate(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
// prettier-ignore
function TFunction(left: TFunction, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    !TypeGuard.TFunction(right) ? ExtendsResult.False :
    left.parameters.length > right.parameters.length ? ExtendsResult.False :
    (!left.parameters.every((schema, index) => IntoBooleanResult(Visit(right.parameters[index], schema)) === ExtendsResult.True)) ? ExtendsResult.False :
    IntoBooleanResult(Visit(left.returns, right.returns))
  )
}
// ------------------------------------------------------------------
// Integer
// ------------------------------------------------------------------
// prettier-ignore
function TIntegerRight(left: TSchema, right: TInteger) {
  return (
    TypeGuard.TLiteral(left) && ValueGuard.IsNumber(left.const) ? ExtendsResult.True :
    TypeGuard.TNumber(left) || TypeGuard.TInteger(left) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// prettier-ignore
function TInteger(left: TInteger, right: TSchema): ExtendsResult {
  return (
    TypeGuard.TInteger(right) || TypeGuard.TNumber(right) ? ExtendsResult.True :
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    TypeGuard.TRecord(right) ? TRecordRight(left, right) :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
// prettier-ignore
function TIntersectRight(left: TSchema, right: TIntersect): ExtendsResult {
  return right.allOf.every((schema) => Visit(left, schema) === ExtendsResult.True)
    ? ExtendsResult.True
    : ExtendsResult.False
}
// prettier-ignore
function TIntersect(left: TIntersect, right: TSchema) {
  return left.allOf.some((schema) => Visit(schema, right) === ExtendsResult.True)
    ? ExtendsResult.True
    : ExtendsResult.False
}
// ------------------------------------------------------------------
// Iterator
// ------------------------------------------------------------------
// prettier-ignore
function TIterator(left: TIterator, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    !TypeGuard.TIterator(right) ? ExtendsResult.False :
    IntoBooleanResult(Visit(left.items, right.items))
  )
}
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
// prettier-ignore
function TLiteral(left: TLiteral, right: TSchema): ExtendsResult {
  return (
    TypeGuard.TLiteral(right) && right.const === left.const ? ExtendsResult.True :
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    TypeGuard.TRecord(right) ? TRecordRight(left, right) :
    TypeGuard.TString(right) ? TStringRight(left, right) :
    TypeGuard.TNumber(right) ? TNumberRight(left, right) :
    TypeGuard.TInteger(right) ? TIntegerRight(left, right) :
    TypeGuard.TBoolean(right) ? TBooleanRight(left, right) :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Never
// ------------------------------------------------------------------
// prettier-ignore
function TNeverRight(left: TSchema, right: TNever) {
  return ExtendsResult.False
}
// prettier-ignore
function TNever(left: TNever, right: TSchema) {
  return ExtendsResult.True
}
// ------------------------------------------------------------------
// Not
// ------------------------------------------------------------------
// prettier-ignore
function UnwrapTNot<T extends TNot>(schema: T): TUnknown | TNot['not'] {
  let [current, depth]: [TSchema, number] = [schema, 0]
  while (true) {
    if (!TypeGuard.TNot(current)) break
    current = current.not
    depth += 1
  }
  return depth % 2 === 0 ? current : Unknown()
}
// prettier-ignore
function TNot(left: TSchema, right: TSchema) {
  // TypeScript has no concept of negated types, and attempts to correctly check the negated
  // type at runtime would put TypeBox at odds with TypeScripts ability to statically infer
  // the type. Instead we unwrap to either unknown or T and continue evaluating.
  // prettier-ignore
  return (
    TypeGuard.TNot(left) ? Visit(UnwrapTNot(left), right) :
    TypeGuard.TNot(right) ? Visit(left, UnwrapTNot(right)) :
    Throw('Invalid fallthrough for Not')
  )
}
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
// prettier-ignore
function TNull(left: TNull, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    TypeGuard.TRecord(right) ? TRecordRight(left, right) :
    TypeGuard.TNull(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
// prettier-ignore
function TNumberRight(left: TSchema, right: TNumber) {
  return (
    TypeGuard.TLiteralNumber(left) ? ExtendsResult.True :
    TypeGuard.TNumber(left) || TypeGuard.TInteger(left) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// prettier-ignore
function TNumber(left: TNumber, right: TSchema): ExtendsResult {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    TypeGuard.TRecord(right) ? TRecordRight(left, right) :
    TypeGuard.TInteger(right) || TypeGuard.TNumber(right) ? ExtendsResult.True :
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
    IsObjectPropertyCount(schema, 1) && 'description' in schema.properties && TypeGuard.TUnion(schema.properties.description) && schema.properties.description.anyOf.length === 2 && ((
      TypeGuard.TString(schema.properties.description.anyOf[0]) &&
      TypeGuard.TUndefined(schema.properties.description.anyOf[1])
    ) || (
        TypeGuard.TString(schema.properties.description.anyOf[1]) &&
        TypeGuard.TUndefined(schema.properties.description.anyOf[0])
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
    TypeGuard.TOptional(left) && !TypeGuard.TOptional(right) ? ExtendsResult.False :
    ExtendsResult.True
  )
}
// prettier-ignore
function TObjectRight(left: TSchema, right: TObject) {
  return (
    TypeGuard.TUnknown(left) ? ExtendsResult.False :
    TypeGuard.TAny(left) ? ExtendsResult.Union : (
      TypeGuard.TNever(left) ||
      (TypeGuard.TLiteralString(left) && IsObjectStringLike(right)) ||
      (TypeGuard.TLiteralNumber(left) && IsObjectNumberLike(right)) ||
      (TypeGuard.TLiteralBoolean(left) && IsObjectBooleanLike(right)) ||
      (TypeGuard.TSymbol(left) && IsObjectSymbolLike(right)) ||
      (TypeGuard.TBigInt(left) && IsObjectBigIntLike(right)) ||
      (TypeGuard.TString(left) && IsObjectStringLike(right)) ||
      (TypeGuard.TSymbol(left) && IsObjectSymbolLike(right)) ||
      (TypeGuard.TNumber(left) && IsObjectNumberLike(right)) ||
      (TypeGuard.TInteger(left) && IsObjectNumberLike(right)) ||
      (TypeGuard.TBoolean(left) && IsObjectBooleanLike(right)) ||
      (TypeGuard.TUint8Array(left) && IsObjectUint8ArrayLike(right)) ||
      (TypeGuard.TDate(left) && IsObjectDateLike(right)) ||
      (TypeGuard.TConstructor(left) && IsObjectConstructorLike(right)) ||
      (TypeGuard.TFunction(left) && IsObjectFunctionLike(right))
    ) ? ExtendsResult.True :
    (TypeGuard.TRecord(left) && TypeGuard.TString(RecordKey(left))) ? (() => {
      // When expressing a Record with literal key values, the Record is converted into a Object with
      // the Hint assigned as `Record`. This is used to invert the extends logic.
      return right[Hint] === 'Record' ? ExtendsResult.True : ExtendsResult.False
    })() :
    (TypeGuard.TRecord(left) && TypeGuard.TNumber(RecordKey(left))) ? (() => {
      return IsObjectPropertyCount(right, 0) ? ExtendsResult.True : ExtendsResult.False
    })() :
    ExtendsResult.False
  )
}
// prettier-ignore
function TObject(left: TObject, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TRecord(right) ? TRecordRight(left, right) :
    !TypeGuard.TObject(right) ? ExtendsResult.False :
    (() => {
        for (const key of Object.getOwnPropertyNames(right.properties)) {
          if (!(key in left.properties) && !TypeGuard.TOptional(right.properties[key])) {
          return ExtendsResult.False
        }
        if (TypeGuard.TOptional(right.properties[key])) {
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
function TPromise(left: TPromise, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) && IsObjectPromiseLike(right) ? ExtendsResult.True :
    !TypeGuard.TPromise(right) ? ExtendsResult.False :
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
function TRecordRight(left: TSchema, right: TRecord) {
  const [Key, Value] = [RecordKey(right), RecordValue(right)]
  return (
    (
      TypeGuard.TLiteralString(left) && TypeGuard.TNumber(Key) && IntoBooleanResult(Visit(left, Value)) === ExtendsResult.True) ? ExtendsResult.True :
      TypeGuard.TUint8Array(left) && TypeGuard.TNumber(Key) ? Visit(left, Value) :
      TypeGuard.TString(left) && TypeGuard.TNumber(Key) ? Visit(left, Value) :
      TypeGuard.TArray(left) && TypeGuard.TNumber(Key) ? Visit(left, Value) :
      TypeGuard.TObject(left) ? (() => {
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
function TRecord(left: TRecord, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    !TypeGuard.TRecord(right) ? ExtendsResult.False :
    Visit(RecordValue(left), RecordValue(right))
  )
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
// prettier-ignore
function TStringRight(left: TSchema, right: TString) {
  return (
    TypeGuard.TLiteral(left) && ValueGuard.IsString(left.const) ? ExtendsResult.True :
    TypeGuard.TString(left) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// prettier-ignore
function TString(left: TString, right: TSchema): ExtendsResult {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    TypeGuard.TRecord(right) ? TRecordRight(left, right) :
    TypeGuard.TString(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Symbol
// ------------------------------------------------------------------
// prettier-ignore
function TSymbol(left: TSymbol, right: TSchema): ExtendsResult {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    TypeGuard.TRecord(right) ? TRecordRight(left, right) :
    TypeGuard.TSymbol(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// TemplateLiteral
// ------------------------------------------------------------------
// prettier-ignore
function TTemplateLiteral(left: TSchema, right: TSchema) {
  // TemplateLiteral types are resolved to either unions for finite expressions or string
  // for infinite expressions. Here we call to TemplateLiteralResolver to resolve for
  // either type and continue evaluating.
  return (
    TypeGuard.TTemplateLiteral(left) ? Visit(TemplateLiteralToUnion(left), right) :
    TypeGuard.TTemplateLiteral(right) ? Visit(left, TemplateLiteralToUnion(right)) :
    Throw('Invalid fallthrough for TemplateLiteral')
  )
}
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
function IsArrayOfTuple(left: TTuple, right: TSchema) {
  return (
    TypeGuard.TArray(right) &&
    left.items !== undefined &&
    left.items.every((schema) => Visit(schema, right.items) === ExtendsResult.True)
  )
}
// prettier-ignore
function TTupleRight(left: TSchema, right: TTuple) {
  return (
    TypeGuard.TNever(left) ? ExtendsResult.True :
    TypeGuard.TUnknown(left) ? ExtendsResult.False :
    TypeGuard.TAny(left) ? ExtendsResult.Union :
    ExtendsResult.False
  )
}
// prettier-ignore
function TTuple(left: TTuple, right: TSchema): ExtendsResult {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) && IsObjectArrayLike(right) ? ExtendsResult.True :
    TypeGuard.TArray(right) && IsArrayOfTuple(left, right) ? ExtendsResult.True :
    !TypeGuard.TTuple(right) ? ExtendsResult.False :
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
function TUint8Array(left: TUint8Array, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    TypeGuard.TRecord(right) ? TRecordRight(left, right) :
    TypeGuard.TUint8Array(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
// prettier-ignore
function TUndefined(left: TUndefined, right: TSchema) {
  return (
    IsStructuralRight(right) ? StructuralRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    TypeGuard.TRecord(right) ? TRecordRight(left, right) :
    TypeGuard.TVoid(right) ? VoidRight(left, right) :
    TypeGuard.TUndefined(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
function TUnionRight(left: TSchema, right: TUnion): ExtendsResult {
  return right.anyOf.some((schema) => Visit(left, schema) === ExtendsResult.True)
    ? ExtendsResult.True
    : ExtendsResult.False
}
// prettier-ignore
function TUnion(left: TUnion, right: TSchema): ExtendsResult {
  return left.anyOf.every((schema) => Visit(schema, right) === ExtendsResult.True)
    ? ExtendsResult.True
    : ExtendsResult.False
}
// ------------------------------------------------------------------
// Unknown
// ------------------------------------------------------------------
// prettier-ignore
function TUnknownRight(left: TSchema, right: TUnknown) {
  return ExtendsResult.True
}
// prettier-ignore
function TUnknown(left: TUnknown, right: TSchema) {
  return (
    TypeGuard.TNever(right) ? TNeverRight(left, right) :
    TypeGuard.TIntersect(right) ? TIntersectRight(left, right) :
    TypeGuard.TUnion(right) ? TUnionRight(left, right) :
    TypeGuard.TAny(right) ? TAnyRight(left, right) :
    TypeGuard.TString(right) ? TStringRight(left, right) :
    TypeGuard.TNumber(right) ? TNumberRight(left, right) :
    TypeGuard.TInteger(right) ? TIntegerRight(left, right) :
    TypeGuard.TBoolean(right) ? TBooleanRight(left, right) :
    TypeGuard.TArray(right) ? TArrayRight(left, right) :
    TypeGuard.TTuple(right) ? TTupleRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    TypeGuard.TUnknown(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// ------------------------------------------------------------------
// Void
// ------------------------------------------------------------------
// prettier-ignore
function VoidRight(left: TSchema, right: TVoid) {
  return (
    TypeGuard.TUndefined(left) ? ExtendsResult.True :
    TypeGuard.TUndefined(left) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// prettier-ignore
function TVoid(left: TVoid, right: TSchema) {
  return (
    TypeGuard.TIntersect(right) ? TIntersectRight(left, right) :
    TypeGuard.TUnion(right) ? TUnionRight(left, right) :
    TypeGuard.TUnknown(right) ? TUnknownRight(left, right) :
    TypeGuard.TAny(right) ? TAnyRight(left, right) :
    TypeGuard.TObject(right) ? TObjectRight(left, right) :
    TypeGuard.TVoid(right) ? ExtendsResult.True :
    ExtendsResult.False
  )
}
// prettier-ignore
function Visit(left: TSchema, right: TSchema): ExtendsResult {
  return (
    // resolvable
    (TypeGuard.TTemplateLiteral(left) || TypeGuard.TTemplateLiteral(right)) ? TTemplateLiteral(left, right) :
    (TypeGuard.TNot(left) || TypeGuard.TNot(right)) ? TNot(left, right) :
    // standard
    TypeGuard.TAny(left) ? TAny(left, right) :
    TypeGuard.TArray(left) ? TArray(left, right) :
    TypeGuard.TBigInt(left) ? TBigInt(left, right) :
    TypeGuard.TBoolean(left) ? TBoolean(left, right) :
    TypeGuard.TAsyncIterator(left) ? TAsyncIterator(left, right) :
    TypeGuard.TConstructor(left) ? TConstructor(left, right) :
    TypeGuard.TDate(left) ? TDate(left, right) :
    TypeGuard.TFunction(left) ? TFunction(left, right) :
    TypeGuard.TInteger(left) ? TInteger(left, right) :
    TypeGuard.TIntersect(left) ? TIntersect(left, right) :
    TypeGuard.TIterator(left) ? TIterator(left, right) :
    TypeGuard.TLiteral(left) ? TLiteral(left, right) :
    TypeGuard.TNever(left) ? TNever(left, right) :
    TypeGuard.TNull(left) ? TNull(left, right) :
    TypeGuard.TNumber(left) ? TNumber(left, right) :
    TypeGuard.TObject(left) ? TObject(left, right) :
    TypeGuard.TRecord(left) ? TRecord(left, right) :
    TypeGuard.TString(left) ? TString(left, right) :
    TypeGuard.TSymbol(left) ? TSymbol(left, right) :
    TypeGuard.TTuple(left) ? TTuple(left, right) :
    TypeGuard.TPromise(left) ? TPromise(left, right) :
    TypeGuard.TUint8Array(left) ? TUint8Array(left, right) :
    TypeGuard.TUndefined(left) ? TUndefined(left, right) :
    TypeGuard.TUnion(left) ? TUnion(left, right) :
    TypeGuard.TUnknown(left) ? TUnknown(left, right) :
    TypeGuard.TVoid(left) ? TVoid(left, right) :
    Throw(`Unknown left type operand '${left[Kind]}'`)
  )
}
export function ExtendsCheck(left: TSchema, right: TSchema): ExtendsResult {
  return Visit(left, right)
}
