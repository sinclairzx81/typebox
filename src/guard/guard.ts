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

/** TypeGuard tests that values conform to a known TypeBox type specification */
export namespace TypeGuard {
  function IsObject(schema: any): schema is Record<string | symbol, any> {
    return typeof schema === 'object' && schema !== null && !Array.isArray(schema)
  }

  function IsArray(schema: any): schema is any[] {
    return typeof schema === 'object' && schema !== null && Array.isArray(schema)
  }

  /** Returns true if the given schema is TAny */
  export function TAny(schema: any): schema is Types.TAny {
    return IsObject(schema) && schema[Types.Kind] === 'Any'
  }

  /** Returns true if the given schema is TArray */
  export function TArray(schema: any): schema is Types.TArray {
    return IsObject(schema) && schema[Types.Kind] === 'Array' && schema.type === 'array' && TSchema(schema.items)
  }

  /** Returns true if the given schema is TBoolean */
  export function TBoolean(schema: any): schema is Types.TBoolean {
    return IsObject(schema) && schema[Types.Kind] === 'Boolean' && schema.type === 'boolean'
  }

  /** Returns true if the given schema is TConstructor */
  export function TConstructor(schema: any): schema is Types.TConstructor {
    if (!(IsObject(schema) && schema[Types.Kind] === 'Constructor' && schema.type === 'constructor' && IsArray(schema.parameters) && TSchema(schema.returns))) {
      return false
    }
    for (const parameter of schema.parameters) {
      if (!TSchema(parameter)) return false
    }
    return true
  }

  /** Returns true if the given schema is TFunction */
  export function TFunction(schema: any): schema is Types.TFunction {
    if (!(IsObject(schema) && schema[Types.Kind] === 'Function' && schema.type === 'function' && IsArray(schema.parameters) && TSchema(schema.returns))) {
      return false
    }
    for (const parameter of schema.parameters) {
      if (!TSchema(parameter)) return false
    }
    return true
  }

  /** Returns true if the given schema is TInteger */
  export function TInteger(schema: any): schema is Types.TInteger {
    return IsObject(schema) && schema[Types.Kind] === 'Integer' && schema.type === 'integer'
  }

  /** Returns true if the given schema is TLiteral */
  export function TLiteral(schema: any): schema is Types.TLiteral {
    return IsObject(schema) && schema[Types.Kind] === 'Literal' && (typeof schema.const === 'string' || typeof schema.const === 'number' || typeof schema.const === 'boolean')
  }

  /** Returns true if the given schema is TNull */
  export function TNull(schema: any): schema is Types.TNull {
    return IsObject(schema) && schema[Types.Kind] === 'Null' && schema.type === 'null'
  }

  /** Returns true if the given schema is TNumber */
  export function TNumber(schema: any): schema is Types.TNumber {
    return IsObject(schema) && schema[Types.Kind] === 'Number' && schema.type === 'number'
  }

  /** Returns true if the given schema is TObject */
  export function TObject(schema: any): schema is Types.TObject {
    if (!(IsObject(schema) && schema[Types.Kind] === 'Object' && schema.type === 'object' && IsObject(schema.properties))) {
      return false
    }
    for (const property of Object.values(schema.properties)) {
      if (!TSchema(property)) return false
    }
    return true
  }

  /** Returns true if the given schema is TPromise */
  export function TPromise(schema: any): schema is Types.TPromise {
    return IsObject(schema) && schema[Types.Kind] === 'Promise' && schema.type === 'promise' && TSchema(schema.item)
  }

  /** Returns true if the given schema is TRecord */
  export function TRecord(schema: any): schema is Types.TRecord {
    if (!(IsObject(schema) && schema[Types.Kind] === 'Record' && schema.type === 'object' && IsObject(schema.patternProperties))) {
      return false
    }
    const keys = Object.keys(schema.patternProperties)
    if (keys.length !== 1) {
      return false
    }
    if (!TSchema(schema.patternProperties[keys[0]])) {
      return false
    }
    return true
  }

  /** Returns true if the given schema is TSelf */
  export function TSelf(schema: any): schema is Types.TSelf {
    return IsObject(schema) && schema[Types.Kind] === 'Self' && typeof schema.$ref === 'string'
  }

  /** Returns true if the given schema is TRef */
  export function TRef(schema: any): schema is Types.TRef {
    return IsObject(schema) && schema[Types.Kind] === 'Ref' && typeof schema.$ref === 'string'
  }

  /** Returns true if the given schema is TString */
  export function TString(schema: any): schema is Types.TString {
    return IsObject(schema) && schema[Types.Kind] === 'String' && schema.type === 'string'
  }

  /** Returns true if the given schema is TTuple */
  export function TTuple(schema: any): schema is Types.TTuple {
    if (
      !(IsObject(schema) && schema[Types.Kind] === 'Tuple' && schema.type === 'array' && typeof schema.minItems === 'number' && typeof schema.maxItems === 'number' && schema.minItems === schema.maxItems)
    ) {
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
  export function TUndefined(schema: any): schema is Types.TUndefined {
    return IsObject(schema) && schema[Types.Kind] === 'Undefined' && schema.type === 'object' && schema.specialized === 'Undefined'
  }

  /** Returns true if the given schema is TUnion */
  export function TUnion(schema: any): schema is Types.TUnion {
    if (!(IsObject(schema) && schema[Types.Kind] === 'Union' && IsArray(schema.anyOf))) {
      return false
    }
    for (const inner of schema.anyOf) {
      if (!TSchema(inner)) return false
    }
    return true
  }

  /** Returns true if the given schema is TUint8Array */
  export function TUint8Array(schema: any): schema is Types.TUint8Array {
    return IsObject(schema) && schema[Types.Kind] === 'Uint8Array' && schema.type === 'object' && schema.specialized === 'Uint8Array'
  }

  /** Returns true if the given schema is TUnknown */
  export function TUnknown(schema: any): schema is Types.TUnknown {
    return IsObject(schema) && schema[Types.Kind] === 'Unknown'
  }

  /** Returns true if the given schema is TVoid */
  export function TVoid(schema: any): schema is Types.TVoid {
    return IsObject(schema) && schema[Types.Kind] === 'Void' && schema.type === 'null'
  }

  /** Returns true if the given schema is TSchema */
  export function TSchema(schema: any): schema is Types.TSchema {
    return (
      TAny(schema) ||
      TArray(schema) ||
      TBoolean(schema) ||
      TConstructor(schema) ||
      TFunction(schema) ||
      TInteger(schema) ||
      TLiteral(schema) ||
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
}
