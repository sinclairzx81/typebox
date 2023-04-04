/*--------------------------------------------------------------------------

@sinclair/typebox/codegen

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

import { Formatter } from './formatter'
import * as Types from '@sinclair/typebox'

// --------------------------------------------------------------------------
// Errors
// --------------------------------------------------------------------------
export class TypeBoxToZodNonReferentialType extends Error {
  constructor(message: string) {
    super(`TypeBoxToZod: ${message}`)
  }
}
export class TypeBoxToZodUnsupportedType extends Error {
  constructor(message: string) {
    super(`TypeBoxToZod: ${message}`)
  }
}
// --------------------------------------------------------------------------
// Transform
// --------------------------------------------------------------------------
export interface ZodCodegenOptions {
  imports: boolean
  exports: boolean
}
export namespace TypeBoxToZod {
  function Any(schema: Types.TAny) {
    return `z.any()`
  }
  function Array(schema: Types.TArray) {
    const items = Visit(schema.items)
    return `z.array(${items})`
  }
  function Boolean(schema: Types.TBoolean) {
    return `z.boolean()`
  }
  function Constructor(schema: Types.TConstructor): string {
    throw new TypeBoxToZodUnsupportedType(`TConstructor`)
  }
  function Function(schema: Types.TFunction) {
    const params = schema.parameters.map((param) => Visit(param)).join(`, `)
    const returns = Visit(schema.returns)
    return `z.function().args(${params}).returns(${returns})`
  }
  function Integer(schema: Types.TInteger) {
    const buffer: string[] = []
    buffer.push(`z.number().int()`)
    if (schema.minimum !== undefined) buffer.push(`.min(${schema.minimum})`)
    if (schema.maximum !== undefined) buffer.push(`.max(${schema.maximum})`)
    if (schema.exclusiveMaximum !== undefined) buffer.push(`.max(${schema.exclusiveMaximum - 1})`)
    if (schema.exclusiveMinimum !== undefined) buffer.push(`.max(${schema.exclusiveMinimum + 1})`)
    if (schema.multipleOf !== undefined) buffer.push(`.multipleOf(${schema.multipleOf})`)
    return buffer.join(``)
  }
  function Intersect(schema: Types.TIntersect) {
    // note: Zod only supports binary intersection. While correct, this is partially at odds with TypeScript's
    // ability to distribute across (A & B & C). This code reduces intersection to binary ops.
    function reduce(rest: Types.TSchema[]): string {
      if (rest.length === 0) throw Error('Expected at least one intersect type')
      if (rest.length === 1) return Visit(rest[0])
      const [left, right] = [rest[0], rest.slice(1)]
      return `z.intersection(${Visit(left)}, ${reduce(right)})`
    }
    return reduce(schema.allOf)
  }
  function Literal(schema: Types.TLiteral) {
    if (typeof schema.const === `string`) {
      return `z.literal('${schema.const}')`
    } else {
      return `z.literal(${schema.const})`
    }
  }
  function Never(schema: Types.TNever) {
    return `z.never()`
  }
  function Null(schema: Types.TNull) {
    return `z.null()`
  }
  function String(schema: Types.TString) {
    const buffer: string[] = []
    buffer.push(`z.string()`)
    if (schema.maxLength !== undefined) buffer.push(`.max(${schema.maxLength})`)
    if (schema.minLength !== undefined) buffer.push(`.min(${schema.minLength})`)
    return buffer.join(``)
  }
  function Number(schema: Types.TNumber) {
    const buffer: string[] = []
    buffer.push(`z.number()`)
    if (schema.minimum !== undefined) buffer.push(`.min(${schema.minimum})`)
    if (schema.maximum !== undefined) buffer.push(`.max(${schema.maximum})`)
    if (schema.exclusiveMaximum !== undefined) buffer.push(`.max(${schema.exclusiveMaximum - 1})`)
    if (schema.exclusiveMinimum !== undefined) buffer.push(`.max(${schema.exclusiveMinimum + 1})`)
    if (schema.multipleOf !== undefined) buffer.push(`.multipleOf(${schema.multipleOf})`)
    return buffer.join(``)
  }
  function Object(schema: Types.TObject) {
    const properties: string = globalThis.Object.entries(schema.properties)
      .map(([key, value]) => {
        const quoted = key.includes('-') || '1234567890'.includes(key.charAt(0))
        const property = quoted ? `'${key}'` : key
        return [`Optional`, `ReadonlyOptional`].includes(value[Types.Modifier] as string) ? `${property}: ${Visit(value)}.optional()` : `${property}: ${Visit(value)}`
      })
      .join(`,\n`)
    const buffer: string[] = []
    buffer.push(`z.object({\n${properties}\n})`)
    if (schema.additionalProperties === false) buffer.push(`.strict()`)
    return buffer.join(``)
  }
  function Promise(schema: Types.TPromise) {
    const item = Visit(schema.item)
    return `${item}.promise()`
  }
  function Record(schema: Types.TRecord) {
    for (const [key, value] of globalThis.Object.entries(schema.patternProperties)) {
      const type = Visit(value)
      if (key === `^(0|[1-9][0-9]*)$`) {
        throw new TypeBoxToZodUnsupportedType(`TRecord<TNumber, TUnknown>`)
      } else {
        return `z.record(${type})`
      }
    }
    throw Error(`TypeBoxToZod: Unreachable`)
  }
  function Ref(schema: Types.TRef) {
    if (!reference_map.has(schema.$ref!)) throw new TypeBoxToZodNonReferentialType(schema.$ref!)
    return schema.$ref
  }
  function This(schema: Types.TThis) {
    if (!reference_map.has(schema.$ref!)) throw new TypeBoxToZodNonReferentialType(schema.$ref!)
    recursive_set.add(schema.$ref)
    return schema.$ref
  }
  function Tuple(schema: Types.TTuple) {
    if (schema.items === undefined) return `[]`
    const items = schema.items.map((schema) => Visit(schema)).join(`, `)
    return `z.tuple([${items}])`
  }
  function UInt8Array(schema: Types.TUint8Array): string {
    throw new TypeBoxToZodUnsupportedType(`TUint8Array`)
  }
  function Undefined(schema: Types.TUndefined) {
    return `z.undefined()`
  }
  function Union(schema: Types.TUnion) {
    return `z.union([${schema.anyOf.map((schema) => Visit(schema)).join(`, `)}])`
  }
  function Unknown(schema: Types.TUnknown) {
    return `z.unknown()`
  }
  function Void(schema: Types.TVoid) {
    return `z.void()`
  }
  function Visit(schema: Types.TSchema): string {
    if (schema.$id !== undefined) reference_map.set(schema.$id, schema)
    if (Types.TypeGuard.TAny(schema)) {
      return Any(schema)
    } else if (Types.TypeGuard.TArray(schema)) {
      return Array(schema)
    } else if (Types.TypeGuard.TBoolean(schema)) {
      return Boolean(schema)
    } else if (Types.TypeGuard.TConstructor(schema)) {
      return Constructor(schema)
    } else if (Types.TypeGuard.TFunction(schema)) {
      return Function(schema)
    } else if (Types.TypeGuard.TInteger(schema)) {
      return Integer(schema)
    } else if (Types.TypeGuard.TIntersect(schema)) {
      return Intersect(schema)
    } else if (Types.TypeGuard.TLiteral(schema)) {
      return Literal(schema)
    } else if (Types.TypeGuard.TNever(schema)) {
      return Never(schema)
    } else if (Types.TypeGuard.TNull(schema)) {
      return Null(schema)
    } else if (Types.TypeGuard.TNumber(schema)) {
      return Number(schema)
    } else if (Types.TypeGuard.TObject(schema)) {
      return Object(schema)
    } else if (Types.TypeGuard.TPromise(schema)) {
      return Promise(schema)
    } else if (Types.TypeGuard.TRecord(schema)) {
      return Record(schema)
    } else if (Types.TypeGuard.TRef(schema)) {
      return Ref(schema)
    } else if (Types.TypeGuard.TString(schema)) {
      return String(schema)
    } else if (Types.TypeGuard.TThis(schema)) {
      return This(schema)
    } else if (Types.TypeGuard.TTuple(schema)) {
      return Tuple(schema)
    } else if (Types.TypeGuard.TUint8Array(schema)) {
      return UInt8Array(schema)
    } else if (Types.TypeGuard.TUndefined(schema)) {
      return Undefined(schema)
    } else if (Types.TypeGuard.TUnion(schema)) {
      return Union(schema)
    } else if (Types.TypeGuard.TUnknown(schema)) {
      return Unknown(schema)
    } else if (Types.TypeGuard.TVoid(schema)) {
      return Void(schema)
    } else {
      throw Error(`TypeBoxToZod: Unknown type`)
    }
  }
  const reference_map = new Map<string, Types.TSchema>()
  const recursive_set = new Set<string>()
  /** Renders a Zod definition of a TypeBox type */
  export function Generate(schema: Types.TSchema, references: Types.TSchema[], options: ZodCodegenOptions = { imports: true, exports: false }) {
    const emitted = new Set<string>()
    const exports = options.exports ? 'export' : ''
    const imports_code: string[] = []
    const reference_code: string[] = []
    const type_code: string[] = []
    // initialize root schematic and reference map
    if (schema.$id === undefined) schema.$id = `T_Generated`
    for (const reference of references) {
      if (reference.$id === undefined) throw new TypeBoxToZodNonReferentialType(JSON.stringify(reference))
      reference_map.set(reference.$id, reference)
    }
    // render-code: Imports required for the generated code
    if (options.imports) {
      imports_code.push(`import z from 'zod'`)
    }
    // render-type: If we detect the root schematic has been referenced, we interpret this as a recursive
    // root. It`s noted that zod performs 4x slower when wrapped in a lazy(() => ...), so this is considered
    // an optimization.
    const typedef = [...Visit(schema)].join(``)
    if (recursive_set.has(schema.$id!)) {
      type_code.push(`${exports} const ${schema.$id || `T`} = z.lazy(() => ${Formatter.Format(typedef)})`)
    } else {
      type_code.push(`${exports} const ${schema.$id || `T`} = ${Formatter.Format(typedef)}`)
    }
    emitted.add(schema.$id!)
    // render-reference: References may either be recursive or not. We track a recursive_set when visiting
    // schemas of type TSelf. If we`ve never observed the reference through recursion, when it should be safe
    // to omit the lazy(() => ...) wrap.
    for (const reference of reference_map.values()) {
      if (emitted.has(reference.$id!)) continue
      const typedef = [...Visit(schema)].join(``)
      if (recursive_set.has(reference.$id!)) {
        reference_code.push(`${exports} const ${reference.$id} = z.lazy(() => ${typedef})`)
      } else {
        reference_code.push(`${exports} const ${reference.$id} = ${typedef}`)
      }
      emitted.add(reference.$id!)
    }
    return Formatter.Format([...imports_code, ...reference_code, ...type_code].join(`\n\n`))
  }
}
