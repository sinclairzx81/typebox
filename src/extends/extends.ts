/*--------------------------------------------------------------------------

@sinclair/typebox/extends

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

// ----------------------------------------------------------------------
// Structural
// ----------------------------------------------------------------------

export enum StructuralResult {
  Union,
  True,
  False,
}

/** Experimental: Does effort structural check on TypeBox types. */
export namespace Structural {
  const referenceMap = new Map<string, Types.TAnySchema>()

  // ----------------------------------------------------------------------
  // Rules
  // ----------------------------------------------------------------------

  function AnyOrUnknownRule<Right extends Types.TAnySchema>(right: Right) {
    // https://github.com/microsoft/TypeScript/issues/40049
    if (right[Types.Kind] === 'Union' && right.anyOf.some((schema: Types.TSchema) => schema[Types.Kind] === 'Any' || schema[Types.Kind] === 'Unknown')) return true
    if (right[Types.Kind] === 'Unknown') return true
    if (right[Types.Kind] === 'Any') return true
    return false
  }

  function ObjectRightRule<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right) {
    // type A = boolean extends {}     ? 1 : 2 // additionalProperties: false
    // type B = boolean extends object ? 1 : 2 // additionalProperties: true
    const additionalProperties = right.additionalProperties
    const propertyLength = globalThis.Object.keys(right.properties).length
    return additionalProperties === false && propertyLength === 0
  }

  function UnionRightRule<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    const result = right.anyOf.some((right: Types.TSchema) => Visit(left, right) !== StructuralResult.False)
    return result ? StructuralResult.True : StructuralResult.False
  }

  // ----------------------------------------------------------------------
  // Records
  // ----------------------------------------------------------------------

  function RecordPattern<T extends Types.TRecord>(schema: T) {
    return globalThis.Object.keys(schema.patternProperties)[0] as string
  }

  function RecordNumberOrStringKey<T extends Types.TRecord>(schema: T) {
    const pattern = RecordPattern(schema)
    return pattern === '^.*$' || pattern === '^(0|[1-9][0-9]*)$'
  }

  export function RecordValue<T extends Types.TRecord>(schema: T) {
    const pattern = RecordPattern(schema)
    return schema.patternProperties[pattern]
  }

  export function RecordKey<T extends Types.TRecord>(schema: T) {
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

  function PropertyMap<T extends Types.TAnySchema>(schema: T) {
    const comparable = new Map<string, Types.TSchema>()
    if (schema[Types.Kind] === 'Record') {
      const propertyPattern = RecordPattern(schema as Types.TRecord)
      if (propertyPattern === '^.*$' || propertyPattern === '^(0|[1-9][0-9]*)$') throw Error('Cannot extract record properties without property constraints')
      const propertySchema = schema.patternProperties[propertyPattern] as Types.TSchema
      const propertyKeys = propertyPattern.slice(1, propertyPattern.length - 1).split('|')
      propertyKeys.forEach((propertyKey) => {
        comparable.set(propertyKey, propertySchema)
      })
    } else if (schema[Types.Kind] === 'Object') {
      globalThis.Object.entries(schema.properties).forEach(([propertyKey, propertySchema]) => {
        comparable.set(propertyKey, propertySchema as Types.TSchema)
      })
    } else {
      throw Error(`Cannot create property map from '${schema[Types.Kind]}' types`)
    }
    return comparable
  }

  // ----------------------------------------------------------------------
  // Indexable
  // ----------------------------------------------------------------------

  function Indexable<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (right[Types.Kind] === 'Union') {
      return StructuralResult.False
    } else {
      return Visit(left, right)
    }
  }

  // ----------------------------------------------------------------------
  // Checks
  // ----------------------------------------------------------------------

  function Any<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    return AnyOrUnknownRule(right) ? StructuralResult.True : StructuralResult.Union
  }

  function Array<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Object') {
      if (right.properties['length'] !== undefined && right.properties['length'][Types.Kind] === 'Number') return StructuralResult.True
      if (globalThis.Object.keys(right.properties).length === 0) return StructuralResult.True
      return StructuralResult.False
    } else if (right[Types.Kind] !== 'Array') {
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

  function Boolean<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Object' && ObjectRightRule(left, right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Boolean') {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Union') {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Constructor<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] !== 'Constructor') {
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

  function Enum<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Enum') {
      return StructuralResult.False // Cannot check enum as only values are encoded
    } else {
      return StructuralResult.False
    }
  }

  function Function<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Object') {
      if (right.properties['length'] !== undefined && right.properties['length'][Types.Kind] === 'Number') return StructuralResult.True
      if (globalThis.Object.keys(right.properties).length === 0) return StructuralResult.True
      return StructuralResult.False
    } else if (right[Types.Kind] !== 'Function') {
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

  function Integer<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Object' && ObjectRightRule(left, right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Integer') {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Number') {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Union') {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Literal<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Object' && ObjectRightRule(left, right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Record') {
      if (typeof left.const === 'string') {
        return Indexable(left, RecordValue(right as Types.TRecord))
      } else {
        return StructuralResult.False
      }
    } else if (right[Types.Kind] === 'Literal' && left.const === right.const) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'String' && typeof left.const === 'string') {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Number' && typeof left.const === 'number') {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Integer' && typeof left.const === 'number') {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Boolean' && typeof left.const === 'boolean') {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Union') {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Number<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Object' && ObjectRightRule(left, right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Number') {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Integer') {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Union') {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Null<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Null') {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Union') {
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

  function Object<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Object') {
      return Properties(PropertyMap(left), PropertyMap(right))
    } else if (right[Types.Kind] === 'Record') {
      if (!RecordNumberOrStringKey(right as Types.TRecord)) {
        return Properties(PropertyMap(left), PropertyMap(right))
      } else {
        return StructuralResult.True
      }
    } else {
      return StructuralResult.False
    }
  }

  function Promise<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Object') {
      if (ObjectRightRule(left, right) || globalThis.Object.keys(right.properties).length === 0) {
        return StructuralResult.True
      } else {
        return StructuralResult.False
      }
    } else if (right[Types.Kind] !== 'Promise') {
      return StructuralResult.False
    } else {
      const result = Visit(left.item, right.item) !== StructuralResult.False
      return result ? StructuralResult.True : StructuralResult.False
    }
  }

  function Unknown<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (right[Types.Kind] === 'Union') {
      const result = right.anyOf.some((right: Types.TSchema) => right[Types.Kind] === 'Any' || right[Types.Kind] === 'Unknown')
      return result ? StructuralResult.True : StructuralResult.False
    } else if (right[Types.Kind] === 'Any') {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Unknown') {
      return StructuralResult.True
    } else {
      return StructuralResult.False
    }
  }

  function Record<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Object') {
      if (!RecordNumberOrStringKey(left as Types.TRecord)) {
        return Properties(PropertyMap(left), PropertyMap(right))
      } else {
        return globalThis.Object.keys(right.properties).length === 0 ? StructuralResult.True : StructuralResult.False
      }
    } else if (right[Types.Kind] === 'Record') {
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

  function Ref<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (!referenceMap.has(left.$ref)) throw Error(`Cannot locate referenced $id '${left.$ref}'`)
    const resolved = referenceMap.get(left.$ref)!
    return Visit(resolved, right)
  }

  function Self<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (!referenceMap.has(left.$ref)) throw Error(`Cannot locate referenced self $id '${left.$ref}'`)
    const resolved = referenceMap.get(left.$ref)!
    return Visit(resolved, right)
  }

  function String<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Object' && ObjectRightRule(left, right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Record') {
      return Indexable(left, RecordValue(right as Types.TRecord))
    } else if (right[Types.Kind] === 'String') {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Union') {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Tuple<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Object') {
      const result = ObjectRightRule(left, right) || globalThis.Object.keys(right.properties).length === 0
      return result ? StructuralResult.True : StructuralResult.False
    } else if (right[Types.Kind] === 'Record') {
      return Indexable(left, RecordValue(right as Types.TRecord))
    } else if (right[Types.Kind] === 'Array') {
      if (right.items === undefined) {
        return StructuralResult.False
      } else if (right.items[Types.Kind] === 'Union') {
        const result = left.items.every((left: Types.TSchema) => UnionRightRule(left, right.items) !== StructuralResult.False)
        return result ? StructuralResult.True : StructuralResult.False
      } else if (right.items[Types.Kind] === 'Any') {
        return StructuralResult.True
      } else {
        return StructuralResult.False
      }
    } else {
      if (right[Types.Kind] !== 'Tuple') return StructuralResult.False
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
  }

  function Uint8Array<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Object' && ObjectRightRule(left, right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Record') {
      return Indexable(left, RecordValue(right as Types.TRecord))
    } else if (right[Types.Kind] === 'Uint8Array') {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Union') {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Undefined<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (AnyOrUnknownRule(right)) {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Undefined') {
      return StructuralResult.True
    } else if (right[Types.Kind] === 'Union') {
      return UnionRightRule(left, right)
    } else {
      return StructuralResult.False
    }
  }

  function Union<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    if (left.anyOf.some((left: Types.TSchema) => left[Types.Kind] === 'Any')) {
      return StructuralResult.Union
    } else if (right[Types.Kind] === 'Union') {
      const result = left.anyOf.every((left: Types.TSchema) => right.anyOf.some((right: Types.TSchema) => Visit(left, right) !== StructuralResult.False))
      return result ? StructuralResult.True : StructuralResult.False
    } else {
      const result = left.anyOf.every((left: Types.TSchema) => Visit(left, right) !== StructuralResult.False)
      return result ? StructuralResult.True : StructuralResult.False
    }
  }

  let recursionDepth = 0
  function Visit<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    recursionDepth += 1
    if (recursionDepth >= 1000) return StructuralResult.True
    if (left.$id !== undefined) referenceMap.set(left.$id!, left)
    if (right.$id !== undefined) referenceMap.set(right.$id!, right)
    const resolvedRight = right[Types.Kind] === 'Self' ? referenceMap.get(right.$ref)! : right
    switch (left[Types.Kind]) {
      case 'Any':
        return Any(left, resolvedRight)
      case 'Array':
        return Array(left, resolvedRight)
      case 'Boolean':
        return Boolean(left, resolvedRight)
      case 'Constructor':
        return Constructor(left, resolvedRight)
      case 'Enum':
        return Enum(left, resolvedRight)
      case 'Function':
        return Function(left, resolvedRight)
      case 'Integer':
        return Integer(left, resolvedRight)
      case 'Literal':
        return Literal(left, resolvedRight)
      case 'Null':
        return Null(left, resolvedRight)
      case 'Number':
        return Number(left, resolvedRight)
      case 'Object':
        return Object(left, resolvedRight)
      case 'Promise':
        return Promise(left, resolvedRight)
      case 'Record':
        return Record(left, resolvedRight)
      case 'Ref':
        return Ref(left, resolvedRight)
      case 'String':
        return String(left, resolvedRight)
      case 'Tuple':
        return Tuple(left, resolvedRight)
      case 'Undefined':
        return Undefined(left, resolvedRight)
      case 'Uint8Array':
        return Uint8Array(left, resolvedRight)
      case 'Union':
        return Union(left, resolvedRight)
      case 'Unknown':
        return Unknown(left, resolvedRight)
      case 'Self':
        return Self(left, resolvedRight)
      default:
        return StructuralResult.False
    }
  }

  /** Returns ExtendsResult.True if the left schema structurally extends the right schema. */
  export function Check<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult {
    referenceMap.clear()
    recursionDepth = 0
    return Visit(left, right)
  }
}

// --------------------------------------------------------------------------
// Exclude
// --------------------------------------------------------------------------

export interface TExclude<T extends Types.TUnion, U extends Types.TUnion> extends Types.TUnion {
  static: Exclude<Types.Static<T, this['params']>, Types.Static<U, this['params']>>
}

// --------------------------------------------------------------------------
// Extract
// --------------------------------------------------------------------------

export interface TExtract<T extends Types.TSchema, U extends Types.TUnion> extends Types.TUnion {
  static: Extract<Types.Static<T, this['params']>, Types.Static<U, this['params']>>
}

// --------------------------------------------------------------------------
// Extends
// --------------------------------------------------------------------------

export type TExtends<T extends Types.TSchema, U extends Types.TSchema, X extends Types.TSchema, Y extends Types.TSchema> = T extends Types.TAny
  ? U extends Types.TUnknown
    ? X
    : U extends Types.TAny
    ? X
    : Types.TUnion<[X, Y]>
  : T extends U
  ? X
  : Y


/** Provides conditional mapping support for TypeBox types. */
export namespace Conditional {

  /** Constructs a type by excluding from UnionType all union members that are assignable to ExcludedMembers */
  export function Exclude<T extends Types.TUnion, U extends Types.TUnion>(unionType: T, excludedMembers: U, options: Types.SchemaOptions = {}): TExclude<T, U> {
    const anyOf = unionType.anyOf.filter((schema: Types.TSchema) => !Structural.Check(schema, excludedMembers)).map((schema) => Clone(schema))
    return { ...options, [Types.Kind]: 'Union', anyOf } as any
  }

  /** Constructs a type by extracting from Type all union members that are assignable to Union. */
  export function Extract<T extends Types.TSchema, U extends Types.TUnion>(type: T, union: U, options: Types.SchemaOptions = {}): TExtract<T, U> {
    if (type[Types.Kind] === 'Union') {
      const anyOf = type.anyOf.filter((schema: Types.TSchema) => Structural.Check(schema, union) === StructuralResult.True).map((schema: Types.TSchema) => Clone(schema))
      return { ...options, [Types.Kind]: 'Union', anyOf } as any
    } else {
      const anyOf = union.anyOf.filter((schema) => Structural.Check(type, schema) === StructuralResult.True).map((schema) => Clone(schema))
      return { ...options, [Types.Kind]: 'Union', anyOf } as any
    }
  }

  /** If left extends right, return True otherwise False */
  export function Extends<Left extends Types.TSchema, Right extends Types.TSchema, True extends Types.TSchema, False extends Types.TSchema>(left: Left, right: Right, x: True, y: False): TExtends<Left, Right, True, False> {
    const result = Structural.Check(left, right)
    switch (result) {
      case StructuralResult.Union:
        return Types.Type.Union([Clone(x), Clone(y)]) as any as TExtends<Left, Right, True, False>
      case StructuralResult.True:
        return Clone(x)
      case StructuralResult.False:
        return Clone(y)
    }
  }

  function Clone(value: any): any {
    const isObject = (object: any): object is Record<string | symbol, any> => typeof object === 'object' && object !== null && !Array.isArray(object)
    const isArray = (object: any): object is any[] => typeof object === 'object' && object !== null && Array.isArray(object)
    if (isObject(value)) {
      return Object.keys(value).reduce(
        (acc, key) => ({
          ...acc,
          [key]: Clone(value[key]),
        }),
        Object.getOwnPropertySymbols(value).reduce(
          (acc, key) => ({
            ...acc,
            [key]: Clone(value[key]),
          }),
          {},
        ),
      )
    } else if (isArray(value)) {
      return value.map((item: any) => Clone(item))
    } else {
      return value
    }
  }
}
