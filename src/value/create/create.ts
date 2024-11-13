/*--------------------------------------------------------------------------

@sinclair/typebox/value

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

import { HasPropertyKey } from '../guard/index'
import { Check } from '../check/index'
import { Clone } from '../clone/index'
import { Deref, Pushref } from '../deref/index'
import { TemplateLiteralGenerate, IsTemplateLiteralFinite } from '../../type/template-literal/index'
import { PatternStringExact, PatternNumberExact } from '../../type/patterns/index'
import { TypeRegistry } from '../../type/registry/index'
import { Kind } from '../../type/symbols/index'
import { TypeBoxError } from '../../type/error/index'

import type { TSchema } from '../../type/schema/index'
import type { TAsyncIterator } from '../../type/async-iterator/index'
import type { TAny } from '../../type/any/index'
import type { TArray } from '../../type/array/index'
import type { TBigInt } from '../../type/bigint/index'
import type { TBoolean } from '../../type/boolean/index'
import type { TDate } from '../../type/date/index'
import type { TConstructor } from '../../type/constructor/index'
import type { TFunction } from '../../type/function/index'
import type { TImport } from '../../type/module/index'
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
import type { TRegExp } from '../../type/regexp/index'
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

import { IsFunction } from '../guard/guard'

// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------
export class ValueCreateError extends TypeBoxError {
  constructor(public readonly schema: TSchema, message: string) {
    super(message)
  }
}
// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
function FromDefault(value: unknown) {
  return IsFunction(value) ? value() : Clone(value)
}
// ------------------------------------------------------------------
// Create
// ------------------------------------------------------------------
function FromAny(schema: TAny, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    return {}
  }
}
function FromArray(schema: TArray, references: TSchema[]): any {
  if (schema.uniqueItems === true && !HasPropertyKey(schema, 'default')) {
    throw new ValueCreateError(schema, 'Array with the uniqueItems constraint requires a default value')
  } else if ('contains' in schema && !HasPropertyKey(schema, 'default')) {
    throw new ValueCreateError(schema, 'Array with the contains constraint requires a default value')
  } else if ('default' in schema) {
    return FromDefault(schema.default)
  } else if (schema.minItems !== undefined) {
    return Array.from({ length: schema.minItems }).map((item) => {
      return Visit(schema.items, references)
    })
  } else {
    return []
  }
}
function FromAsyncIterator(schema: TAsyncIterator, references: TSchema[]) {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    return (async function* () {})()
  }
}
function FromBigInt(schema: TBigInt, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    return BigInt(0)
  }
}
function FromBoolean(schema: TBoolean, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    return false
  }
}
function FromConstructor(schema: TConstructor, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
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
function FromDate(schema: TDate, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else if (schema.minimumTimestamp !== undefined) {
    return new Date(schema.minimumTimestamp)
  } else {
    return new Date()
  }
}
function FromFunction(schema: TFunction, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    return () => Visit(schema.returns, references)
  }
}
function FromImport(schema: TImport, references: TSchema[]): any {
  const definitions = globalThis.Object.values(schema.$defs) as TSchema[]
  const target = schema.$defs[schema.$ref] as TSchema
  return Visit(target, [...references, ...definitions])
}
function FromInteger(schema: TInteger, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else if (schema.minimum !== undefined) {
    return schema.minimum
  } else {
    return 0
  }
}
function FromIntersect(schema: TIntersect, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
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
    if (!Check(schema, references, value)) throw new ValueCreateError(schema, 'Intersect produced invalid value. Consider using a default value.')
    return value
  }
}
function FromIterator(schema: TIterator, references: TSchema[]) {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    return (function* () {})()
  }
}
function FromLiteral(schema: TLiteral, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    return schema.const
  }
}
function FromNever(schema: TNever, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    throw new ValueCreateError(schema, 'Never types cannot be created. Consider using a default value.')
  }
}
function FromNot(schema: TNot, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    throw new ValueCreateError(schema, 'Not types must have a default value')
  }
}
function FromNull(schema: TNull, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    return null
  }
}
function FromNumber(schema: TNumber, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else if (schema.minimum !== undefined) {
    return schema.minimum
  } else {
    return 0
  }
}
function FromObject(schema: TObject, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    const required = new Set(schema.required)
    const Acc = {} as Record<PropertyKey, unknown>
    for (const [key, subschema] of Object.entries(schema.properties)) {
      if (!required.has(key)) continue
      Acc[key] = Visit(subschema, references)
    }
    return Acc
  }
}
function FromPromise(schema: TPromise, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    return Promise.resolve(Visit(schema.item, references))
  }
}
function FromRecord(schema: TRecord, references: TSchema[]): any {
  const [keyPattern, valueSchema] = Object.entries(schema.patternProperties)[0]
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else if (!(keyPattern === PatternStringExact || keyPattern === PatternNumberExact)) {
    const propertyKeys = keyPattern.slice(1, keyPattern.length - 1).split('|')
    const Acc = {} as Record<PropertyKey, unknown>
    for (const key of propertyKeys) Acc[key] = Visit(valueSchema, references)
    return Acc
  } else {
    return {}
  }
}
function FromRef(schema: TRef, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    return Visit(Deref(schema, references), references)
  }
}
function FromRegExp(schema: TRegExp, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    throw new ValueCreateError(schema, 'RegExp types cannot be created. Consider using a default value.')
  }
}
function FromString(schema: TString, references: TSchema[]): any {
  if (schema.pattern !== undefined) {
    if (!HasPropertyKey(schema, 'default')) {
      throw new ValueCreateError(schema, 'String types with patterns must specify a default value')
    } else {
      return FromDefault(schema.default)
    }
  } else if (schema.format !== undefined) {
    if (!HasPropertyKey(schema, 'default')) {
      throw new ValueCreateError(schema, 'String types with formats must specify a default value')
    } else {
      return FromDefault(schema.default)
    }
  } else {
    if (HasPropertyKey(schema, 'default')) {
      return FromDefault(schema.default)
    } else if (schema.minLength !== undefined) {
      // prettier-ignore
      return Array.from({ length: schema.minLength }).map(() => ' ').join('')
    } else {
      return ''
    }
  }
}
function FromSymbol(schema: TSymbol, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else if ('value' in schema) {
    return Symbol.for(schema.value)
  } else {
    return Symbol()
  }
}
function FromTemplateLiteral(schema: TTemplateLiteral, references: TSchema[]) {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  }
  if (!IsTemplateLiteralFinite(schema)) throw new ValueCreateError(schema, 'Can only create template literals that produce a finite variants. Consider using a default value.')
  const generated = TemplateLiteralGenerate(schema) as string[]
  return generated[0]
}
function FromThis(schema: TThis, references: TSchema[]): any {
  if (recursiveDepth++ > recursiveMaxDepth) throw new ValueCreateError(schema, 'Cannot create recursive type as it appears possibly infinite. Consider using a default.')
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    return Visit(Deref(schema, references), references)
  }
}
function FromTuple(schema: TTuple, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  }
  if (schema.items === undefined) {
    return []
  } else {
    return Array.from({ length: schema.minItems }).map((_, index) => Visit((schema.items as any[])[index], references))
  }
}
function FromUndefined(schema: TUndefined, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    return undefined
  }
}
function FromUnion(schema: TUnion, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else if (schema.anyOf.length === 0) {
    throw new Error('ValueCreate.Union: Cannot create Union with zero variants')
  } else {
    return Visit(schema.anyOf[0], references)
  }
}
function FromUint8Array(schema: TUint8Array, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else if (schema.minByteLength !== undefined) {
    return new Uint8Array(schema.minByteLength)
  } else {
    return new Uint8Array(0)
  }
}
function FromUnknown(schema: TUnknown, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    return {}
  }
}
function FromVoid(schema: TVoid, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    return void 0
  }
}
function FromKind(schema: TSchema, references: TSchema[]): any {
  if (HasPropertyKey(schema, 'default')) {
    return FromDefault(schema.default)
  } else {
    throw new Error('User defined types must specify a default value')
  }
}
function Visit(schema: TSchema, references: TSchema[]): unknown {
  const references_ = Pushref(schema, references)
  const schema_ = schema as any
  switch (schema_[Kind]) {
    case 'Any':
      return FromAny(schema_, references_)
    case 'Array':
      return FromArray(schema_, references_)
    case 'AsyncIterator':
      return FromAsyncIterator(schema_, references_)
    case 'BigInt':
      return FromBigInt(schema_, references_)
    case 'Boolean':
      return FromBoolean(schema_, references_)
    case 'Constructor':
      return FromConstructor(schema_, references_)
    case 'Date':
      return FromDate(schema_, references_)
    case 'Function':
      return FromFunction(schema_, references_)
    case 'Import':
      return FromImport(schema_, references_)
    case 'Integer':
      return FromInteger(schema_, references_)
    case 'Intersect':
      return FromIntersect(schema_, references_)
    case 'Iterator':
      return FromIterator(schema_, references_)
    case 'Literal':
      return FromLiteral(schema_, references_)
    case 'Never':
      return FromNever(schema_, references_)
    case 'Not':
      return FromNot(schema_, references_)
    case 'Null':
      return FromNull(schema_, references_)
    case 'Number':
      return FromNumber(schema_, references_)
    case 'Object':
      return FromObject(schema_, references_)
    case 'Promise':
      return FromPromise(schema_, references_)
    case 'Record':
      return FromRecord(schema_, references_)
    case 'Ref':
      return FromRef(schema_, references_)
    case 'RegExp':
      return FromRegExp(schema_, references_)
    case 'String':
      return FromString(schema_, references_)
    case 'Symbol':
      return FromSymbol(schema_, references_)
    case 'TemplateLiteral':
      return FromTemplateLiteral(schema_, references_)
    case 'This':
      return FromThis(schema_, references_)
    case 'Tuple':
      return FromTuple(schema_, references_)
    case 'Undefined':
      return FromUndefined(schema_, references_)
    case 'Union':
      return FromUnion(schema_, references_)
    case 'Uint8Array':
      return FromUint8Array(schema_, references_)
    case 'Unknown':
      return FromUnknown(schema_, references_)
    case 'Void':
      return FromVoid(schema_, references_)
    default:
      if (!TypeRegistry.Has(schema_[Kind])) throw new ValueCreateError(schema_, 'Unknown type')
      return FromKind(schema_, references_)
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
