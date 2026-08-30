import { Assert } from 'test'
import Schema, { Intern } from 'typebox/schema'

const Test = Assert.Context('Schema.Intern')

// ------------------------------------------------------------------
// Parity Check
// ------------------------------------------------------------------
function Parity(a: Schema.XSchema, value: unknown) {
  const b = Intern(a)
  const R1 = Schema.Compile(a).Check(value)
  const R2 = Schema.Compile(b).Check(value)
  const R3 = Schema.Check(a, value)
  const R4 = Schema.Check(b, value)
  const R5 = Schema.Errors(a, value)[0]
  const R6 = Schema.Errors(b, value)[0]
  if (
    R1 === R2 &&
    R1 === R3 &&
    R1 === R4 &&
    R1 === R5 &&
    R1 === R6
  ) return R1
  throw Error('InternParityCheck Failed', { cause: { a, b } })
}
function Ok(schema: Schema.XSchema, value: unknown) {
  Assert.IsTrue(Parity(schema, value))
}
function Fail(schema: Schema.XSchema, value: unknown) {
  Assert.IsFalse(Parity(schema, value))
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
Test('Should Intern 1', () => {
  const A = { type: 'string' }
  Ok(A, 'hello')
  Fail(A, null)
})
Test('Should Intern 2', () => {
  const A = { type: 'number' }
  Ok(A, 1)
  Fail(A, null)
})
Test('Should Intern 3', () => {
  const A = { type: 'boolean' }
  Ok(A, true)
  Fail(A, 'true')
})
Test('Should Intern 4', () => {
  const A = { type: 'array' }
  Ok(A, [1, 2, 3])
  Fail(A, { length: 3 })
})
Test('Should Intern 5', () => {
  const A = { type: 'object' }
  Ok(A, { x: 1 })
  Fail(A, [1, 2])
})
Test('Should Intern 6', () => {
  const A = { type: 'integer' }
  Ok(A, 4)
  Fail(A, 4.5)
})
// ------------------------------------------------------------------
// MultiTypes
// ------------------------------------------------------------------
Test('Should Intern 7', () => {
  const A = { type: ['string', 'null'] }
  Ok(A, 'hello')
  Ok(A, null)
  Fail(A, [])
})
Test('Should Intern 8', () => {
  const A = { type: ['number', 'null'] }
  Ok(A, 1)
  Ok(A, null)
  Fail(A, [])
})
Test('Should Intern 9', () => {
  const A = { type: ['boolean', 'null'] }
  Ok(A, false)
  Ok(A, null)
  Fail(A, 0)
})
Test('Should Intern 10', () => {
  const A = { type: ['string', 'number'] }
  Ok(A, 'x')
  Ok(A, 1)
  Fail(A, true)
})
Test('Should Intern 11', () => {
  const A = { type: ['array', 'object'] }
  Ok(A, [1, 2])
  Ok(A, { x: 1 })
  Fail(A, 'x')
})
// ----------------------------------------------------------------
// AdditionalItems
// ----------------------------------------------------------------
Test('Should Intern 12', () => {
  const A = { items: [{ type: 'string' }], additionalItems: true }
  Ok(A, ['a'])
  Ok(A, ['a', 1, true])
})
Test('Should Intern 13', () => {
  const A = { items: [{ type: 'string' }], additionalItems: false }
  Ok(A, ['a'])
  Fail(A, ['a', 1])
})
Test('Should Intern 14', () => {
  const A = { items: [{ type: 'string' }], additionalItems: { type: 'number' } }
  Ok(A, ['a', 1, 2])
  Fail(A, ['a', 'b'])
})
Test('Should Intern 15', () => {
  const A = { items: [{ type: 'string' }, { type: 'number' }], additionalItems: { type: 'boolean' } }
  Ok(A, ['a', 1, true, false])
  Fail(A, ['a', 1, 'x'])
})
Test('Should Intern 16', () => {
  const A = { items: [{ type: 'string' }, { type: 'string' }], additionalItems: false }
  Ok(A, ['a', 'b'])
  Fail(A, ['a', 'b', 'c'])
})
Test('Should Intern 17', () => {
  const A = { items: [{ type: 'number' }], additionalItems: { type: 'number', minimum: 10 } }
  Ok(A, [1, 20, 30])
  Fail(A, [1, 5])
})
// ----------------------------------------------------------------
// AdditionalProperties
// ----------------------------------------------------------------
Test('Should Intern 18', () => {
  const A = { type: 'object', properties: { x: { type: 'string' } }, additionalProperties: true }
  Ok(A, { x: 'a' })
  Ok(A, { x: 'a', y: 1 })
})
Test('Should Intern 19', () => {
  const A = { type: 'object', properties: { x: { type: 'string' } }, additionalProperties: false }
  Ok(A, { x: 'a' })
  Fail(A, { x: 'a', y: 1 })
})
Test('Should Intern 20', () => {
  const A = { type: 'object', properties: { x: { type: 'string' } }, additionalProperties: { type: 'number' } }
  Ok(A, { x: 'a', y: 1 })
  Fail(A, { x: 'a', y: 'b' })
})
Test('Should Intern 21', () => {
  const A = { type: 'object', properties: {}, additionalProperties: false }
  Ok(A, {})
  Fail(A, { x: 1 })
})
Test('Should Intern 22', () => {
  const A = { type: 'object', properties: { x: { type: 'string' }, y: { type: 'number' } }, additionalProperties: false }
  Ok(A, { x: 'a', y: 1 })
  Fail(A, { x: 'a', y: 1, z: true })
})
Test('Should Intern 23', () => {
  const A = { type: 'object', properties: { x: { type: 'string' } }, additionalProperties: { type: 'number', minimum: 0 } }
  Ok(A, { x: 'a', y: 5, z: 10 })
  Fail(A, { x: 'a', y: -1 })
})
// ----------------------------------------------------------------
// AllOf
// ----------------------------------------------------------------
Test('Should Intern 24', () => {
  const A = { allOf: [{ type: 'string' }, { minLength: 3 }] }
  Ok(A, 'hello')
  Fail(A, 'ab')
})
Test('Should Intern 25', () => {
  const A = { allOf: [{ type: 'number' }, { minimum: 0 }, { maximum: 100 }] }
  Ok(A, 50)
  Fail(A, 150)
})
Test('Should Intern 26', () => {
  const A = { allOf: [{ type: 'string' }, { maxLength: 5 }] }
  Ok(A, 'abc')
  Fail(A, 'abcdefgh')
})
Test('Should Intern 27', () => {
  const A = { allOf: [{ type: 'object' }, { required: ['x'] }, { properties: { x: { type: 'number' } } }] }
  Ok(A, { x: 1 })
  Fail(A, { x: 'a' })
})
Test('Should Intern 28', () => {
  const A = { allOf: [{ type: 'string' }, { type: 'number' }] }
  Fail(A, 'x')
  Fail(A, 1)
})
Test('Should Intern 29', () => {
  const A = { allOf: [{ type: 'array' }, { minItems: 2 }, { maxItems: 4 }] }
  Ok(A, [1, 2, 3])
  Fail(A, [1])
})
// ----------------------------------------------------------------
// AnyOf
// ----------------------------------------------------------------
Test('Should Intern 30', () => {
  const A = { anyOf: [{ type: 'string' }, { type: 'number' }] }
  Ok(A, 'hello')
  Ok(A, 1)
  Fail(A, true)
})
Test('Should Intern 31', () => {
  const A = { anyOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }] }
  Ok(A, true)
  Fail(A, null)
})
Test('Should Intern 32', () => {
  const A = { anyOf: [{ type: 'number', minimum: 100 }, { type: 'number', maximum: 0 }] }
  Ok(A, 200)
  Ok(A, -5)
  Fail(A, 50)
})
Test('Should Intern 33', () => {
  const A = { anyOf: [{ type: 'object', required: ['a'] }, { type: 'object', required: ['b'] }] }
  Ok(A, { a: 1 })
  Ok(A, { b: 1 })
  Fail(A, { c: 1 })
})
Test('Should Intern 34', () => {
  const A = { anyOf: [true, { type: 'string' }] }
  Ok(A, 1)
  Ok(A, 'x')
})
Test('Should Intern 35', () => {
  const A = { anyOf: [{ type: 'array', minItems: 5 }, { type: 'array', maxItems: 1 }] }
  Ok(A, [1])
  Ok(A, [1, 2, 3, 4, 5, 6])
  Fail(A, [1, 2, 3])
})
// ----------------------------------------------------------------
// Contains
// ----------------------------------------------------------------
Test('Should Intern 36', () => {
  const A = { type: 'array', contains: { type: 'number' } }
  Ok(A, [1, 'a'])
  Fail(A, ['a', 'b'])
})
Test('Should Intern 37', () => {
  const A = { type: 'array', contains: { type: 'string', minLength: 3 } }
  Ok(A, ['ab', 'abcd'])
  Fail(A, ['ab', 'cd'])
})
Test('Should Intern 38', () => {
  const A = { type: 'array', contains: { type: 'number', minimum: 100 } }
  Ok(A, [1, 2, 200])
  Fail(A, [1, 2, 3])
})
Test('Should Intern 39', () => {
  const A = { type: 'array', contains: true }
  Ok(A, [1])
  Fail(A, [])
})
Test('Should Intern 40', () => {
  const A = { type: 'array', contains: { type: 'object', required: ['x'] } }
  Ok(A, [1, { x: 1 }])
  Fail(A, [1, { y: 1 }])
})
Test('Should Intern 41', () => {
  const A = { type: 'array', contains: { allOf: [{ type: 'number' }, { minimum: 10 }] } }
  Ok(A, [1, 20])
  Fail(A, [1, 2, 3])
})
// ----------------------------------------------------------------
// DependentSchemas
// ----------------------------------------------------------------
Test('Should Intern 42', () => {
  const A = { type: 'object', dependentSchemas: { x: { required: ['y'] } } }
  Ok(A, { x: 1, y: 2 })
  Ok(A, {})
  Fail(A, { x: 1 })
})
Test('Should Intern 43', () => {
  const A = { type: 'object', dependentSchemas: { a: { required: ['b'] }, b: { required: ['a'] } } }
  Ok(A, { a: 1, b: 2 })
  Fail(A, { a: 1 })
})
Test('Should Intern 44', () => {
  const A = { type: 'object', dependentSchemas: { x: { properties: { y: { type: 'number' } }, required: ['y'] } } }
  Ok(A, { x: 1, y: 5 })
  Fail(A, { x: 1, y: 'a' })
})
Test('Should Intern 45', () => {
  const A = { type: 'object', dependentSchemas: { x: false } }
  Ok(A, { y: 1 })
  Fail(A, { x: 1 })
})
Test('Should Intern 46', () => {
  const A = { type: 'object', dependentSchemas: { x: { required: ['y'] }, y: { required: ['z'] } } }
  Ok(A, { x: 1, y: 1, z: 1 })
  Fail(A, { x: 1, y: 1 })
})
// ----------------------------------------------------------------
// Else
// ----------------------------------------------------------------
Test('Should Intern 47', () => {
  const A = { if: { type: 'string' }, then: { minLength: 3 }, else: { minimum: 10 } }
  Ok(A, 'hello')
  Fail(A, 'ab')
  Ok(A, 20)
  Fail(A, 5)
})
Test('Should Intern 48', () => {
  const A = { if: { type: 'object' }, then: { required: ['x'] }, else: { type: 'array' } }
  Ok(A, { x: 1 })
  Fail(A, {})
  Ok(A, [1, 2])
  Fail(A, 'string')
})
Test('Should Intern 49', () => {
  const A = { if: { type: 'array' }, then: { minItems: 2 }, else: { type: 'boolean' } }
  Ok(A, [1, 2])
  Fail(A, [1])
  Ok(A, true)
  Fail(A, 'x')
})
// ----------------------------------------------------------------
// If
// ----------------------------------------------------------------
Test('Should Intern 50', () => {
  const A = { if: { type: 'number' }, then: { minimum: 0, maximum: 100 } }
  Ok(A, 50)
  Fail(A, 150)
  Ok(A, 'unrelated')
})
Test('Should Intern 51', () => {
  const A = { if: { properties: { role: { const: 'admin' } } }, then: { required: ['permissions'] } }
  Ok(A, { role: 'admin', permissions: [] })
  Fail(A, { role: 'admin' })
})
Test('Should Intern 52', () => {
  const A = { if: { minLength: 5 }, then: { pattern: '^[a-z]+$' } }
  Ok(A, 'hello')
  Fail(A, 'HELLO')
  Ok(A, 'AB')
})
Test('Should Intern 53', () => {
  const A = { if: { type: 'array' }, then: { items: { type: 'number' } } }
  Ok(A, [1, 2, 3])
  Fail(A, [1, 'x'])
})
// ----------------------------------------------------------------
// Items
// ----------------------------------------------------------------
Test('Should Intern 54', () => {
  const A = { type: 'array', items: { type: 'string' } }
  Ok(A, ['a', 'b'])
  Fail(A, ['a', 1])
})
Test('Should Intern 55', () => {
  const A = { type: 'array', items: { type: 'number', minimum: 0 } }
  Ok(A, [1, 2, 3])
  Fail(A, [1, -1])
})
Test('Should Intern 56', () => {
  const A = { type: 'array', items: { type: 'boolean' } }
  Ok(A, [true, false])
  Fail(A, [true, 1])
})
Test('Should Intern 57', () => {
  const A = { type: 'array', items: { type: 'object', properties: { x: { type: 'number' } }, required: ['x'] } }
  Ok(A, [{ x: 1 }, { x: 2 }])
  Fail(A, [{ x: 1 }, {}])
})
Test('Should Intern 58', () => {
  const A = { type: 'array', items: { type: 'array', items: { type: 'number' } } }
  Ok(A, [[1, 2], [3, 4]])
  Fail(A, [[1, 'a']])
})
// ----------------------------------------------------------------
// ItemsSized
// ----------------------------------------------------------------
Test('Should Intern 59', () => {
  const A = { type: 'array', items: [{ type: 'string' }, { type: 'number' }] }
  Ok(A, ['a', 1])
  Fail(A, [1, 'a'])
})
Test('Should Intern 60', () => {
  const A = { type: 'array', items: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }] }
  Ok(A, ['a', 1, true])
  Fail(A, ['a', 1, 'x'])
})
Test('Should Intern 61', () => {
  const A = { type: 'array', items: [{ type: 'object', required: ['x'] }] }
  Ok(A, [{ x: 1 }])
  Fail(A, [{}])
})
Test('Should Intern 62', () => {
  const A = { type: 'array', items: [{ type: 'array', items: { type: 'number' } }] }
  Ok(A, [[1, 2, 3]])
  Fail(A, [[1, 'a']])
})
Test('Should Intern 63', () => {
  const A = { type: 'array', items: [{ type: 'number' }] }
  Ok(A, [1])
  Fail(A, ['a'])
})
// ----------------------------------------------------------------
// ItemsUnsized
// ----------------------------------------------------------------
Test('Should Intern 64', () => {
  const A = { type: 'array', items: { type: 'number' } }
  Ok(A, [1, 2, 3])
  Fail(A, [1, 'a'])
})
Test('Should Intern 65', () => {
  const A = { type: 'array', items: { type: 'string', pattern: '^[A-Z]' } }
  Ok(A, ['Abc', 'Def'])
  Fail(A, ['abc'])
})
Test('Should Intern 66', () => {
  const A = { type: 'array', items: { anyOf: [{ type: 'string' }, { type: 'number' }] } }
  Ok(A, ['a', 1, 'b'])
  Fail(A, [true])
})
Test('Should Intern 67', () => {
  const A = { type: 'array', items: { type: 'object' } }
  Ok(A, [{ a: 1 }, {}])
  Fail(A, [1])
})
Test('Should Intern 68', () => {
  const A = { type: 'array', items: false }
  Ok(A, [])
  Fail(A, [1])
})
// ----------------------------------------------------------------
// Not
// ----------------------------------------------------------------
Test('Should Intern 69', () => {
  const A = { not: { type: 'string' } }
  Ok(A, 1)
  Fail(A, 'a')
})
Test('Should Intern 70', () => {
  const A = { not: { type: 'number' } }
  Ok(A, 'a')
  Fail(A, 1)
})
Test('Should Intern 71', () => {
  const A = { not: { required: ['x'] }, type: 'object' }
  Ok(A, { y: 1 })
  Fail(A, { x: 1 })
})
Test('Should Intern 72', () => {
  const A = { not: { anyOf: [{ type: 'string' }, { type: 'number' }] } }
  Ok(A, true)
  Fail(A, 'x')
})
Test('Should Intern 73', () => {
  const A = { not: false }
  Ok(A, 'anything')
  Ok(A, null)
})
// ----------------------------------------------------------------
// OneOf
// ----------------------------------------------------------------
Test('Should Intern 74', () => {
  const A = { oneOf: [{ type: 'number', multipleOf: 5 }, { type: 'number', multipleOf: 3 }] }
  Ok(A, 5)
  Ok(A, 3)
  Fail(A, 15)
})
Test('Should Intern 75', () => {
  const A = { oneOf: [{ type: 'string' }, { type: 'number' }] }
  Ok(A, 'x')
  Ok(A, 1)
  Fail(A, true)
})
Test('Should Intern 76', () => {
  const A = { oneOf: [{ type: 'object', required: ['a'] }, { type: 'object', required: ['b'] }] }
  Ok(A, { a: 1 })
  Fail(A, { a: 1, b: 1 })
})
Test('Should Intern 77', () => {
  const A = { oneOf: [{ minimum: 0, maximum: 10 }, { minimum: 5, maximum: 20 }] }
  Ok(A, 2)
  Ok(A, 15)
  Fail(A, 7)
})
Test('Should Intern 78', () => {
  const A = { oneOf: [{ type: 'array' }, { type: 'object' }, { type: 'string' }] }
  Ok(A, [1])
  Fail(A, 1)
})
// ----------------------------------------------------------------
// PatternProperties
// ----------------------------------------------------------------
Test('Should Intern 79', () => {
  const A = { type: 'object', patternProperties: { '^S_': { type: 'string' } } }
  Ok(A, { S_a: 'x' })
  Fail(A, { S_a: 1 })
})
Test('Should Intern 80', () => {
  const A = { type: 'object', patternProperties: { '^N_': { type: 'number' } } }
  Ok(A, { N_a: 1 })
  Fail(A, { N_a: 'x' })
})
Test('Should Intern 81', () => {
  const A = { type: 'object', patternProperties: { '^S_': { type: 'string' }, '^N_': { type: 'number' } } }
  Ok(A, { S_a: 'x', N_a: 1 })
  Fail(A, { S_a: 1, N_a: 'x' })
})
Test('Should Intern 82', () => {
  const A = { type: 'object', properties: { x: { type: 'boolean' } }, patternProperties: { '^S_': { type: 'string' } } }
  Ok(A, { x: true, S_a: 'x' })
  Fail(A, { x: true, S_a: 1 })
})
Test('Should Intern 83', () => {
  const A = { type: 'object', patternProperties: { '^S_': { type: 'string' } }, additionalProperties: false }
  Ok(A, { S_a: 'x' })
  Fail(A, { other: 1 })
})
// ----------------------------------------------------------------
// PrefixItems
// ----------------------------------------------------------------
Test('Should Intern 84', () => {
  const A = { type: 'array', prefixItems: [{ type: 'string' }, { type: 'number' }] }
  Ok(A, ['a', 1])
  Fail(A, [1, 'a'])
})
Test('Should Intern 85', () => {
  const A = { type: 'array', prefixItems: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }] }
  Ok(A, ['a', 1, true])
  Fail(A, ['a', 1, 'x'])
})
Test('Should Intern 86', () => {
  const A = { type: 'array', prefixItems: [{ type: 'string' }], items: false }
  Ok(A, ['a'])
  Fail(A, ['a', 1])
})
Test('Should Intern 87', () => {
  const A = { type: 'array', prefixItems: [{ type: 'object', required: ['x'] }] }
  Ok(A, [{ x: 1 }])
  Fail(A, [{}])
})
Test('Should Intern 88', () => {
  const A = { type: 'array', prefixItems: [{ type: 'array', items: { type: 'number' } }] }
  Ok(A, [[1, 2]])
  Fail(A, [[1, 'a']])
})
// ----------------------------------------------------------------
// Properties
// ----------------------------------------------------------------
Test('Should Intern 89', () => {
  const A = { type: 'object', properties: { x: { type: 'string' } }, required: ['x'] }
  Ok(A, { x: 'a' })
  Fail(A, {})
})
Test('Should Intern 90', () => {
  const A = { type: 'object', properties: { x: { type: 'string' }, y: { type: 'number' } }, required: ['x', 'y'] }
  Ok(A, { x: 'a', y: 1 })
  Fail(A, { x: 'a' })
})
Test('Should Intern 91', () => {
  const A = { type: 'object', properties: { x: { type: 'string' } } }
  Ok(A, {})
  Fail(A, { x: 1 })
})
Test('Should Intern 92', () => {
  const A = { type: 'object', properties: { inner: { type: 'object', properties: { x: { type: 'number' } }, required: ['x'] } }, required: ['inner'] }
  Ok(A, { inner: { x: 1 } })
  Fail(A, { inner: {} })
})
Test('Should Intern 93', () => {
  const A = { type: 'object', properties: { list: { type: 'array', items: { type: 'number' } } } }
  Ok(A, { list: [1, 2, 3] })
  Fail(A, { list: [1, 'a'] })
})
// ----------------------------------------------------------------
// PropertyNames
// ----------------------------------------------------------------
Test('Should Intern 94', () => {
  const A = { type: 'object', propertyNames: { pattern: '^[a-z]+$' } }
  Ok(A, { abc: 1 })
  Fail(A, { ABC: 1 })
})
Test('Should Intern 95', () => {
  const A = { type: 'object', propertyNames: { maxLength: 3 } }
  Ok(A, { abc: 1 })
  Fail(A, { abcdef: 1 })
})
Test('Should Intern 96', () => {
  const A = { type: 'object', propertyNames: { minLength: 2 } }
  Ok(A, { ab: 1 })
  Fail(A, { a: 1 })
})
Test('Should Intern 97', () => {
  const A = { type: 'object', propertyNames: { pattern: '^prefix_' } }
  Ok(A, { prefix_a: 1 })
  Fail(A, { other_a: 1 })
})
Test('Should Intern 98', () => {
  const A = { type: 'object', propertyNames: { allOf: [{ minLength: 2 }, { pattern: '^[a-z]+$' }] } }
  Ok(A, { ab: 1 })
  Fail(A, { A: 1 })
})
// ----------------------------------------------------------------
// UnevaluatedProperties
// ----------------------------------------------------------------
Test('Should Intern 99', () => {
  const A = { type: 'object', properties: { x: { type: 'string' } }, unevaluatedProperties: false }
  Ok(A, { x: 'a' })
  Fail(A, { x: 'a', y: 1 })
})
Test('Should Intern 100', () => {
  const A = { type: 'object', properties: { x: { type: 'string' } }, unevaluatedProperties: { type: 'number' } }
  Ok(A, { x: 'a', y: 1 })
  Fail(A, { x: 'a', y: 'b' })
})
Test('Should Intern 101', () => {
  const A = { type: 'object', allOf: [{ properties: { x: { type: 'string' } } }], unevaluatedProperties: false }
  Ok(A, { x: 'a' })
  Fail(A, { x: 'a', y: 1 })
})
Test('Should Intern 102', () => {
  const A = { type: 'object', properties: {}, unevaluatedProperties: false }
  Ok(A, {})
  Fail(A, { x: 1 })
})
// ----------------------------------------------------------------
// UnevaluatedItems
// ----------------------------------------------------------------
Test('Should Intern 103', () => {
  const A = { type: 'array', prefixItems: [{ type: 'string' }], unevaluatedItems: false }
  Ok(A, ['a'])
  Fail(A, ['a', 1])
})
Test('Should Intern 104', () => {
  const A = { type: 'array', prefixItems: [{ type: 'string' }], unevaluatedItems: { type: 'number' } }
  Ok(A, ['a', 1, 2])
  Fail(A, ['a', 'b'])
})
Test('Should Intern 105', () => {
  const A = { type: 'array', prefixItems: [{ type: 'string' }, { type: 'number' }], unevaluatedItems: false }
  Ok(A, ['a', 1])
  Fail(A, ['a', 1, true])
})
Test('Should Intern 106', () => {
  const A = { type: 'array', unevaluatedItems: false }
  Ok(A, [])
  Fail(A, [1])
})
// ----------------------------------------------------------------
// Ref / $defs (non-cyclic)
// ----------------------------------------------------------------
Test('Should Intern 107', () => {
  const A = { $defs: { Str: { type: 'string' } }, $ref: '#/$defs/Str' }
  Ok(A, 'hello')
  Fail(A, 1)
})
Test('Should Intern 108', () => {
  const A = { $defs: { Positive: { type: 'number', minimum: 0 } }, $ref: '#/$defs/Positive' }
  Ok(A, 5)
  Fail(A, -5)
})
Test('Should Intern 109', () => {
  const A = {
    $defs: { Str: { type: 'string', minLength: 1 } },
    type: 'object',
    properties: { a: { $ref: '#/$defs/Str' }, b: { $ref: '#/$defs/Str' } },
    required: ['a', 'b']
  }
  Ok(A, { a: 'x', b: 'y' })
  Fail(A, { a: '', b: 'y' })
})
// ----------------------------------------------------------------
// Cyclic Ref (interior cycle via $defs, and root self-reference)
// ----------------------------------------------------------------
Test('Should Intern 110', () => {
  const A = {
    $defs: {
      Node: {
        type: 'object',
        properties: { value: { type: 'number' }, next: { anyOf: [{ $ref: '#/$defs/Node' }, { type: 'null' }] } },
        required: ['value', 'next']
      }
    },
    $ref: '#/$defs/Node'
  }
  Ok(A, { value: 1, next: { value: 2, next: null } })
  Fail(A, { value: 1, next: { value: 'x', next: null } })
})
Test('Should Intern 111', () => {
  const A = {
    type: 'object',
    properties: { value: { type: 'number' }, next: { anyOf: [{ type: 'null' }, { $ref: '#' }] } },
    required: ['value', 'next']
  }
  Ok(A, { value: 1, next: { value: 2, next: null } })
  Fail(A, { value: 1, next: { value: 'x', next: null } })
})
// ----------------------------------------------------------------
// SchemaBoolean
// ----------------------------------------------------------------
Test('Should Intern 112', () => {
  const A = true
  Ok(A, 'anything')
  Ok(A, 123)
})
Test('Should Intern 113', () => {
  const A = false
  Fail(A, 'anything')
  Fail(A, null)
})
// ----------------------------------------------------------------
// Ref Resolution Errors
// ----------------------------------------------------------------
Test('Should Intern 114', () => {
  const A = { $defs: { Str: { type: 'string' } }, $ref: '#/$defs/Missing' }
  let thrown = false
  try {
    Intern(A)
  } catch {
    thrown = true
  }
  Assert.IsTrue(thrown)
})
Test('Should Intern 115', () => {
  const A = { $ref: '#/$defs/AlsoMissing' }
  let thrown = false
  try {
    Intern(A)
  } catch {
    thrown = true
  }
  Assert.IsTrue(thrown)
})
// ----------------------------------------------------------------
// Cyclic Ref (true interior cycle - neither side is the document root)
// ----------------------------------------------------------------
Test('Should Intern 116', () => {
  const A = {
    type: 'object',
    properties: { start: { $ref: '#/$defs/NodeA' } },
    required: ['start'],
    $defs: {
      NodeA: { type: 'object', properties: { value: { type: 'number' }, b: { $ref: '#/$defs/NodeB' } }, required: ['value'] },
      NodeB: { type: 'object', properties: { value: { type: 'string' }, a: { $ref: '#/$defs/NodeA' } }, required: ['value'] }
    }
  }
  Ok(A, { start: { value: 1, b: { value: 'x', a: { value: 2 } } } })
  Fail(A, { start: { value: 'not-a-number' } })
})
Test('Should Intern 117', () => {
  const A = {
    type: 'object',
    properties: { start: { $ref: '#/$defs/NodeA' } },
    required: ['start'],
    $defs: {
      NodeA: { type: 'object', properties: { value: { type: 'number' }, b: { $ref: '#/$defs/NodeB' } }, required: ['value'] },
      NodeB: { type: 'object', properties: { value: { type: 'string' }, a: { $ref: '#/$defs/NodeA' } }, required: ['value'] }
    }
  }
  Ok(A, { start: { value: 1 } })
  Fail(A, { start: { value: 1, b: { value: 5 } } })
})
Test('Should Intern 118', () => {
  const A = {
    type: 'object',
    properties: { x: { $ref: '#/$defs/NodeA' }, y: { $ref: '#/$defs/NodeA' } },
    $defs: {
      NodeA: { type: 'object', properties: { b: { $ref: '#/$defs/NodeB' } } },
      NodeB: { type: 'object', properties: { a: { $ref: '#/$defs/NodeA' } } }
    }
  }
  Ok(A, { x: { b: { a: {} } }, y: {} })
  Fail(A, { x: { b: { a: 'not-an-object' } } })
})
// ----------------------------------------------------------------
// Refine
// ----------------------------------------------------------------
Test('Should Intern 119', () => {
  const A = { type: 'number', '~refine': [{ check: (value: unknown) => (value as number) > 0, error: () => 'must be positive' }] }
  Ok(A, 5)
  Fail(A, -5)
})
Test('Should Intern 120', () => {
  const A = { type: 'string', '~refine': [{ check: (value: unknown) => (value as string).length > 3, error: () => 'too short' }] }
  Ok(A, 'hello')
  Fail(A, 'hi')
  Fail(A, 123)
})
Test('Should Intern 121', () => {
  const A = {
    type: 'number',
    '~refine': [
      { check: (value: unknown) => (value as number) > 0, error: () => 'must be positive' },
      { check: (value: unknown) => (value as number) % 2 === 0, error: () => 'must be even' }
    ]
  }
  Ok(A, 4)
  Fail(A, 3)
  Fail(A, -2)
})
Test('Should Intern 122', () => {
  const A = {
    type: 'object',
    properties: { x: { type: 'number' } },
    required: ['x'],
    '~refine': [{ check: (value: unknown) => (value as { x: number }).x < 100, error: () => 'x too large' }]
  }
  Ok(A, { x: 50 })
  Fail(A, { x: 200 })
})
Test('Should Intern 123', () => {
  const check = (value: unknown) => (value as number) > 0
  const error = () => 'must be positive'
  const A = {
    $defs: { Pos: { type: 'number', '~refine': [{ check, error }] } },
    type: 'object',
    properties: { a: { $ref: '#/$defs/Pos' }, b: { $ref: '#/$defs/Pos' } },
    required: ['a', 'b']
  }
  Ok(A, { a: 1, b: 2 })
  Fail(A, { a: -1, b: 2 })
})
Test('Should Intern 124', () => {
  const A = {
    allOf: [{ type: 'number' }, { minimum: 0 }],
    '~refine': [{ check: (value: unknown) => Number.isInteger(value), error: () => 'must be an integer' }]
  }
  Ok(A, 4)
  Fail(A, 4.5)
  Fail(A, -1)
})
// ----------------------------------------------------------------
// BooleanIntern
// ----------------------------------------------------------------
Test('Should Intern 124', () => {
  const A = {
    $defs: { condition: true },
    $ref: '#/$defs/condition'
  }
  Ok(A, 1)
})
Test('Should Intern 124', () => {
  const A = {
    $defs: { condition: false },
    $ref: '#/$defs/condition'
  }
  Fail(A, 1)
})
// ----------------------------------------------------------------
// UnsupportedKeyword
// ----------------------------------------------------------------
Test('Should Intern 125', () => {
  Assert.Throws(() => Schema.Intern({ $dynamicRef: 'x' }))
})
Test('Should Intern 126', () => {
  Assert.Throws(() => Schema.Intern({ $recursiveRef: 'x' }))
})
// ----------------------------------------------------------------
// UnresolvableRef
// ----------------------------------------------------------------
Test('Should Intern 127', () => {
  Assert.Throws(() => Schema.Intern({ $ref: 'unresolvable' }))
})
Test('Should Intern 128', () => {
  Assert.Throws(() =>
    Schema.Intern({
      $defs: {
        A: { $ref: 'unresolvable' }
      },
      $ref: '#/defs/A'
    })
  )
})
