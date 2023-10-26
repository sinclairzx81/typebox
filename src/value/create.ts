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

import { HasPropertyKey, IsString, IsObject } from './guard'
import { Check } from './check'
import { Deref } from './deref'
import * as Types from '../typebox'

// --------------------------------------------------------------------------
// Errors
// --------------------------------------------------------------------------
export class ValueCreateUnknownTypeError extends Types.TypeBoxError {
  constructor(public readonly schema: Types.TSchema) {
    super('Unknown type')
  }
}
export class ValueCreateNeverTypeError extends Types.TypeBoxError {
  constructor(public readonly schema: Types.TSchema) {
    super('Never types cannot be created')
  }
}
export class ValueCreateNotTypeError extends Types.TypeBoxError {
  constructor(public readonly schema: Types.TSchema) {
    super('Not types must have a default value')
  }
}
export class ValueCreateIntersectTypeError extends Types.TypeBoxError {
  constructor(public readonly schema: Types.TSchema) {
    super('Intersect produced invalid value. Consider using a default value.')
  }
}
export class ValueCreateTempateLiteralTypeError extends Types.TypeBoxError {
  constructor(public readonly schema: Types.TSchema) {
    super('Can only create template literal values from patterns that produce finite sequences. Consider using a default value.')
  }
}
export class ValueCreateRecursiveInstantiationError extends Types.TypeBoxError {
  constructor(public readonly schema: Types.TSchema, public readonly recursiveMaxDepth: number) {
    super('Value cannot be created as recursive type may produce value of infinite size. Consider using a default.')
  }
}
// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
function TAny(schema: Types.TAny, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return {}
  }
}
function TArray(schema: Types.TArray, references: Types.TSchema[]): any {
  if (schema.uniqueItems === true && !HasPropertyKey(schema, 'default')) {
    throw new Error('ValueCreate.Array: Array with the uniqueItems constraint requires a default value')
  } else if ('contains' in schema && !HasPropertyKey(schema, 'default')) {
    throw new Error('ValueCreate.Array: Array with the contains constraint requires a default value')
  } else if ('default' in schema) {
    return schema.default
  } else if (schema.minItems !== undefined) {
    return Array.from({ length: schema.minItems }).map((item) => {
      return Visit(schema.items, references)
    })
  } else {
    return []
  }
}
function TAsyncIterator(schema: Types.TAsyncIterator, references: Types.TSchema[]) {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return (async function* () {})()
  }
}
function TBigInt(schema: Types.TBigInt, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return BigInt(0)
  }
}
function TBoolean(schema: Types.TBoolean, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return false
  }
}
function TConstructor(schema: Types.TConstructor, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    const value = Visit(schema.returns, references) as any
    if (typeof value === 'object' && !Array.isArray(value)) {
      return class {
        constructor() {
          for (const [key, val] of Object.entries(value)) {
            const self = this as any
            self[key] = val
          }
        }
      }
    } else {
      return class {}
    }
  }
}
function TDate(schema: Types.TDate, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else if (schema.minimumTimestamp !== undefined) {
    return new Date(schema.minimumTimestamp)
  } else {
    return new Date(0)
  }
}
function TFunction(schema: Types.TFunction, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return () => Visit(schema.returns, references)
  }
}
function TInteger(schema: Types.TInteger, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else if (schema.minimum !== undefined) {
    return schema.minimum
  } else {
    return 0
  }
}
function TIntersect(schema: Types.TIntersect, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    // Note: The best we can do here is attempt to instance each sub type and apply through object assign. For non-object
    // sub types, we just escape the assignment and just return the value. In the latter case, this is typically going to
    // be a consequence of an illogical intersection.
    const value = schema.allOf.reduce((acc, schema) => {
      const next = Visit(schema, references)
      return IsObject(next) ? { ...acc, ...next } : next
    }, {} as any)
    if (!Check(schema, references, value)) throw new ValueCreateIntersectTypeError(schema)
    return value
  }
}
function TIterator(schema: Types.TIterator, references: Types.TSchema[]) {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return (function* () {})()
  }
}
function TLiteral(schema: Types.TLiteral, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return schema.const
  }
}
function TNever(schema: Types.TNever, references: Types.TSchema[]): any {
  throw new ValueCreateNeverTypeError(schema)
}
function TNot(schema: Types.TNot, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    throw new ValueCreateNotTypeError(schema)
  }
}
function TNull(schema: Types.TNull, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return null
  }
}
function TNumber(schema: Types.TNumber, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else if (schema.minimum !== undefined) {
    return schema.minimum
  } else {
    return 0
  }
}
function TObject(schema: Types.TObject, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    const required = new Set(schema.required)
    return (
      schema.default ||
      Object.entries(schema.properties).reduce((acc, [key, schema]) => {
        return required.has(key) ? { ...acc, [key]: Visit(schema, references) } : { ...acc }
      }, {})
    )
  }
}
function TPromise(schema: Types.TPromise<any>, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return Promise.resolve(Visit(schema.item, references))
  }
}
function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[]): any {
  const [keyPattern, valueSchema] = Object.entries(schema.patternProperties)[0]
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else if (!(keyPattern === Types.PatternStringExact || keyPattern === Types.PatternNumberExact)) {
    const propertyKeys = keyPattern.slice(1, keyPattern.length - 1).split('|')
    return propertyKeys.reduce((acc, key) => {
      return { ...acc, [key]: Visit(valueSchema, references) }
    }, {})
  } else {
    return {}
  }
}
function TRef(schema: Types.TRef<any>, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return Visit(Deref(schema, references), references)
  }
}
function TString(schema: Types.TString, references: Types.TSchema[]): any {
  if (schema.pattern !== undefined) {
    if (!HasPropertyKey(schema, 'default')) {
      throw new Error('ValueCreate.String: String types with patterns must specify a default value')
    } else {
      return schema.default
    }
  } else if (schema.format !== undefined) {
    if (!HasPropertyKey(schema, 'default')) {
      throw new Error('ValueCreate.String: String types with formats must specify a default value')
    } else {
      return schema.default
    }
  } else {
    if (HasPropertyKey(schema, 'default')) {
      return schema.default
    } else if (schema.minLength !== undefined) {
      return Array.from({ length: schema.minLength })
        .map(() => '.')
        .join('')
    } else {
      return ''
    }
  }
}
function TSymbol(schema: Types.TString, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else if ('value' in schema) {
    return Symbol.for(schema.value)
  } else {
    return Symbol()
  }
}
function TTemplateLiteral(schema: Types.TTemplateLiteral, references: Types.TSchema[]) {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  }
  const expression = Types.TemplateLiteralParser.ParseExact(schema.pattern)
  if (!Types.TemplateLiteralFinite.Check(expression)) throw new ValueCreateTempateLiteralTypeError(schema)
  const sequence = Types.TemplateLiteralGenerator.Generate(expression)
  return sequence.next().value
}
function TThis(schema: Types.TThis, references: Types.TSchema[]): any {
  if (recursiveDepth++ > recursiveMaxDepth) throw new ValueCreateRecursiveInstantiationError(schema, recursiveMaxDepth)
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return Visit(Deref(schema, references), references)
  }
}
function TTuple(schema: Types.TTuple<any[]>, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  }
  if (schema.items === undefined) {
    return []
  } else {
    return Array.from({ length: schema.minItems }).map((_, index) => Visit((schema.items as any[])[index], references))
  }
}
function TUndefined(schema: Types.TUndefined, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return undefined
  }
}
function TUnion(schema: Types.TUnion<any[]>, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else if (schema.anyOf.length === 0) {
    throw new Error('ValueCreate.Union: Cannot create Union with zero variants')
  } else {
    return Visit(schema.anyOf[0], references)
  }
}
function TUint8Array(schema: Types.TUint8Array, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else if (schema.minByteLength !== undefined) {
    return new Uint8Array(schema.minByteLength)
  } else {
    return new Uint8Array(0)
  }
}
function TUnknown(schema: Types.TUnknown, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return {}
  }
}
function TVoid(schema: Types.TVoid, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return void 0
  }
}
function TKind(schema: Types.TSchema, references: Types.TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    throw new Error('User defined types must specify a default value')
  }
}
function Visit(schema: Types.TSchema, references: Types.TSchema[]): unknown {
  const references_ = IsString(schema.$id) ? [...references, schema] : references
  const schema_ = schema as any
  switch (schema_[Types.Kind]) {
    case 'Any':
      return TAny(schema_, references_)
    case 'Array':
      return TArray(schema_, references_)
    case 'AsyncIterator':
      return TAsyncIterator(schema_, references_)
    case 'BigInt':
      return TBigInt(schema_, references_)
    case 'Boolean':
      return TBoolean(schema_, references_)
    case 'Constructor':
      return TConstructor(schema_, references_)
    case 'Date':
      return TDate(schema_, references_)
    case 'Function':
      return TFunction(schema_, references_)
    case 'Integer':
      return TInteger(schema_, references_)
    case 'Intersect':
      return TIntersect(schema_, references_)
    case 'Iterator':
      return TIterator(schema_, references_)
    case 'Literal':
      return TLiteral(schema_, references_)
    case 'Never':
      return TNever(schema_, references_)
    case 'Not':
      return TNot(schema_, references_)
    case 'Null':
      return TNull(schema_, references_)
    case 'Number':
      return TNumber(schema_, references_)
    case 'Object':
      return TObject(schema_, references_)
    case 'Promise':
      return TPromise(schema_, references_)
    case 'Record':
      return TRecord(schema_, references_)
    case 'Ref':
      return TRef(schema_, references_)
    case 'String':
      return TString(schema_, references_)
    case 'Symbol':
      return TSymbol(schema_, references_)
    case 'TemplateLiteral':
      return TTemplateLiteral(schema_, references_)
    case 'This':
      return TThis(schema_, references_)
    case 'Tuple':
      return TTuple(schema_, references_)
    case 'Undefined':
      return TUndefined(schema_, references_)
    case 'Union':
      return TUnion(schema_, references_)
    case 'Uint8Array':
      return TUint8Array(schema_, references_)
    case 'Unknown':
      return TUnknown(schema_, references_)
    case 'Void':
      return TVoid(schema_, references_)
    default:
      if (!Types.TypeRegistry.Has(schema_[Types.Kind])) throw new ValueCreateUnknownTypeError(schema_)
      return TKind(schema_, references_)
  }
}
// --------------------------------------------------------------------------
// State
// --------------------------------------------------------------------------
const recursiveMaxDepth = 512
let recursiveDepth = 0
// --------------------------------------------------------------------------
// Create
// --------------------------------------------------------------------------
/** Creates a value from the given schema and references */
export function Create<T extends Types.TSchema>(schema: T, references: Types.TSchema[]): Types.Static<T>
/** Creates a value from the given schema */
export function Create<T extends Types.TSchema>(schema: T): Types.Static<T>
/** Creates a value from the given schema */
export function Create(...args: any[]) {
  recursiveDepth = 0
  return args.length === 2 ? Visit(args[0], args[1]) : Visit(args[0], [])
}
