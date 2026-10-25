import * as Module from 'typebox/module'
import Type from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Module.Canonical')

// ------------------------------------------------------------------
// Modifiers
// ------------------------------------------------------------------
Test('Should Modifiers 1', () => {
  const A = Type.Optional(Type.String())
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Modifiers 2', () => {
  const A = Type.Readonly(Type.String())
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Modifiers 3', () => {
  const A = Type.Readonly(Type.Optional(Type.String()))
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Modifiers 4', () => {
  const A = Type.Immutable(Type.Array(Type.String()))
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Any
// ------------------------------------------------------------------
Test('Should Any 1', () => {
  const A = Type.Any()
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
Test('Should Array 1', () => {
  const A = Type.Array(Type.String())
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
Test('Should BigInt 1', () => {
  const A = Type.BigInt()
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should BigInt 2', () => {
  const A = Module.Canonical.Infer({ type: 'bigint' })
  const B = Type.BigInt()
  Assert.IsEqual(A, B)
})
Test('Should BigInt 3', () => {
  const A = Module.Canonical.Infer({ type: 'bigint', minimum: 1n })
  const B = Type.BigInt()
  Assert.IsEqual(A, B)
})
Test('Should BigInt 4', () => {
  const A = Module.Canonical.Infer({ minimum: 1n })
  const B = Type.BigInt()
  Assert.IsEqual(A, B)
})
Test('Should BigInt 5', () => {
  const A = Module.Canonical.Infer({ maximum: 1n })
  const B = Type.BigInt()
  Assert.IsEqual(A, B)
})
Test('Should BigInt 6', () => {
  const A = Module.Canonical.Infer({ exclusiveMinimum: 1n })
  const B = Type.BigInt()
  Assert.IsEqual(A, B)
})
Test('Should BigInt 7', () => {
  const A = Module.Canonical.Infer({ exclusiveMaximum: 1n })
  const B = Type.BigInt()
  Assert.IsEqual(A, B)
})
Test('Should BigInt 8', () => {
  const A = Module.Canonical.Infer({ multipleOf: 2n })
  const B = Type.BigInt()
  Assert.IsEqual(A, B)
})
Test('Should BigInt 9', () => {
  const A = Module.Canonical.Infer({ minimum: 1n, maximum: 5n })
  const B = Type.BigInt()
  Assert.IsEqual(A, B)
})
Test('Should BigInt 10', () => {
  const A = Module.Canonical.Infer({ type: 'bigint', const: 1n })
  const B = Type.Literal(1n)
  Assert.IsEqual(A, B)
})
// explicit type wins over mismatched constraints
Test('Should BigInt 11', () => {
  const A = Module.Canonical.Infer({ type: 'bigint', minimum: 1 })
  const B = Type.BigInt()
  Assert.IsEqual(A, B)
})
Test('Should BigInt 12', () => {
  const A = Module.Canonical.Infer({ type: 'bigint', minimum: 1n, maximum: 5 })
  const B = Type.BigInt()
  Assert.IsEqual(A, B)
})
Test('Should BigInt 13', () => {
  const A = Module.Canonical.Infer({ type: 'bigint', minimum: 'x' })
  const B = Type.BigInt()
  Assert.IsEqual(A, B)
})
// implicit is strict: mixed constraints are not inferred
Test('Should BigInt 14', () => {
  const A = Module.Canonical.Infer({ minimum: 1n, maximum: 5 })
  const B = Type.Unknown({ inferred: false })
  Assert.IsEqual(A, B)
})
Test('Should BigInt 15', () => {
  const A = Module.Canonical.Infer({ type: 'string', minimum: 1n })
  const B = Type.String()
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
Test('Should Boolean 1', () => {
  const A = Type.Boolean()
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
Test('Should Constructor 1', () => {
  const A = Type.Constructor([Type.String(), Type.Number()], Type.Object({}))
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Cyclic
// ------------------------------------------------------------------
Test('Should Cyclic 1', () => {
  const A = Type.Cyclic({
    A: Type.Object({
      x: Type.Ref('A')
    })
  }, 'A')
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Enum
// ------------------------------------------------------------------
Test('Should Enum 1', () => {
  const A = Type.Enum([1, 2])
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
Test('Should Function 1', () => {
  const A = Type.Function([Type.String(), Type.Number()], Type.Object({}))
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Integer
// ------------------------------------------------------------------
Test('Should Integer 1', () => {
  const A = Type.Integer()
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
Test('Should Intersect 1', () => {
  const A = Type.Intersect([Type.String(), Type.Literal('hello')])
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
Test('Should Literal 1', () => {
  const A = Type.Literal(1n)
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Literal 2', () => {
  const A = Type.Literal(true)
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Literal 3', () => {
  const A = Module.Canonical.Infer(Type.Literal(1))
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Literal 4', () => {
  const A = Type.Literal('x')
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Never
// ------------------------------------------------------------------
Test('Should Never 1', () => {
  const A = Type.Never()
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Never 2', () => {
  const A = Module.Canonical.Infer(false)
  const B = Type.Never()
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
Test('Should Null 1', () => {
  const A = Type.Null()
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
Test('Should Number 1', () => {
  const A = Type.Number()
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Number 2', () => {
  const A = Module.Canonical.Infer({ type: 'number' })
  const B = Type.Number()
  Assert.IsEqual(A, B)
})
Test('Should Number 3', () => {
  const A = Module.Canonical.Infer({ type: 'number', minimum: 1 })
  const B = Type.Number()
  Assert.IsEqual(A, B)
})
Test('Should Number 4', () => {
  const A = Module.Canonical.Infer({ minimum: 1 })
  const B = Type.Number()
  Assert.IsEqual(A, B)
})
Test('Should Number 5', () => {
  const A = Module.Canonical.Infer({ maximum: 1 })
  const B = Type.Number()
  Assert.IsEqual(A, B)
})
Test('Should Number 6', () => {
  const A = Module.Canonical.Infer({ exclusiveMinimum: 1 })
  const B = Type.Number()
  Assert.IsEqual(A, B)
})
Test('Should Number 7', () => {
  const A = Module.Canonical.Infer({ exclusiveMaximum: 1 })
  const B = Type.Number()
  Assert.IsEqual(A, B)
})
Test('Should Number 8', () => {
  const A = Module.Canonical.Infer({ multipleOf: 2 })
  const B = Type.Number()
  Assert.IsEqual(A, B)
})
Test('Should Number 9', () => {
  const A = Module.Canonical.Infer({ minimum: 1, maximum: 5 })
  const B = Type.Number()
  Assert.IsEqual(A, B)
})
Test('Should Number 10', () => {
  const A = Module.Canonical.Infer({ type: 'number', const: 1 })
  const B = Type.Literal(1)
  Assert.IsEqual(A, B)
})
// explicit type wins over mismatched constraints
Test('Should Number 11', () => {
  const A = Module.Canonical.Infer({ type: 'number', minimum: 5n })
  const B = Type.Number()
  Assert.IsEqual(A, B)
})
Test('Should Number 12', () => {
  const A = Module.Canonical.Infer({ type: 'number', minimum: 1, maximum: 5n })
  const B = Type.Number()
  Assert.IsEqual(A, B)
})
Test('Should Number 13', () => {
  const A = Module.Canonical.Infer({ type: 'number', minimum: 'x' })
  const B = Type.Number()
  Assert.IsEqual(A, B)
})
// implicit is strict: mixed constraints are not inferred
Test('Should Number 14', () => {
  const A = Module.Canonical.Infer({ minimum: 1, maximum: 5n })
  const B = Type.Unknown({ inferred: false })
  Assert.IsEqual(A, B)
})
Test('Should Number 15', () => {
  const A = Module.Canonical.Infer({ type: 'string', minimum: 1 })
  const B = Type.String()
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
Test('Should Object 1', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Object 2', () => {
  const A = Module.Canonical.Infer({ type: 'object' })
  const B = Type.Object({})
  Assert.IsEqual(A, B)
})
Test('Should Object 3', () => {
  const A = Module.Canonical.Infer({ type: 'object', properties: { x: { type: 'number' } } })
  const B = Type.Object({ x: Type.Optional(Type.Number()) })
  Assert.IsEqual(A, B)
})
Test('Should Object 4', () => {
  const A = Module.Canonical.Infer({ type: 'object', required: ['x'], properties: { x: { type: 'number' } } })
  const B = Type.Object({ x: Type.Number() })
  Assert.IsEqual(A, B)
})
Test('Should Object 5', () => {
  const A = Module.Canonical.Infer({ type: 'object', required: ['x', 'y'], properties: { x: { type: 'number' } } })
  const B = Type.Object({ x: Type.Number(), y: Type.Unknown() })
  Assert.IsEqual(A, B)
})
Test('Should Object 6', () => {
  const A = Type.Partial(Type.Object({ x: Type.Number() }))
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
Test('Should Record 1', () => {
  const A = Type.Record(Type.String(), Type.Number())
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Record 2', () => {
  const A = Type.Record(Type.Integer(), Type.Number())
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Record 3', () => {
  const A = Type.Record(Type.Number(), Type.Number())
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Record 4', () => {
  const A = Type.Record(Type.TemplateLiteral('a${string}'), Type.Number())
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Record 5', () => {
  const A = Type.Record(Type.TemplateLiteral('a${number}'), Type.Number())
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Record 7', () => {
  const A = Type.Record(Type.String(), Type.Object({ x: Type.Number() }))
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Record 8', () => {
  const A = Type.Record(Type.String(), Type.Record(Type.String(), Type.Number()))
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Record 9', () => {
  const T = Type.Record(Type.String(), Type.Number())
  const A = Module.Canonical.Infer({ type: 'object', patternProperties: T.patternProperties })
  const B = Type.Record(Type.String(), Type.Number())
  Assert.IsEqual(A, B)
})
Test('Should Record 10', () => {
  const T = Type.Record(Type.Integer(), Type.Number())
  const A = Module.Canonical.Infer({ type: 'object', patternProperties: T.patternProperties })
  const B = Type.Record(Type.Integer(), Type.Number())
  Assert.IsEqual(A, B)
})
Test('Should Record 11', () => {
  const T = Type.Record(Type.Number(), Type.Number())
  const A = Module.Canonical.Infer({ type: 'object', patternProperties: T.patternProperties })
  const B = Type.Record(Type.Number(), Type.Number())
  Assert.IsEqual(A, B)
})
Test('Should Record 12', () => {
  const A = Module.Canonical.Infer({
    type: 'object',
    patternProperties: { A: { const: 1 } }
  })
  const B = Type.Record(Type.Literal('A'), Type.Literal(1))
  Assert.IsEqual(A, B)
})
Test('Should Record 13', () => {
  const A = Module.Canonical.Infer({
    type: 'object',
    patternProperties: { A: { const: 1 }, B: { const: 3 } }
  })
  const B = Type.Partial(Type.Object({
    A: Type.Union([Type.Literal(1), Type.Literal(3)]),
    B: Type.Union([Type.Literal(1), Type.Literal(3)])
  }))
  Assert.IsEqual(A, B)
})
Test('Should Record 14', () => {
  const T = Type.TemplateLiteral('a${1 | 2}')
  const A = Module.Canonical.Infer({
    type: 'object',
    patternProperties: { [T.pattern]: { const: 1 }, B: { const: 3 } }
  })
  const B = Type.Partial(Type.Object({
    a1: Type.Union([Type.Literal(1), Type.Literal(3)]),
    a2: Type.Union([Type.Literal(1), Type.Literal(3)]),
    B: Type.Union([Type.Literal(1), Type.Literal(3)])
  }))
  Assert.IsEqual(A, B)
})
Test('Should Record 15', () => {
  const A = Module.Canonical.Infer({
    type: 'object',
    propertyNames: { type: 'string' }
  })
  const B = Type.Record(Type.String(), Type.Unknown())
  Assert.IsEqual(A, B)
})
Test('Should Record 16', () => {
  const A = Module.Canonical.Infer({
    type: 'object',
    propertyNames: { type: 'string', minLength: 3, maxLength: 10 }
  })
  const B = Type.Record(Type.String(), Type.Unknown())
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Ref
// ------------------------------------------------------------------
Test('Should Ref 1', () => {
  const A = Module.Canonical.Infer({
    $defs: { A: { type: 'string' } },
    $ref: '#/$defs/A'
  })
  const B = Type.String()
  Assert.IsEqual(A, B)
})
Test('Should Ref 2', () => {
  const A = Module.Canonical.Infer({ $ref: '#/$defs/Missing' })
  const B = Type.Ref('Missing')
  Assert.IsEqual(A, B)
})
Test('Should Ref 3', () => {
  const A = Module.Canonical.Infer({ $ref: '#/properties/a/items' })
  const B = Type.Ref('items')
  Assert.IsEqual(A, B)
})
Test('Should Ref 4', () => {
  const A = Module.Canonical.Infer({ $ref: 'other.json#/$defs/X' })
  const B = Type.Ref('X')
  Assert.IsEqual(A, B)
})
Test('Should Ref 5', () => {
  const A = Module.Canonical.Infer({ $ref: 'Missing' })
  const B = Type.Ref('Missing')
  Assert.IsEqual(A, B)
})
Test('Should Ref 6', () => {
  const A = Module.Canonical.Infer({
    $defs: { N: { type: 'number' } },
    type: 'object',
    properties: { x: { $ref: '#/$defs/N' } },
    required: ['x']
  })
  const B = Type.Object({ x: Type.Number() })
  Assert.IsEqual(A, B)
})
Test('Should Ref 7', () => {
  const A = Module.Canonical.Infer({
    $defs: { A: { type: 'object', properties: { next: { $ref: '#/$defs/A' } } } },
    $ref: '#/$defs/A'
  })
  const B = Type.Object({
    next: Type.Optional(Type.Ref('A'))
  })
  Assert.IsEqual(A, B)
})
Test('Should Ref 8', () => {
  const A = Module.Canonical.Infer({
    $defs: {
      A: { type: 'object', properties: { b: { $ref: '#/$defs/B' } } },
      B: { type: 'string' }
    },
    $ref: '#/$defs/A'
  })
  const B = Type.Object({
    b: Type.Optional(Type.String())
  })
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// RecursiveRef
// ------------------------------------------------------------------
Test('Should RecursiveRef 1', () => {
  const A = Module.Canonical.Infer({ $recursiveRef: '#missing' })
  const B = Type.Unknown()
  Assert.IsEqual(A, B)
})
Test('Should RecursiveRef 2', () => {
  const A = Module.Canonical.Infer({ $recursiveRef: '#' })
  const B = Type.Unknown()
  Assert.IsEqual(A, B)
})
Test('Should RecursiveRef 3', () => {
  const A = Module.Canonical.Infer({
    type: 'object',
    properties: { next: { $recursiveRef: '#' } },
    required: ['next']
  })
  const B = Type.Object({
    next: Type.Object({
      next: Type.Object({
        next: Type.Any()
      })
    })
  })
  Assert.IsEqual(A, B)
})

// ------------------------------------------------------------------
// DynamicRef
// ------------------------------------------------------------------
Test('Should DynamicRef 1', () => {
  const A = Module.Canonical.Infer({ $dynamicRef: '#missing' })
  const B = Type.Unknown()
  Assert.IsEqual(A, B)
})
Test('Should DynamicRef 2', () => {
  const A = Module.Canonical.Infer({
    $dynamicAnchor: 'node',
    type: 'object',
    properties: { next: { $dynamicRef: '#node' } },
    required: ['next']
  })
  const B = Type.Object({
    next: Type.Object({
      next: Type.Object({
        next: Type.Any()
      })
    })
  })
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
Test('Should String 1', () => {
  const A = Type.String()
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should String 2', () => {
  const A = Module.Canonical.Infer({ type: 'string' })
  const B = Type.String()
  Assert.IsEqual(A, B)
})
Test('Should String 3', () => {
  const A = Module.Canonical.Infer({ type: 'string', minLength: 1 })
  const B = Type.String()
  Assert.IsEqual(A, B)
})
Test('Should String 4', () => {
  const A = Module.Canonical.Infer({ minLength: 1 })
  const B = Type.String()
  Assert.IsEqual(A, B)
})
Test('Should String 5', () => {
  const A = Module.Canonical.Infer({ maxLength: 5 })
  const B = Type.String()
  Assert.IsEqual(A, B)
})
Test('Should String 6', () => {
  const A = Module.Canonical.Infer({ minLength: 1, maxLength: 5 })
  const B = Type.String()
  Assert.IsEqual(A, B)
})
Test('Should String 7', () => {
  const A = Module.Canonical.Infer({ type: 'string', const: 'x' })
  const B = Type.Literal('x')
  Assert.IsEqual(A, B)
})
// explicit type wins over malformed constraints
Test('Should String 8', () => {
  const A = Module.Canonical.Infer({ type: 'string', minLength: 'x' })
  const B = Type.String()
  Assert.IsEqual(A, B)
})
// explicit non-string type is not claimed by the implicit path
Test('Should String 9', () => {
  const A = Module.Canonical.Infer({ type: 'number', minLength: 1 })
  const B = Type.Number()
  Assert.IsEqual(A, B)
})
Test('Should String 10', () => {
  const A = Module.Canonical.Infer({ type: ['number', 'string'], minLength: 1 })
  const B = Type.Union([Type.Number(), Type.String()])
  Assert.IsEqual(A, B)
})
// implicit is strict: malformed constraints are not inferred
Test('Should String 11', () => {
  const A = Module.Canonical.Infer({ minLength: 'x' })
  const B = Type.Unknown({ inferred: false })
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Symbol
// ------------------------------------------------------------------
Test('Should Symbol 1', () => {
  const A = Type.Symbol()
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// TemplateLiteral
// ------------------------------------------------------------------
Test('Should TemplateLiteral 1', () => {
  const A = Type.TemplateLiteral('hello${1 | 2}')
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should TemplateLiteral 2', () => {
  const A = Module.Canonical.Infer({ pattern: 'x' })
  const B = Type.Literal('x')
  Assert.IsEqual(A, B)
})
Test('Should TemplateLiteral 2', () => {
  const A = Module.Canonical.Infer({ pattern: 'x(1|2)' })
  const B = Type.String()
  Assert.IsEqual(A, B)
})
Test('Should TemplateLiteral 4', () => {
  // Coverage on IsRegExpValid guard
  const A = Module.Canonical.Infer({ pattern: 'x(1' })
  const B = Type.Literal('x(1')
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
Test('Should Tuple 1', () => {
  const A = Type.Tuple([Type.String(), Type.Number()])
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Tuple 2', () => {
  const A = Module.Canonical.Infer({
    type: 'array',
    items: [{ type: 'string' }, { type: 'number' }],
    minItems: 2,
    maxItems: 2
  })
  const B = Type.Tuple([Type.String(), Type.Number()])
  Assert.IsEqual(A, B)
})
Test('Should Tuple 3', () => {
  const A = Module.Canonical.Infer({
    type: 'array',
    prefixItems: [{ type: 'string' }, { type: 'number' }],
    minItems: 2,
    maxItems: 2
  })
  const B = Type.Tuple([Type.String(), Type.Number()])
  Assert.IsEqual(A, B)
})
Test('Should Tuple 4', () => {
  const A = Module.Canonical.Infer({
    type: 'array',
    prefixItems: [{ type: 'string' }, { type: 'number' }],
    items: false,
    minItems: 2
  })
  const B = Type.Tuple([Type.String(), Type.Number()])
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
Test('Should Undefined 1', () => {
  const A = Type.Undefined()
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
Test('Should Union 1', () => {
  const A = Type.Union([Type.Number(), Type.String()])
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
Test('Should Union 2', () => {
  const A = Module.Canonical.Infer({ oneOf: [{ type: 'number' }, { type: 'string' }] })
  const B = Type.Union([Type.Number(), Type.String()])
  Assert.IsEqual(A, B)
})
Test('Should Union 3', () => {
  const A = Module.Canonical.Infer({ type: ['number', 'string'] })
  const B = Type.Union([Type.Number(), Type.String()])
  Assert.IsEqual(A, B)
})
Test('Should Union 4', () => {
  const A = Module.Canonical.Infer({ type: [] })
  const B = Type.Union([])
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Void
// ------------------------------------------------------------------
Test('Should Void 1', () => {
  const A = Type.Void()
  const B = Module.Canonical.Infer(A)
  Assert.IsEqual(A, B)
})
