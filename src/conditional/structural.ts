/*--------------------------------------------------------------------------

@sinclair/typebox/conditional

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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
import { TypeGuard } from '../guard'

// --------------------------------------------------------------------------
// StructuralResult
// --------------------------------------------------------------------------

export enum StructuralResult {
  Union,
  True,
  False,
}

// --------------------------------------------------------------------------
// Structural
// --------------------------------------------------------------------------

/** Performs structural equivalence checks against TypeBox types. */
export namespace Structural {
  const referenceMap = new Map<string, Types.TAnySchema>()

  // ------------------------------------------------------------------------
  // Rules
  // ------------------------------------------------------------------------

  function AnyOrUnknownRule(right: Types.TSchema) {
    // https://github.com/microsoft/TypeScript/issues/40049
    if (right[Types.Kind] === 'Union' && right.anyOf.some((schema: Types.TSchema) => schema[Types.Kind] === 'Any' || schema[Types.Kind] === 'Unknown')) return true
    if (right[Types.Kind] === 'Unknown') return true
    if (right[Types.Kind] === 'Any') return true
    return false
  }

  function ObjectRightRule(left: Types.TAnySchema, right: Types.TObject) {
    // type A = boolean extends {}     ? 1 : 2 // additionalProperties: false
    // type B = boolean extends object ? 1 : 2 // additionalProperties: true
    const additionalProperties = right.additionalProperties
    const propertyLength = globalThis.Object.keys(right.properties).length
    return additionalProperties === false && propertyLength === 0
  }

  function UnionRightRule(left: Types.TAnySchema, right: Types.TUnion): StructuralResult {
    const result = right.anyOf.some((right: Types.TSchema) => Visit(left, right) !== StructuralResult.False)
    return result ? StructuralResult.True : StructuralResult.False
  }

  // ------------------------------------------------------------------------
  // Records
  // ------------------------------------------------------------------------

  function RecordPattern(schema: Types.TRecord) {
    return globalThis.Object.keys(schema.patternProperties)[0] as string
  }

  function RecordNumberOrStringKey(schema: Types.TRecord) {
    const pattern = RecordPattern(schema)
    return pattern === '^.*$' || pattern === '^(0|[1-9][0-9]*)$'
  }

  function RecordValue(schema: Types.TRecord) {
    const pattern = RecordPattern(schema)
    return schema.patternProperties[pattern]
  }

  function RecordKey(schema: Types.TRecord) {
    const pattern = RecordPattern(schema)
    if (pattern === '^.*$') {
      return Types.Type.String()
    } else if (pattern === '^(0|[1-9][0-9]*)$') {
      return Types.Type.Number()
    } else {
      const keys = pattern.slice(1, pattern.length - 1).split('|')
      const schemas = keys.map((key) => (isNaN(+key) ? Types.Type.Literal(key) : Types.Type.Literal(parseFloat(key))))
      return Types.Type.Union(schemas)
    }
  }

  function PropertyMap(schema: Types.TObject | Types.TRecord) {
    const comparable = new Map<string, Types.TSchema>()
    if (TypeGuard.TRecord(schema)) {
      const propertyPattern = RecordPattern(schema as Types.TRecord)
      if (propertyPattern === '^.*$' || propertyPattern === '^(0|[1-9][0-9]*)$') throw Error('Cannot extract record properties without property constraints')
      const propertySchema = schema.patternProperties[propertyPattern] as Types.TSchema
      const propertyKeys = propertyPattern.slice(1, propertyPattern.length - 1).split('|')
      propertyKeys.forEach((propertyKey) => {
        comparable.set(propertyKey, propertySchema)
      })
    } else {
      globalThis.Object.entries(schema.properties).forEach(([propertyKey, propertySchema]) => {
        comparable.set(propertyKey, propertySchema as Types.TSchema)
      })
    }
    return comparable
  }

  // ------------------------------------------------------------------------
  // Indexable
  // ------------------------------------------------------------------------

  function Indexable<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Types.TSchema): StructuralResult {
    if (TypeGuard.TUnion(right)) {
      return StructuralResult.False
    } else {
      return Visit(left, right)
    }
  }

  // ------------------------------------------------------------------------
  // Checks
  // ------------------------------------------------------------------------

  function Any(left: Types.TAny, right: Types.TSchema): StructuralResult {
    return AnyOrUnknownRule(right) ? StructuralResult.True : StructuralResult.Union
  }

  function Array(left: Types.TArray, right: Types.TSchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TObject(right)) {
      if (right.properties['length'] !== undefined && right.properties['length'][Types.Kind] === 'Number') return StructuralResult.True
      if (globalThis.Object.keys(right.properties).length === 0) return StructuralResult.True
      return StructuralResult.False
    } else if (!TypeGuard.TArray(right)) {
      return StructuralResult.False
    } else if (left.items === undefined && right.items !== undefined) {
      return StructuralResult.False
    } else if (left.items !== undefined && right.items === undefined) {
      return StructuralResult.False
    } else if (left.items === undefined && right.items === undefined) {
      return StructuralResult.False
    } else {
      const result = Visit(left.items, right.items) !== StructuralResult.False
      return result ? StructuralResult.True : StructuralResult.False
    }
  }

  function Boolean(left: Types.TBoolean, right: Types.TSchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TObject(right) && ObjectRightRule(left, right)) {
      return StructuralResult.True
    } else if (TypeGuard.TBoolean(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TUnion(right)) {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Constructor(left: Types.TConstructor, right: Types.TSchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TObject(right) && globalThis.Object.keys(right.properties).length === 0) {
      return StructuralResult.True
    } else if (!TypeGuard.TConstructor(right)) {
      return StructuralResult.False
    } else if (right.parameters.length < left.parameters.length) {
      return StructuralResult.False
    } else {
      if (Visit(left.returns, right.returns) === StructuralResult.False) {
        return StructuralResult.False
      }
      for (let i = 0; i < left.parameters.length; i++) {
        const result = Visit(right.parameters[i], left.parameters[i])
        if (result === StructuralResult.False) return StructuralResult.False
      }
      return StructuralResult.True
    }
  }

  function Function(left: Types.TFunction, right: Types.TSchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TObject(right)) {
      if (right.properties['length'] !== undefined && right.properties['length'][Types.Kind] === 'Number') return StructuralResult.True
      if (globalThis.Object.keys(right.properties).length === 0) return StructuralResult.True
      return StructuralResult.False
    } else if (!TypeGuard.TFunction(right)) {
      return StructuralResult.False
    } else if (right.parameters.length < left.parameters.length) {
      return StructuralResult.False
    } else if (Visit(left.returns, right.returns) === StructuralResult.False) {
      return StructuralResult.False
    } else {
      for (let i = 0; i < left.parameters.length; i++) {
        const result = Visit(right.parameters[i], left.parameters[i])
        if (result === StructuralResult.False) return StructuralResult.False
      }
      return StructuralResult.True
    }
  }

  function Integer(left: Types.TInteger, right: Types.TSchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TObject(right) && ObjectRightRule(left, right)) {
      return StructuralResult.True
    } else if (TypeGuard.TInteger(right) || TypeGuard.TNumber(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TUnion(right)) {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Literal(left: Types.TLiteral, right: Types.TSchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TObject(right) && ObjectRightRule(left, right)) {
      return StructuralResult.True
    } else if (TypeGuard.TRecord(right)) {
      if (typeof left.const === 'string') {
        return Indexable(left, RecordValue(right as Types.TRecord))
      } else {
        return StructuralResult.False
      }
    } else if (TypeGuard.TLiteral(right) && left.const === right.const) {
      return StructuralResult.True
    } else if (TypeGuard.TString(right) && typeof left.const === 'string') {
      return StructuralResult.True
    } else if (TypeGuard.TNumber(right) && typeof left.const === 'number') {
      return StructuralResult.True
    } else if (TypeGuard.TInteger(right) && typeof left.const === 'number') {
      return StructuralResult.True
    } else if (TypeGuard.TBoolean(right) && typeof left.const === 'boolean') {
      return StructuralResult.True
    } else if (TypeGuard.TUnion(right)) {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Number(left: Types.TNumber, right: Types.TSchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TObject(right) && ObjectRightRule(left, right)) {
      return StructuralResult.True
    } else if (TypeGuard.TNumber(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TInteger(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TUnion(right)) {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Null(left: Types.TNull, right: Types.TSchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TNull(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TUnion(right)) {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Properties(left: Map<string, Types.TSchema>, right: Map<string, Types.TSchema>) {
    if (right.size > left.size) return StructuralResult.False
    if (![...right.keys()].every((rightKey) => left.has(rightKey))) return StructuralResult.False
    for (const rightKey of right.keys()) {
      const leftProp = left.get(rightKey)!
      const rightProp = right.get(rightKey)!
      if (Visit(leftProp, rightProp) === StructuralResult.False) {
        return StructuralResult.False
      }
    }
    return StructuralResult.True
  }

  function Object(left: Types.TObject, right: Types.TAnySchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TObject(right)) {
      return Properties(PropertyMap(left), PropertyMap(right))
    } else if (TypeGuard.TRecord(right)) {
      if (!RecordNumberOrStringKey(right as Types.TRecord)) {
        return Properties(PropertyMap(left), PropertyMap(right))
      } else {
        return StructuralResult.True
      }
    } else {
      return StructuralResult.False
    }
  }

  function Promise(left: Types.TPromise, right: Types.TSchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TObject(right)) {
      if (ObjectRightRule(left, right) || globalThis.Object.keys(right.properties).length === 0) {
        return StructuralResult.True
      } else {
        return StructuralResult.False
      }
    } else if (!TypeGuard.TPromise(right)) {
      return StructuralResult.False
    } else {
      const result = Visit(left.item, right.item) !== StructuralResult.False
      return result ? StructuralResult.True : StructuralResult.False
    }
  }

  function Record(left: Types.TRecord, right: Types.TSchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TObject(right)) {
      if (RecordPattern(left) === '^.*$' && right[Types.Hint] === 'Record') {
        return StructuralResult.True
      } else if (RecordPattern(left) === '^.*$') {
        return StructuralResult.False
      } else {
        return globalThis.Object.keys(right.properties).length === 0 ? StructuralResult.True : StructuralResult.False
      }
    } else if (TypeGuard.TRecord(right)) {
      if (!RecordNumberOrStringKey(left as Types.TRecord) && !RecordNumberOrStringKey(right as Types.TRecord)) {
        return Properties(PropertyMap(left), PropertyMap(right))
      } else if (RecordNumberOrStringKey(left as Types.TRecord) && !RecordNumberOrStringKey(right as Types.TRecord)) {
        const leftKey = RecordKey(left as Types.TRecord)
        const rightKey = RecordKey(right as Types.TRecord)
        if (Visit(rightKey, leftKey) === StructuralResult.False) {
          return StructuralResult.False
        } else {
          return StructuralResult.True
        }
      } else {
        return StructuralResult.True
      }
    } else {
      return StructuralResult.False
    }
  }

  function Ref(left: Types.TRef, right: Types.TSchema): StructuralResult {
    if (!referenceMap.has(left.$ref)) throw Error(`Cannot locate referenced $id '${left.$ref}'`)
    const resolved = referenceMap.get(left.$ref)!
    return Visit(resolved, right)
  }

  function Self(left: Types.TSelf, right: Types.TSchema): StructuralResult {
    if (!referenceMap.has(left.$ref)) throw Error(`Cannot locate referenced self $id '${left.$ref}'`)
    const resolved = referenceMap.get(left.$ref)!
    return Visit(resolved, right)
  }

  function String(left: Types.TString, right: Types.TSchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TObject(right) && ObjectRightRule(left, right)) {
      return StructuralResult.True
    } else if (TypeGuard.TRecord(right)) {
      return Indexable(left, RecordValue(right))
    } else if (TypeGuard.TString(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TUnion(right)) {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Tuple(left: Types.TTuple, right: Types.TSchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TObject(right)) {
      const result = ObjectRightRule(left, right) || globalThis.Object.keys(right.properties).length === 0
      return result ? StructuralResult.True : StructuralResult.False
    } else if (TypeGuard.TRecord(right)) {
      return Indexable(left, RecordValue(right))
    } else if (TypeGuard.TArray(right)) {
      if (right.items === undefined) {
        return StructuralResult.False
      } else if (TypeGuard.TUnion(right.items) && left.items) {
        const result = left.items.every((left: Types.TSchema) => UnionRightRule(left, right.items as Types.TUnion) !== StructuralResult.False)
        return result ? StructuralResult.True : StructuralResult.False
      } else if (TypeGuard.TAny(right.items)) {
        return StructuralResult.True
      } else {
        return StructuralResult.False
      }
    }
    if (!TypeGuard.TTuple(right)) return StructuralResult.False
    if (left.items === undefined && right.items === undefined) return StructuralResult.True
    if (left.items === undefined && right.items !== undefined) return StructuralResult.False
    if (left.items !== undefined && right.items === undefined) return StructuralResult.False
    if (left.items === undefined && right.items === undefined) return StructuralResult.True
    if (left.minItems !== right.minItems || left.maxItems !== right.maxItems) return StructuralResult.False
    for (let i = 0; i < left.items!.length; i++) {
      if (Visit(left.items![i], right.items![i]) === StructuralResult.False) return StructuralResult.False
    }
    return StructuralResult.True
  }

  function Uint8Array(left: Types.TUint8Array, right: Types.TSchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TObject(right) && ObjectRightRule(left, right)) {
      return StructuralResult.True
    } else if (TypeGuard.TRecord(right)) {
      return Indexable(left, RecordValue(right as Types.TRecord))
    } else if (TypeGuard.TUint8Array(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TUnion(right)) {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Undefined(left: Types.TUndefined, right: Types.TSchema): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TUndefined(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TVoid(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TUnion(right)) {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Union(left: Types.TUnion, right: Types.TSchema): StructuralResult {
    if (left.anyOf.some((left: Types.TSchema) => TypeGuard.TAny(left))) {
      return StructuralResult.Union
    } else if (TypeGuard.TUnion(right)) {
      const result = left.anyOf.every((left: Types.TSchema) => right.anyOf.some((right: Types.TSchema) => Visit(left, right) !== StructuralResult.False))
      return result ? StructuralResult.True : StructuralResult.False
    } else {
      const result = left.anyOf.every((left: Types.TSchema) => Visit(left, right) !== StructuralResult.False)
      return result ? StructuralResult.True : StructuralResult.False
    }
  }

  function Unknown(left: Types.TUnknown, right: Types.TSchema): StructuralResult {
    if (TypeGuard.TUnion(right)) {
      const result = right.anyOf.some((right: Types.TSchema) => TypeGuard.TAny(right) || TypeGuard.TUnknown(right))
      return result ? StructuralResult.True : StructuralResult.False
    } else if (TypeGuard.TAny(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TUnknown(right)) {
      return StructuralResult.True
    } else {
      return StructuralResult.False
    }
  }

  function Void(left: Types.TVoid, right: Types.TSchema): StructuralResult {
    if (TypeGuard.TUnion(right)) {
      const result = right.anyOf.some((right: Types.TSchema) => TypeGuard.TAny(right) || TypeGuard.TUnknown(right))
      return result ? StructuralResult.True : StructuralResult.False
    } else if (TypeGuard.TAny(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TUnknown(right)) {
      return StructuralResult.True
    } else if (TypeGuard.TVoid(right)) {
      return StructuralResult.True
    } else {
      return StructuralResult.False
    }
  }

  let recursionDepth = 0
  function Visit<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Types.TSchema): StructuralResult {
    recursionDepth += 1
    if (recursionDepth >= 1000) return StructuralResult.True
    if (left.$id !== undefined) referenceMap.set(left.$id!, left)
    if (right.$id !== undefined) referenceMap.set(right.$id!, right)
    const resolvedRight = right[Types.Kind] === 'Self' ? referenceMap.get(right.$ref)! : right
    if (TypeGuard.TAny(left)) {
      return Any(left, resolvedRight)
    } else if (TypeGuard.TArray(left)) {
      return Array(left, resolvedRight)
    } else if (TypeGuard.TBoolean(left)) {
      return Boolean(left, resolvedRight)
    } else if (TypeGuard.TConstructor(left)) {
      return Constructor(left, resolvedRight)
    } else if (TypeGuard.TFunction(left)) {
      return Function(left, resolvedRight)
    } else if (TypeGuard.TInteger(left)) {
      return Integer(left, resolvedRight)
    } else if (TypeGuard.TLiteral(left)) {
      return Literal(left, resolvedRight)
    } else if (TypeGuard.TNull(left)) {
      return Null(left, resolvedRight)
    } else if (TypeGuard.TNumber(left)) {
      return Number(left, resolvedRight)
    } else if (TypeGuard.TObject(left)) {
      return Object(left, resolvedRight)
    } else if (TypeGuard.TPromise(left)) {
      return Promise(left, resolvedRight)
    } else if (TypeGuard.TRecord(left)) {
      return Record(left, resolvedRight)
    } else if (TypeGuard.TRef(left)) {
      return Ref(left, resolvedRight)
    } else if (TypeGuard.TSelf(left)) {
      return Self(left, resolvedRight)
    } else if (TypeGuard.TString(left)) {
      return String(left, resolvedRight)
    } else if (TypeGuard.TTuple(left)) {
      return Tuple(left, resolvedRight)
    } else if (TypeGuard.TUndefined(left)) {
      return Undefined(left, resolvedRight)
    } else if (TypeGuard.TUint8Array(left)) {
      return Uint8Array(left, resolvedRight)
    } else if (TypeGuard.TUnion(left)) {
      return Union(left, resolvedRight)
    } else if (TypeGuard.TUnknown(left)) {
      return Unknown(left, resolvedRight)
    } else if (TypeGuard.TVoid(left)) {
      return Void(left, resolvedRight)
    } else {
      throw Error(`Structural: Unknown left operand '${left[Types.Kind]}'`)
    }
  }

  /** Structurally tests if the left schema extends the right. */
  export function Check(left: Types.TSchema, right: Types.TSchema): StructuralResult {
    referenceMap.clear()
    recursionDepth = 0
    return Visit(left, right)
  }
}
