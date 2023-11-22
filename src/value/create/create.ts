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

import { HasPropertyKey, IsString } from '../guard/index'
import { Check } from '../check/index'
import { Deref } from '../deref/index'
import { TemplateLiteralParseExact, IsTemplateLiteralFinite, TemplateLiteralGenerate } from '../../type/template-literal/index'
import { PatternStringExact, PatternNumberExact } from '../../type/patterns/index'
import { TypeRegistry } from '../../type/registry/index'
import { Kind } from '../../type/symbols/index'

import type { TSchema } from '../../type/schema/index'
import type { TAsyncIterator } from '../../type/async-iterator/index'
import type { TAny } from '../../type/any/index'
import type { TArray } from '../../type/array/index'
import type { TBigInt } from '../../type/bigint/index'
import type { TBoolean } from '../../type/boolean/index'
import type { TDate } from '../../type/date/index'
import type { TConstructor } from '../../type/constructor/index'
import type { TFunction } from '../../type/function/index'
import type { TInteger } from '../../type/integer/index'
import type { TIntersect } from '../../type/intersect/index'
import type { TIterator } from '../../type/iterator/index'
import type { TLiteral } from '../../type/literal/index'
import type { TNever } from '../../type/never/index'
import type { TNot } from '../../type/not/index'
import type { TNull } from '../../type/null/index'
import type { TNumber } from '../../type/number/index'
import type { TObject } from '../../type/object/index'
import type { TPromise } from '../../type/promise/index'
import type { TRecord } from '../../type/record/index'
import type { TRef } from '../../type/ref/index'
import type { TTemplateLiteral } from '../../type/template-literal/index'
import type { TThis } from '../../type/recursive/index'
import type { TTuple } from '../../type/tuple/index'
import type { TUnion } from '../../type/union/index'
import type { TUnknown } from '../../type/unknown/index'
import type { Static } from '../../type/static/index'
import type { TString } from '../../type/string/index'
import type { TSymbol } from '../../type/symbol/index'
import type { TUndefined } from '../../type/undefined/index'
import type { TUint8Array } from '../../type/uint8array/index'
import type { TVoid } from '../../type/void/index'

// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------
export class ValueCreateUnknownTypeError extends Error {
  constructor(public readonly schema: TSchema) {
    super('Unknown type')
  }
}
export class ValueCreateNeverTypeError extends Error {
  constructor(public readonly schema: TSchema) {
    super('Never types cannot be created')
  }
}
export class ValueCreateNotTypeError extends Error {
  constructor(public readonly schema: TSchema) {
    super('Not types must have a default value')
  }
}
export class ValueCreateIntersectTypeError extends Error {
  constructor(public readonly schema: TSchema) {
    super('Intersect produced invalid value. Consider using a default value.')
  }
}
export class ValueCreateTempateLiteralTypeError extends Error {
  constructor(public readonly schema: TSchema) {
    super('Can only create template literal values from patterns that produce finite sequences. Consider using a default value.')
  }
}
export class ValueCreateRecursiveInstantiationError extends Error {
  constructor(public readonly schema: TSchema, public readonly recursiveMaxDepth: number) {
    super('Value cannot be created as recursive type may produce value of infinite size. Consider using a default.')
  }
}
// ------------------------------------------------------------------
// Create
// ------------------------------------------------------------------
function TAny(schema: TAny, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return {}
  }
}
function TArray(schema: TArray, references: TSchema[]): any {
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
function TAsyncIterator(schema: TAsyncIterator, references: TSchema[]) {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return (async function* () {})()
  }
}
function TBigInt(schema: TBigInt, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return BigInt(0)
  }
}
function TBoolean(schema: TBoolean, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return false
  }
}
function TConstructor(schema: TConstructor, references: TSchema[]): any {
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
function TDate(schema: TDate, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else if (schema.minimumTimestamp !== undefined) {
    return new Date(schema.minimumTimestamp)
  } else {
    return new Date()
  }
}
function TFunction(schema: TFunction, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return () => Visit(schema.returns, references)
  }
}
function TInteger(schema: TInteger, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else if (schema.minimum !== undefined) {
    return schema.minimum
  } else {
    return 0
  }
}
function TIntersect(schema: TIntersect, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    // --------------------------------------------------------------
    // Note: The best we can do here is attempt to instance each
    // sub type and apply through object assign. For non-object
    // sub types, we just escape the assignment and just return
    // the value. In the latter case, this is typically going to
    // be a consequence of an illogical intersection.
    // --------------------------------------------------------------
    const value = schema.allOf.reduce((acc, schema) => {
      const next = Visit(schema, references) as any
      return typeof next === 'object' ? { ...acc, ...next } : next
    }, {})
    if (!Check(schema, references, value)) throw new ValueCreateIntersectTypeError(schema)
    return value
  }
}
function TIterator(schema: TIterator, references: TSchema[]) {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return (function* () {})()
  }
}
function TLiteral(schema: TLiteral, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return schema.const
  }
}
function TNever(schema: TNever, references: TSchema[]): any {
  throw new ValueCreateNeverTypeError(schema)
}
function TNot(schema: TNot, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    throw new ValueCreateNotTypeError(schema)
  }
}
function TNull(schema: TNull, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return null
  }
}
function TNumber(schema: TNumber, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else if (schema.minimum !== undefined) {
    return schema.minimum
  } else {
    return 0
  }
}
function TObject(schema: TObject, references: TSchema[]): any {
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
function TPromise(schema: TPromise<any>, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return Promise.resolve(Visit(schema.item, references))
  }
}
function TRecord(schema: TRecord<any, any>, references: TSchema[]): any {
  const [keyPattern, valueSchema] = Object.entries(schema.patternProperties)[0]
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else if (!(keyPattern === PatternStringExact || keyPattern === PatternNumberExact)) {
    const propertyKeys = keyPattern.slice(1, keyPattern.length - 1).split('|')
    return propertyKeys.reduce((acc, key) => {
      return { ...acc, [key]: Visit(valueSchema, references) }
    }, {})
  } else {
    return {}
  }
}
function TRef(schema: TRef<any>, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return Visit(Deref(schema, references), references)
  }
}
function TString(schema: TString, references: TSchema[]): any {
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
function TSymbol(schema: TString, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else if ('value' in schema) {
    return Symbol.for(schema.value)
  } else {
    return Symbol()
  }
}
function TTemplateLiteral(schema: TTemplateLiteral, references: TSchema[]) {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  }
  const expression = TemplateLiteralParseExact(schema.pattern)
  if (!IsTemplateLiteralFinite(expression)) throw new ValueCreateTempateLiteralTypeError(schema)
  const sequence = TemplateLiteralGenerate(expression)
  return sequence.next().value
}
function TThis(schema: TThis, references: TSchema[]): any {
  if (recursiveDepth++ > recursiveMaxDepth) throw new ValueCreateRecursiveInstantiationError(schema, recursiveMaxDepth)
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return Visit(Deref(schema, references), references)
  }
}
function TTuple(schema: TTuple<any[]>, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  }
  if (schema.items === undefined) {
    return []
  } else {
    return Array.from({ length: schema.minItems }).map((_, index) => Visit((schema.items as any[])[index], references))
  }
}
function TUndefined(schema: TUndefined, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return undefined
  }
}
function TUnion(schema: TUnion<any[]>, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else if (schema.anyOf.length === 0) {
    throw new Error('ValueCreate.Union: Cannot create Union with zero variants')
  } else {
    return Visit(schema.anyOf[0], references)
  }
}
function TUint8Array(schema: TUint8Array, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else if (schema.minByteLength !== undefined) {
    return new Uint8Array(schema.minByteLength)
  } else {
    return new Uint8Array(0)
  }
}
function TUnknown(schema: TUnknown, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return {}
  }
}
function TVoid(schema: TVoid, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    return void 0
  }
}
function TKind(schema: TSchema, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return schema.default
  } else {
    throw new Error('User defined types must specify a default value')
  }
}
function Visit(schema: TSchema, references: TSchema[]): unknown {
  const references_ = IsString(schema.$id) ? [...references, schema] : references
  const schema_ = schema as any
  switch (schema_[Kind]) {
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
      if (!TypeRegistry.Has(schema_[Kind])) throw new ValueCreateUnknownTypeError(schema_)
      return TKind(schema_, references_)
  }
}
// ------------------------------------------------------------------
// State
// ------------------------------------------------------------------
const recursiveMaxDepth = 512
let recursiveDepth = 0
// ------------------------------------------------------------------
// Create
// ------------------------------------------------------------------
/** Creates a value from the given schema and references */
export function Create<T extends TSchema>(schema: T, references: TSchema[]): Static<T>
/** Creates a value from the given schema */
export function Create<T extends TSchema>(schema: T): Static<T>
/** Creates a value from the given schema */
export function Create(...args: any[]) {
  recursiveDepth = 0
  return args.length === 2 ? Visit(args[0], args[1]) : Visit(args[0], [])
}
