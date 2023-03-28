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
import { ValueCheck } from './check'

// ----------------------------------------------------------------------------------------------
// Errors
// ----------------------------------------------------------------------------------------------
export class ValueConvertUnknownTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueConvert: Unknown type')
  }
}
export class ValueConvertDereferenceError extends Error {
  constructor(public readonly schema: Types.TRef | Types.TSelf) {
    super(`ValueConvert: Unable to dereference schema with $id '${schema.$ref}'`)
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
  function Any(schema: Types.TAny, references: Types.TSchema[], value: any): any {
    return value
  }
  function Array(schema: Types.TArray, references: Types.TSchema[], value: any): any {
    if (IsArray(value)) {
      return value.map((value) => Visit(schema.items, references, value))
    }
    return value
  }
  function BigInt(schema: Types.TBigInt, references: Types.TSchema[], value: any): unknown {
    return TryConvertBigInt(value)
  }
  function Boolean(schema: Types.TBoolean, references: Types.TSchema[], value: any): unknown {
    return TryConvertBoolean(value)
  }
  function Constructor(schema: Types.TConstructor, references: Types.TSchema[], value: any): unknown {
    return ValueClone.Clone(value)
  }
  function Date(schema: Types.TDate, references: Types.TSchema[], value: any): unknown {
    return TryConvertDate(value)
  }
  function Function(schema: Types.TFunction, references: Types.TSchema[], value: any): unknown {
    return value
  }
  function Integer(schema: Types.TInteger, references: Types.TSchema[], value: any): unknown {
    return TryConvertInteger(value)
  }
  function Intersect(schema: Types.TIntersect, references: Types.TSchema[], value: any): unknown {
    return value
  }
  function Literal(schema: Types.TLiteral, references: Types.TSchema[], value: any): unknown {
    return TryConvertLiteral(schema, value)
  }
  function Never(schema: Types.TNever, references: Types.TSchema[], value: any): unknown {
    return value
  }
  function Null(schema: Types.TNull, references: Types.TSchema[], value: any): unknown {
    return TryConvertNull(value)
  }
  function Number(schema: Types.TNumber, references: Types.TSchema[], value: any): unknown {
    return TryConvertNumber(value)
  }
  function Object(schema: Types.TObject, references: Types.TSchema[], value: any): unknown {
    if (IsObject(value))
      return globalThis.Object.keys(schema.properties).reduce((acc, key) => {
        return value[key] !== undefined ? { ...acc, [key]: Visit(schema.properties[key], references, value[key]) } : { ...acc }
      }, value)
    return value
  }
  function Promise(schema: Types.TSchema, references: Types.TSchema[], value: any): unknown {
    return value
  }
  function Record(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: any): unknown {
    const propertyKey = globalThis.Object.getOwnPropertyNames(schema.patternProperties)[0]
    const property = schema.patternProperties[propertyKey]
    const result = {} as Record<string, unknown>
    for (const [propKey, propValue] of globalThis.Object.entries(value)) {
      result[propKey] = Visit(property, references, propValue)
    }
    return result
  }
  function Ref(schema: Types.TRef<any>, references: Types.TSchema[], value: any): unknown {
    const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
    if (index === -1) throw new ValueConvertDereferenceError(schema)
    const target = references[index]
    return Visit(target, references, value)
  }
  function Self(schema: Types.TSelf, references: Types.TSchema[], value: any): unknown {
    const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
    if (index === -1) throw new ValueConvertDereferenceError(schema)
    const target = references[index]
    return Visit(target, references, value)
  }
  function String(schema: Types.TString, references: Types.TSchema[], value: any): unknown {
    return TryConvertString(value)
  }
  function Symbol(schema: Types.TSymbol, references: Types.TSchema[], value: any): unknown {
    return value
  }
  function Tuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], value: any): unknown {
    if (IsArray(value) && schema.items !== undefined) {
      return value.map((value, index) => {
        return index < schema.items!.length ? Visit(schema.items![index], references, value) : value
      })
    }
    return value
  }
  function Undefined(schema: Types.TUndefined, references: Types.TSchema[], value: any): unknown {
    return TryConvertUndefined(value)
  }
  function Union(schema: Types.TUnion, references: Types.TSchema[], value: any): unknown {
    for (const subschema of schema.anyOf) {
      const converted = Visit(subschema, references, value)
      if (ValueCheck.Check(subschema, references, converted)) {
        return converted
      }
    }
    return value
  }
  function Uint8Array(schema: Types.TUint8Array, references: Types.TSchema[], value: any): unknown {
    return value
  }
  function Unknown(schema: Types.TUnknown, references: Types.TSchema[], value: any): unknown {
    return value
  }
  function Void(schema: Types.TVoid, references: Types.TSchema[], value: any): unknown {
    return value
  }
  function UserDefined(schema: Types.TSchema, references: Types.TSchema[], value: any): unknown {
    return value
  }
  export function Visit(schema: Types.TSchema, references: Types.TSchema[], value: any): unknown {
    const references_ = IsString(schema.$id) ? [...references, schema] : references
    const schema_ = schema as any
    switch (schema[Types.Kind]) {
      case 'Any':
        return Any(schema_, references_, value)
      case 'Array':
        return Array(schema_, references_, value)
      case 'BigInt':
        return BigInt(schema_, references_, value)
      case 'Boolean':
        return Boolean(schema_, references_, value)
      case 'Constructor':
        return Constructor(schema_, references_, value)
      case 'Date':
        return Date(schema_, references_, value)
      case 'Function':
        return Function(schema_, references_, value)
      case 'Integer':
        return Integer(schema_, references_, value)
      case 'Intersect':
        return Intersect(schema_, references_, value)
      case 'Literal':
        return Literal(schema_, references_, value)
      case 'Never':
        return Never(schema_, references_, value)
      case 'Null':
        return Null(schema_, references_, value)
      case 'Number':
        return Number(schema_, references_, value)
      case 'Object':
        return Object(schema_, references_, value)
      case 'Promise':
        return Promise(schema_, references_, value)
      case 'Record':
        return Record(schema_, references_, value)
      case 'Ref':
        return Ref(schema_, references_, value)
      case 'Self':
        return Self(schema_, references_, value)
      case 'String':
        return String(schema_, references_, value)
      case 'Symbol':
        return Symbol(schema_, references_, value)
      case 'Tuple':
        return Tuple(schema_, references_, value)
      case 'Undefined':
        return Undefined(schema_, references_, value)
      case 'Union':
        return Union(schema_, references_, value)
      case 'Uint8Array':
        return Uint8Array(schema_, references_, value)
      case 'Unknown':
        return Unknown(schema_, references_, value)
      case 'Void':
        return Void(schema_, references_, value)
      default:
        if (!Types.TypeRegistry.Has(schema_[Types.Kind])) throw new ValueConvertUnknownTypeError(schema_)
        return UserDefined(schema_, references_, value)
    }
  }
  export function Convert<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: any): unknown {
    return Visit(schema, references, ValueClone.Clone(value))
  }
}
