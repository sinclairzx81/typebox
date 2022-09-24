/*--------------------------------------------------------------------------

@sinclair/typebox/guard

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, dTribute, sublicense, and/or sell
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

export class TypeGuardInvalidTypeError extends Error {
  constructor(public readonly schema: unknown) {
    super('TypeGuard: Invalid type')
  }
}

/** TypeGuard tests that values conform to a known TypeBox type specification */
export namespace TypeGuard {
  function IsObject(value: unknown): value is Record<string | symbol, any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  function IsArray(value: unknown): value is any[] {
    return typeof value === 'object' && value !== null && Array.isArray(value)
  }

  function IsPattern(value: unknown): value is string {
    try {
      new RegExp(value as string)
      return true
    } catch {
      return false
    }
  }

  function IsControlCharacterFree(value: unknown): value is string {
    if (typeof value !== 'string') return false
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i)
      if ((code >= 7 && code <= 13) || code === 27 || code === 127) {
        return false
      }
    }
    return true
  }

  function IsString(value: unknown): value is string {
    return typeof value === 'string'
  }

  function IsNumber(value: unknown): value is number {
    return typeof value === 'number'
  }

  function IsBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
  }

  function IsOptionalNumber(value: unknown): value is number | undefined {
    return value === undefined || (value !== undefined && IsNumber(value))
  }

  function IsOptionalBoolean(value: unknown): value is boolean | undefined {
    return value === undefined || (value !== undefined && IsBoolean(value))
  }

  function IsOptionalString(value: unknown): value is string | undefined {
    return value === undefined || (value !== undefined && IsString(value))
  }

  function IsOptionalPattern(value: unknown): value is string | undefined {
    return value === undefined || (value !== undefined && IsString(value) && IsControlCharacterFree(value) && IsPattern(value))
  }
  function IsOptionalFormat(value: unknown): value is string | undefined {
    return value === undefined || (value !== undefined && IsString(value) && IsControlCharacterFree(value))
  }
  /** Returns true if the given schema is TAny */
  export function TAny(schema: unknown): schema is Types.TAny {
    return IsObject(schema) && schema[Types.Kind] === 'Any' && IsOptionalString(schema.$id)
  }

  /** Returns true if the given schema is TArray */
  export function TArray(schema: unknown): schema is Types.TArray {
    return (
      IsObject(schema) &&
      schema[Types.Kind] === 'Array' &&
      schema.type === 'array' &&
      IsOptionalString(schema.$id) &&
      TSchema(schema.items) &&
      IsOptionalNumber(schema.minItems) &&
      IsOptionalNumber(schema.maxItems) &&
      IsOptionalBoolean(schema.uniqueItems)
    )
  }

  /** Returns true if the given schema is TBoolean */
  export function TBoolean(schema: unknown): schema is Types.TBoolean {
    return IsObject(schema) && schema[Types.Kind] === 'Boolean' && schema.type === 'boolean' && IsOptionalString(schema.$id)
  }

  /** Returns true if the given schema is TConstructor */
  export function TConstructor(schema: unknown): schema is Types.TConstructor {
    if (!(IsObject(schema) && schema[Types.Kind] === 'Constructor' && schema.type === 'constructor' && IsOptionalString(schema.$id) && IsArray(schema.parameters) && TSchema(schema.returns))) {
      return false
    }
    for (const parameter of schema.parameters) {
      if (!TSchema(parameter)) return false
    }
    return true
  }

  /** Returns true if the given schema is TFunction */
  export function TFunction(schema: unknown): schema is Types.TFunction {
    if (!(IsObject(schema) && schema[Types.Kind] === 'Function' && schema.type === 'function' && IsOptionalString(schema.$id) && IsArray(schema.parameters) && TSchema(schema.returns))) {
      return false
    }
    for (const parameter of schema.parameters) {
      if (!TSchema(parameter)) return false
    }
    return true
  }

  /** Returns true if the given schema is TInteger */
  export function TInteger(schema: unknown): schema is Types.TInteger {
    return (
      IsObject(schema) &&
      schema[Types.Kind] === 'Integer' &&
      schema.type === 'integer' &&
      IsOptionalString(schema.$id) &&
      IsOptionalNumber(schema.multipleOf) &&
      IsOptionalNumber(schema.minimum) &&
      IsOptionalNumber(schema.maximum) &&
      IsOptionalNumber(schema.exclusiveMinimum) &&
      IsOptionalNumber(schema.exclusiveMaximum)
    )
  }

  /** Returns true if the given schema is TLiteral */
  export function TLiteral(schema: unknown): schema is Types.TLiteral {
    return IsObject(schema) && schema[Types.Kind] === 'Literal' && IsOptionalString(schema.$id) && (IsString(schema.const) || IsNumber(schema.const) || IsBoolean(schema.const))
  }

  /** Returns true if the given schema is TNever */
  export function TNever(schema: unknown): schema is Types.TNever {
    return (
      IsObject(schema) &&
      schema[Types.Kind] === 'Never' &&
      IsArray(schema.allOf) &&
      schema.allOf.length === 2 &&
      IsObject(schema.allOf[0]) &&
      IsString(schema.allOf[0].type) &&
      schema.allOf[0].type === 'boolean' &&
      schema.allOf[0].const === false &&
      IsObject(schema.allOf[1]) &&
      IsString(schema.allOf[1].type) &&
      schema.allOf[1].type === 'boolean' &&
      schema.allOf[1].const === true
    )
  }

  /** Returns true if the given schema is TNull */
  export function TNull(schema: unknown): schema is Types.TNull {
    return IsObject(schema) && schema[Types.Kind] === 'Null' && schema.type === 'null' && IsOptionalString(schema.$id)
  }

  /** Returns true if the given schema is TNumber */
  export function TNumber(schema: unknown): schema is Types.TNumber {
    return (
      IsObject(schema) &&
      schema[Types.Kind] === 'Number' &&
      schema.type === 'number' &&
      IsOptionalString(schema.$id) &&
      IsOptionalNumber(schema.multipleOf) &&
      IsOptionalNumber(schema.minimum) &&
      IsOptionalNumber(schema.maximum) &&
      IsOptionalNumber(schema.exclusiveMinimum) &&
      IsOptionalNumber(schema.exclusiveMaximum)
    )
  }

  /** Returns true if the given schema is TObject */
  export function TObject(schema: unknown): schema is Types.TObject {
    if (
      !(
        IsObject(schema) &&
        schema[Types.Kind] === 'Object' &&
        schema.type === 'object' &&
        IsOptionalString(schema.$id) &&
        IsObject(schema.properties) &&
        IsOptionalBoolean(schema.additionalProperties) &&
        IsOptionalNumber(schema.minProperties) &&
        IsOptionalNumber(schema.maxProperties)
      )
    ) {
      return false
    }
    for (const [key, value] of Object.entries(schema.properties)) {
      if (!IsControlCharacterFree(key)) return false
      if (!TSchema(value)) return false
    }
    return true
  }

  /** Returns true if the given schema is TPromise */
  export function TPromise(schema: unknown): schema is Types.TPromise {
    return IsObject(schema) && schema[Types.Kind] === 'Promise' && schema.type === 'promise' && IsOptionalString(schema.$id) && TSchema(schema.item)
  }

  /** Returns true if the given schema is TRecord */
  export function TRecord(schema: unknown): schema is Types.TRecord {
    if (!(IsObject(schema) && schema[Types.Kind] === 'Record' && schema.type === 'object' && IsOptionalString(schema.$id) && schema.additionalProperties === false && IsObject(schema.patternProperties))) {
      return false
    }
    const keys = Object.keys(schema.patternProperties)
    if (keys.length !== 1) {
      return false
    }
    if (!IsPattern(keys[0])) {
      return false
    }
    if (!TSchema(schema.patternProperties[keys[0]])) {
      return false
    }
    return true
  }

  /** Returns true if the given schema is TSelf */
  export function TSelf(schema: unknown): schema is Types.TSelf {
    return IsObject(schema) && schema[Types.Kind] === 'Self' && IsOptionalString(schema.$id) && IsString(schema.$ref)
  }

  /** Returns true if the given schema is TRef */
  export function TRef(schema: unknown): schema is Types.TRef {
    return IsObject(schema) && schema[Types.Kind] === 'Ref' && IsOptionalString(schema.$id) && IsString(schema.$ref)
  }

  /** Returns true if the given schema is TString */
  export function TString(schema: unknown): schema is Types.TString {
    return (
      IsObject(schema) &&
      schema[Types.Kind] === 'String' &&
      schema.type === 'string' &&
      IsOptionalString(schema.$id) &&
      IsOptionalNumber(schema.minLength) &&
      IsOptionalNumber(schema.maxLength) &&
      IsOptionalPattern(schema.pattern) &&
      IsOptionalFormat(schema.format)
    )
  }

  /** Returns true if the given schema is TTuple */
  export function TTuple(schema: unknown): schema is Types.TTuple {
    if (!(IsObject(schema) && schema[Types.Kind] === 'Tuple' && schema.type === 'array' && IsOptionalString(schema.$id) && IsNumber(schema.minItems) && IsNumber(schema.maxItems) && schema.minItems === schema.maxItems)) {
      return false
    }
    if (schema.items === undefined && schema.additionalItems === undefined && schema.minItems === 0) {
      return true
    }
    if (!IsArray(schema.items)) {
      return false
    }
    for (const inner of schema.items) {
      if (!TSchema(inner)) return false
    }
    return true
  }

  /** Returns true if the given schema is TUndefined */
  export function TUndefined(schema: unknown): schema is Types.TUndefined {
    return IsObject(schema) && schema[Types.Kind] === 'Undefined' && schema.type === 'object' && IsOptionalString(schema.$id) && schema.specialized === 'Undefined'
  }

  /** Returns true if the given schema is TUnion */
  export function TUnion(schema: unknown): schema is Types.TUnion {
    if (!(IsObject(schema) && schema[Types.Kind] === 'Union' && IsArray(schema.anyOf) && IsOptionalString(schema.$id))) {
      return false
    }
    for (const inner of schema.anyOf) {
      if (!TSchema(inner)) return false
    }
    return true
  }

  /** Returns true if the given schema is TUint8Array */
  export function TUint8Array(schema: unknown): schema is Types.TUint8Array {
    return (
      IsObject(schema) &&
      schema[Types.Kind] === 'Uint8Array' &&
      schema.type === 'object' &&
      IsOptionalString(schema.$id) &&
      schema.specialized === 'Uint8Array' &&
      IsOptionalNumber(schema.minByteLength) &&
      IsOptionalNumber(schema.maxByteLength)
    )
  }

  /** Returns true if the given schema is TUnknown */
  export function TUnknown(schema: unknown): schema is Types.TUnknown {
    return IsObject(schema) && schema[Types.Kind] === 'Unknown' && IsOptionalString(schema.$id)
  }

  /** Returns true if the given schema is TVoid */
  export function TVoid(schema: unknown): schema is Types.TVoid {
    return IsObject(schema) && schema[Types.Kind] === 'Void' && schema.type === 'null' && IsOptionalString(schema.$id)
  }

  /** Returns true if the given schema is TSchema */
  export function TSchema(schema: unknown): schema is Types.TSchema {
    return (
      TAny(schema) ||
      TArray(schema) ||
      TBoolean(schema) ||
      TConstructor(schema) ||
      TFunction(schema) ||
      TInteger(schema) ||
      TLiteral(schema) ||
      TNever(schema) ||
      TNull(schema) ||
      TNumber(schema) ||
      TObject(schema) ||
      TPromise(schema) ||
      TRecord(schema) ||
      TSelf(schema) ||
      TRef(schema) ||
      TString(schema) ||
      TTuple(schema) ||
      TUndefined(schema) ||
      TUnion(schema) ||
      TUint8Array(schema) ||
      TUnknown(schema) ||
      TVoid(schema)
    )
  }

  /** Asserts if this schema and associated references are valid. */
  export function Assert<T extends Types.TSchema>(schema: T, references: Types.TSchema[] = []) {
    if (!TSchema(schema)) throw new TypeGuardInvalidTypeError(schema)
    for (const schema of references) {
      if (!TSchema(schema)) throw new TypeGuardInvalidTypeError(schema)
    }
  }
}
