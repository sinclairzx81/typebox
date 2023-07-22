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
import * as ValueClone from './clone'
import * as ValueCheck from './check'
import * as ValueGuard from './guard'

// --------------------------------------------------------------------------
// Errors
// --------------------------------------------------------------------------
export class ValueConvertUnknownTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueConvert: Unknown type')
  }
}
export class ValueConvertDereferenceError extends Error {
  constructor(public readonly schema: Types.TRef | Types.TThis) {
    super(`ValueConvert: Unable to dereference schema with $id '${schema.$ref}'`)
  }
}
// --------------------------------------------------------------------------
// Conversions
// --------------------------------------------------------------------------
function IsStringNumeric(value: unknown): value is string {
  return ValueGuard.IsString(value) && !isNaN(value as any) && !isNaN(parseFloat(value))
}
function IsValueToString(value: unknown): value is { toString: () => string } {
  return ValueGuard.IsBigInt(value) || ValueGuard.IsBoolean(value) || ValueGuard.IsNumber(value)
}
function IsValueTrue(value: unknown): value is true {
  return value === true || (ValueGuard.IsNumber(value) && value === 1) || (ValueGuard.IsBigInt(value) && value === BigInt('1')) || (ValueGuard.IsString(value) && (value.toLowerCase() === 'true' || value === '1'))
}
function IsValueFalse(value: unknown): value is false {
  return value === false || (ValueGuard.IsNumber(value) && value === 0) || (ValueGuard.IsBigInt(value) && value === BigInt('0')) || (ValueGuard.IsString(value) && (value.toLowerCase() === 'false' || value === '0'))
}
function IsTimeStringWithTimeZone(value: unknown): value is string {
  return ValueGuard.IsString(value) && /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i.test(value)
}
function IsTimeStringWithoutTimeZone(value: unknown): value is string {
  return ValueGuard.IsString(value) && /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)?$/i.test(value)
}
function IsDateTimeStringWithTimeZone(value: unknown): value is string {
  return ValueGuard.IsString(value) && /^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i.test(value)
}
function IsDateTimeStringWithoutTimeZone(value: unknown): value is string {
  return ValueGuard.IsString(value) && /^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)?$/i.test(value)
}
function IsDateString(value: unknown): value is string {
  return ValueGuard.IsString(value) && /^\d\d\d\d-[0-1]\d-[0-3]\d$/i.test(value)
}
// --------------------------------------------------------------------------
// Convert
// --------------------------------------------------------------------------
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
  return IsStringNumeric(value) ? BigInt(parseInt(value)) : ValueGuard.IsNumber(value) ? BigInt(value | 0) : IsValueFalse(value) ? 0 : IsValueTrue(value) ? 1 : value
}
function TryConvertString(value: unknown) {
  return IsValueToString(value) ? value.toString() : ValueGuard.IsSymbol(value) && value.description !== undefined ? value.description.toString() : value
}
function TryConvertNumber(value: unknown) {
  return IsStringNumeric(value) ? parseFloat(value) : IsValueTrue(value) ? 1 : IsValueFalse(value) ? 0 : value
}
function TryConvertInteger(value: unknown) {
  return IsStringNumeric(value) ? parseInt(value) : ValueGuard.IsNumber(value) ? value | 0 : IsValueTrue(value) ? 1 : IsValueFalse(value) ? 0 : value
}
function TryConvertNull(value: unknown) {
  return ValueGuard.IsString(value) && value.toLowerCase() === 'null' ? null : value
}
function TryConvertUndefined(value: unknown) {
  return ValueGuard.IsString(value) && value === 'undefined' ? undefined : value
}
function TryConvertDate(value: unknown) {
  // --------------------------------------------------------------------------
  // note: this function may return an invalid dates for the regex tests
  // above. Invalid dates will however be checked during the casting function
  // and will return a epoch date if invalid. Consider better string parsing
  // for the iso dates in future revisions.
  // --------------------------------------------------------------------------
  return ValueGuard.IsDate(value)
    ? value
    : ValueGuard.IsNumber(value)
    ? new Date(value)
    : IsValueTrue(value)
    ? new Date(1)
    : IsValueFalse(value)
    ? new Date(0)
    : IsStringNumeric(value)
    ? new Date(parseInt(value))
    : IsTimeStringWithoutTimeZone(value)
    ? new Date(`1970-01-01T${value}.000Z`)
    : IsTimeStringWithTimeZone(value)
    ? new Date(`1970-01-01T${value}`)
    : IsDateTimeStringWithoutTimeZone(value)
    ? new Date(`${value}.000Z`)
    : IsDateTimeStringWithTimeZone(value)
    ? new Date(value)
    : IsDateString(value)
    ? new Date(`${value}T00:00:00.000Z`)
    : value
}
// --------------------------------------------------------------------------
// Cast
// --------------------------------------------------------------------------
function TAny(schema: Types.TAny, references: Types.TSchema[], value: any): any {
  return value
}
function TArray(schema: Types.TArray, references: Types.TSchema[], value: any): any {
  if (ValueGuard.IsArray(value)) {
    return value.map((value) => Visit(schema.items, references, value))
  }
  return value
}
function TAsyncIterator(schema: Types.TAsyncIterator, references: Types.TSchema[], value: any): any {
  return value
}
function TBigInt(schema: Types.TBigInt, references: Types.TSchema[], value: any): unknown {
  return TryConvertBigInt(value)
}
function TBoolean(schema: Types.TBoolean, references: Types.TSchema[], value: any): unknown {
  return TryConvertBoolean(value)
}
function TConstructor(schema: Types.TConstructor, references: Types.TSchema[], value: any): unknown {
  return ValueClone.Clone(value)
}
function TDate(schema: Types.TDate, references: Types.TSchema[], value: any): unknown {
  return TryConvertDate(value)
}
function TFunction(schema: Types.TFunction, references: Types.TSchema[], value: any): unknown {
  return value
}
function TInteger(schema: Types.TInteger, references: Types.TSchema[], value: any): unknown {
  return TryConvertInteger(value)
}
function TIntersect(schema: Types.TIntersect, references: Types.TSchema[], value: any): unknown {
  return value
}
function TIterator(schema: Types.TIterator, references: Types.TSchema[], value: any): unknown {
  return value
}
function TLiteral(schema: Types.TLiteral, references: Types.TSchema[], value: any): unknown {
  return TryConvertLiteral(schema, value)
}
function TNever(schema: Types.TNever, references: Types.TSchema[], value: any): unknown {
  return value
}
function TNull(schema: Types.TNull, references: Types.TSchema[], value: any): unknown {
  return TryConvertNull(value)
}
function TNumber(schema: Types.TNumber, references: Types.TSchema[], value: any): unknown {
  return TryConvertNumber(value)
}
function TObject(schema: Types.TObject, references: Types.TSchema[], value: any): unknown {
  if (ValueGuard.IsObject(value))
    return Object.getOwnPropertyNames(schema.properties).reduce((acc, key) => {
      return value[key] !== undefined ? { ...acc, [key]: Visit(schema.properties[key], references, value[key]) } : { ...acc }
    }, value)
  return value
}
function TPromise(schema: Types.TSchema, references: Types.TSchema[], value: any): unknown {
  return value
}
function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: any): unknown {
  const propertyKey = Object.getOwnPropertyNames(schema.patternProperties)[0]
  const property = schema.patternProperties[propertyKey]
  const result = {} as Record<string, unknown>
  for (const [propKey, propValue] of Object.entries(value)) {
    result[propKey] = Visit(property, references, propValue)
  }
  return result
}
function TRef(schema: Types.TRef<any>, references: Types.TSchema[], value: any): unknown {
  const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
  if (index === -1) throw new ValueConvertDereferenceError(schema)
  const target = references[index]
  return Visit(target, references, value)
}
function TString(schema: Types.TString, references: Types.TSchema[], value: any): unknown {
  return TryConvertString(value)
}
function TSymbol(schema: Types.TSymbol, references: Types.TSchema[], value: any): unknown {
  return value
}
function TTemplateLiteral(schema: Types.TTemplateLiteral, references: Types.TSchema[], value: any) {
  return value
}
function TThis(schema: Types.TThis, references: Types.TSchema[], value: any): unknown {
  const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
  if (index === -1) throw new ValueConvertDereferenceError(schema)
  const target = references[index]
  return Visit(target, references, value)
}
function TTuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], value: any): unknown {
  if (ValueGuard.IsArray(value) && !ValueGuard.IsUndefined(schema.items)) {
    return value.map((value, index) => {
      return index < schema.items!.length ? Visit(schema.items![index], references, value) : value
    })
  }
  return value
}
function TUndefined(schema: Types.TUndefined, references: Types.TSchema[], value: any): unknown {
  return TryConvertUndefined(value)
}
function TUnion(schema: Types.TUnion, references: Types.TSchema[], value: any): unknown {
  for (const subschema of schema.anyOf) {
    const converted = Visit(subschema, references, value)
    if (ValueCheck.Check(subschema, references, converted)) {
      return converted
    }
  }
  return value
}
function TUint8Array(schema: Types.TUint8Array, references: Types.TSchema[], value: any): unknown {
  return value
}
function TUnknown(schema: Types.TUnknown, references: Types.TSchema[], value: any): unknown {
  return value
}
function TVoid(schema: Types.TVoid, references: Types.TSchema[], value: any): unknown {
  return value
}
function TUserDefined(schema: Types.TSchema, references: Types.TSchema[], value: any): unknown {
  return value
}
export function Visit(schema: Types.TSchema, references: Types.TSchema[], value: any): unknown {
  const references_ = ValueGuard.IsString(schema.$id) ? [...references, schema] : references
  const schema_ = schema as any
  switch (schema[Types.Kind]) {
    case 'Any':
      return TAny(schema_, references_, value)
    case 'Array':
      return TArray(schema_, references_, value)
    case 'AsyncIterator':
      return TAsyncIterator(schema_, references_, value)
    case 'BigInt':
      return TBigInt(schema_, references_, value)
    case 'Boolean':
      return TBoolean(schema_, references_, value)
    case 'Constructor':
      return TConstructor(schema_, references_, value)
    case 'Date':
      return TDate(schema_, references_, value)
    case 'Function':
      return TFunction(schema_, references_, value)
    case 'Integer':
      return TInteger(schema_, references_, value)
    case 'Intersect':
      return TIntersect(schema_, references_, value)
    case 'Iterator':
      return TIterator(schema_, references_, value)
    case 'Literal':
      return TLiteral(schema_, references_, value)
    case 'Never':
      return TNever(schema_, references_, value)
    case 'Null':
      return TNull(schema_, references_, value)
    case 'Number':
      return TNumber(schema_, references_, value)
    case 'Object':
      return TObject(schema_, references_, value)
    case 'Promise':
      return TPromise(schema_, references_, value)
    case 'Record':
      return TRecord(schema_, references_, value)
    case 'Ref':
      return TRef(schema_, references_, value)
    case 'String':
      return TString(schema_, references_, value)
    case 'Symbol':
      return TSymbol(schema_, references_, value)
    case 'TemplateLiteral':
      return TTemplateLiteral(schema_, references_, value)
    case 'This':
      return TThis(schema_, references_, value)
    case 'Tuple':
      return TTuple(schema_, references_, value)
    case 'Undefined':
      return TUndefined(schema_, references_, value)
    case 'Union':
      return TUnion(schema_, references_, value)
    case 'Uint8Array':
      return TUint8Array(schema_, references_, value)
    case 'Unknown':
      return TUnknown(schema_, references_, value)
    case 'Void':
      return TVoid(schema_, references_, value)
    default:
      if (!Types.TypeRegistry.Has(schema_[Types.Kind])) throw new ValueConvertUnknownTypeError(schema_)
      return TUserDefined(schema_, references_, value)
  }
}
// --------------------------------------------------------------------------
// Convert
// --------------------------------------------------------------------------
/** Converts any type mismatched values to their target type if a conversion is possible. */
export function Convert<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): unknown
/** Converts any type mismatched values to their target type if a conversion is possible. */
export function Convert<T extends Types.TSchema>(schema: T, value: unknown): unknown
/** Converts any type mismatched values to their target type if a conversion is possible. */
export function Convert(...args: any[]) {
  return args.length === 3 ? Visit(args[0], args[1], args[2]) : Visit(args[0], [], args[1])
}
