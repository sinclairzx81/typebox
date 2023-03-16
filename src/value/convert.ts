/*--------------------------------------------------------------------------

@sinclair/typebox/value

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

import * as Types from '../typebox'
import { ValueClone } from './clone'

// ----------------------------------------------------------------------------------------------
// Errors
// ----------------------------------------------------------------------------------------------
export class ValueConvertReferenceTypeError extends Error {
  constructor(public readonly schema: Types.TRef | Types.TSelf) {
    super(`ValueConvert: Cannot locate referenced schema with $id '${schema.$ref}'`)
  }
}
export class ValueConvertUnknownTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueConvert: Unknown type')
  }
}
export namespace ValueConvert {
  // ----------------------------------------------------------------------------------------------
  // Guards
  // ----------------------------------------------------------------------------------------------
  function IsObject(value: unknown): value is Record<keyof any, unknown> {
    return typeof value === 'object' && value !== null && !globalThis.Array.isArray(value)
  }
  function IsArray(value: unknown): value is unknown[] {
    return typeof value === 'object' && globalThis.Array.isArray(value)
  }
  function IsDate(value: unknown): value is Date {
    return typeof value === 'object' && value instanceof globalThis.Date
  }
  function IsSymbol(value: unknown): value is symbol {
    return typeof value === 'symbol'
  }
  function IsString(value: unknown): value is string {
    return typeof value === 'string'
  }
  function IsBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
  }
  function IsBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint'
  }
  function IsNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value)
  }
  function IsStringNumeric(value: unknown): value is string {
    return IsString(value) && !isNaN(value as any) && !isNaN(parseFloat(value))
  }
  function IsValueToString(value: unknown): value is { toString: () => string } {
    return IsBigInt(value) || IsBoolean(value) || IsNumber(value)
  }
  function IsValueTrue(value: unknown): value is true {
    return value === true || (IsNumber(value) && value === 1) || (IsBigInt(value) && value === globalThis.BigInt('1')) || (IsString(value) && (value.toLowerCase() === 'true' || value === '1'))
  }
  function IsValueFalse(value: unknown): value is true {
    return value === false || (IsNumber(value) && value === 0) || (IsBigInt(value) && value === globalThis.BigInt('0')) || (IsString(value) && (value.toLowerCase() === 'false' || value === '0'))
  }
  function IsTimeStringWithTimeZone(value: unknown): value is string {
    return IsString(value) && /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i.test(value)
  }
  function IsTimeStringWithoutTimeZone(value: unknown): value is string {
    return IsString(value) && /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)?$/i.test(value)
  }
  function IsDateTimeStringWithTimeZone(value: unknown): value is string {
    return IsString(value) && /^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i.test(value)
  }
  function IsDateTimeStringWithoutTimeZone(value: unknown): value is string {
    return IsString(value) && /^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)?$/i.test(value)
  }
  function IsDateString(value: unknown): value is string {
    return IsString(value) && /^\d\d\d\d-[0-1]\d-[0-3]\d$/i.test(value)
  }
  // ----------------------------------------------------------------------------------------------
  // Convert
  // ----------------------------------------------------------------------------------------------
  function TryConvertLiteralString(value: unknown, target: string) {
    const conversion = TryConvertString(value)
    return conversion === target ? conversion : value
  }
  function TryConvertLiteralNumber(value: unknown, target: number) {
    const conversion = TryConvertNumber(value)
    return conversion === target ? conversion : value
  }
  function TryConvertLiteralBoolean(value: unknown, target: boolean) {
    const conversion = TryConvertBoolean(value)
    return conversion === target ? conversion : value
  }
  function TryConvertLiteral(schema: Types.TLiteral, value: unknown) {
    if (typeof schema.const === 'string') {
      return TryConvertLiteralString(value, schema.const)
    } else if (typeof schema.const === 'number') {
      return TryConvertLiteralNumber(value, schema.const)
    } else if (typeof schema.const === 'boolean') {
      return TryConvertLiteralBoolean(value, schema.const)
    } else {
      return ValueClone.Clone(value)
    }
  }
  function TryConvertBoolean(value: unknown) {
    return IsValueTrue(value) ? true : IsValueFalse(value) ? false : value
  }
  function TryConvertBigInt(value: unknown) {
    return IsStringNumeric(value) ? globalThis.BigInt(parseInt(value)) : IsNumber(value) ? globalThis.BigInt(value | 0) : IsValueFalse(value) ? 0 : IsValueTrue(value) ? 1 : value
  }

  function TryConvertString(value: unknown) {
    return IsValueToString(value) ? value.toString() : IsSymbol(value) && value.description !== undefined ? value.description.toString() : value
  }
  function TryConvertNumber(value: unknown) {
    return IsStringNumeric(value) ? parseFloat(value) : IsValueTrue(value) ? 1 : IsValueFalse(value) ? 0 : value
  }
  function TryConvertInteger(value: unknown) {
    return IsStringNumeric(value) ? parseInt(value) : IsNumber(value) ? value | 0 : IsValueTrue(value) ? 1 : IsValueFalse(value) ? 0 : value
  }
  function TryConvertNull(value: unknown) {
    return IsString(value) && value.toLowerCase() === 'null' ? null : value
  }
  function TryConvertUndefined(value: unknown) {
    return IsString(value) && value === 'undefined' ? undefined : value
  }
  function TryConvertDate(value: unknown) {
    // note: this function may return an invalid dates for the regex tests
    // above. Invalid dates will however be checked during the casting
    // function and will return a epoch date if invalid. Consider better
    // string parsing for the iso dates in future revisions.
    return IsDate(value)
      ? value
      : IsNumber(value)
      ? new globalThis.Date(value)
      : IsValueTrue(value)
      ? new globalThis.Date(1)
      : IsValueFalse(value)
      ? new globalThis.Date(0)
      : IsStringNumeric(value)
      ? new globalThis.Date(parseInt(value))
      : IsTimeStringWithoutTimeZone(value)
      ? new globalThis.Date(`1970-01-01T${value}.000Z`)
      : IsTimeStringWithTimeZone(value)
      ? new globalThis.Date(`1970-01-01T${value}`)
      : IsDateTimeStringWithoutTimeZone(value)
      ? new globalThis.Date(`${value}.000Z`)
      : IsDateTimeStringWithTimeZone(value)
      ? new globalThis.Date(value)
      : IsDateString(value)
      ? new globalThis.Date(`${value}T00:00:00.000Z`)
      : value
  }

  // ----------------------------------------------------------------------------------------------
  // Cast
  // ----------------------------------------------------------------------------------------------
  function Any(schema: Types.TAny, value: any): any {
    return value
  }
  function Array(schema: Types.TArray, value: any): any {
    if (IsArray(value)) {
      return value.map((value) => Visit(schema.items, value))
    }
    return value
  }
  function BigInt(schema: Types.TBigInt, value: any): unknown {
    return TryConvertBigInt(value)
  }
  function Boolean(schema: Types.TBoolean, value: any): unknown {
    return TryConvertBoolean(value)
  }
  function Constructor(schema: Types.TConstructor, value: any): unknown {
    return ValueClone.Clone(value)
  }
  function Date(schema: Types.TDate, value: any): unknown {
    return TryConvertDate(value)
  }
  function Function(schema: Types.TFunction, value: any): unknown {
    return value
  }
  function Integer(schema: Types.TInteger, value: any): unknown {
    return TryConvertInteger(value)
  }
  function Intersect(schema: Types.TIntersect, value: any): unknown {
    return value
  }
  function Literal(schema: Types.TLiteral, value: any): unknown {
    return TryConvertLiteral(schema, value)
  }
  function Never(schema: Types.TNever, value: any): unknown {
    return value
  }
  function Null(schema: Types.TNull, value: any): unknown {
    return TryConvertNull(value)
  }
  function Number(schema: Types.TNumber, value: any): unknown {
    return TryConvertNumber(value)
  }
  function Object(schema: Types.TObject, value: any): unknown {
    if (IsObject(value))
      return globalThis.Object.keys(schema.properties).reduce((acc, key) => {
        return value[key] !== undefined ? { ...acc, [key]: Visit(schema.properties[key], value[key]) } : { ...acc }
      }, value)
    return value
  }
  function Promise(schema: Types.TSchema, value: any): unknown {
    return value
  }
  function Record(schema: Types.TRecord<any, any>, value: any): unknown {
    return value
  }
  function Ref(schema: Types.TRef<any>, value: any): unknown {
    return Visit(Types.ReferenceRegistry.DerefOne(schema), value)
  }
  function Self(schema: Types.TSelf, value: any): unknown {
    return Visit(Types.ReferenceRegistry.DerefOne(schema), value)
  }
  function String(schema: Types.TString, value: any): unknown {
    return TryConvertString(value)
  }
  function Symbol(schema: Types.TSymbol, value: any): unknown {
    return value
  }
  function Tuple(schema: Types.TTuple<any[]>, value: any): unknown {
    if (IsArray(value) && schema.items !== undefined) {
      return value.map((value, index) => {
        return index < schema.items!.length ? Visit(schema.items![index], value) : value
      })
    }
    return value
  }
  function Undefined(schema: Types.TUndefined, value: any): unknown {
    return TryConvertUndefined(value)
  }
  function Union(schema: Types.TUnion, value: any): unknown {
    return value
  }
  function Uint8Array(schema: Types.TUint8Array, value: any): unknown {
    return value
  }
  function Unknown(schema: Types.TUnknown, value: any): unknown {
    return value
  }
  function Void(schema: Types.TVoid, value: any): unknown {
    return value
  }
  function UserDefined(schema: Types.TSchema, value: any): unknown {
    return value
  }
  export function Visit(schema: Types.TSchema, value: any): unknown {
    const anySchema = schema as any
    switch (schema[Types.Kind]) {
      case 'Any':
        return Any(anySchema, value)
      case 'Array':
        return Array(anySchema, value)
      case 'BigInt':
        return BigInt(anySchema, value)
      case 'Boolean':
        return Boolean(anySchema, value)
      case 'Constructor':
        return Constructor(anySchema, value)
      case 'Date':
        return Date(anySchema, value)
      case 'Function':
        return Function(anySchema, value)
      case 'Integer':
        return Integer(anySchema, value)
      case 'Intersect':
        return Intersect(anySchema, value)
      case 'Literal':
        return Literal(anySchema, value)
      case 'Never':
        return Never(anySchema, value)
      case 'Null':
        return Null(anySchema, value)
      case 'Number':
        return Number(anySchema, value)
      case 'Object':
        return Object(anySchema, value)
      case 'Promise':
        return Promise(anySchema, value)
      case 'Record':
        return Record(anySchema, value)
      case 'Ref':
        return Ref(anySchema, value)
      case 'Self':
        return Self(anySchema, value)
      case 'String':
        return String(anySchema, value)
      case 'Symbol':
        return Symbol(anySchema, value)
      case 'Tuple':
        return Tuple(anySchema, value)
      case 'Undefined':
        return Undefined(anySchema, value)
      case 'Union':
        return Union(anySchema, value)
      case 'Uint8Array':
        return Uint8Array(anySchema, value)
      case 'Unknown':
        return Unknown(anySchema, value)
      case 'Void':
        return Void(anySchema, value)
      default:
        if (!Types.TypeRegistry.Has(anySchema[Types.Kind])) throw new ValueConvertUnknownTypeError(anySchema)
        return UserDefined(anySchema, value)
    }
  }
  export function Convert<T extends Types.TSchema>(schema: T, value: any): unknown {
    return Visit(schema, ValueClone.Clone(value))
  }
}
