import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Array', () => {
  it('Should validate an array of any', () => {
    const T = Type.Array(Type.Any())
    Ok(T, [0, true, 'hello', {}])
  })
  it('Should not validate varying array when item is number', () => {
    const T = Type.Array(Type.Number())
    Fail(T, [1, 2, 3, 'hello'])
  })
  it('Should validate for an array of unions', () => {
    const T = Type.Array(Type.Union([Type.Number(), Type.String()]))
    Ok(T, [1, 'hello', 3, 'world'])
  })
  it('Should not validate for an array of unions where item is not in union.', () => {
    const T = Type.Array(Type.Union([Type.Number(), Type.String()]))
    Fail(T, [1, 'hello', 3, 'world', true])
  })
  it('Should validate for an empty array', () => {
    const T = Type.Array(Type.Union([Type.Number(), Type.String()]))
    Ok(T, [])
  })
  it('Should validate for an array of intersection types', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.String() })
    const C = Type.Intersect([A, B])
    const T = Type.Array(C)
    Ok(T, [
      { a: 'hello', b: 'hello' },
      { a: 'hello', b: 'hello' },
      { a: 'hello', b: 'hello' },
    ])
  })
  it('Should not validate for an array of composite types when passing additionalProperties false', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.String() })
    const C = Type.Composite([A, B], { additionalProperties: false })
    const T = Type.Array(C)
    Fail(T, [
      { a: 'hello', b: 'hello' },
      { a: 'hello', b: 'hello' },
      { a: 'hello', b: 'hello', c: 'additional' },
    ])
  })
  it('Should validate an array of tuples', () => {
    const A = Type.String()
    const B = Type.Number()
    const C = Type.Tuple([A, B])
    const T = Type.Array(C)
    Ok(T, [
      ['hello', 1],
      ['hello', 1],
      ['hello', 1],
    ])
  })
  it('Should not validate an array of tuples when tuple values are incorrect', () => {
    const A = Type.String()
    const B = Type.Number()
    const C = Type.Tuple([A, B])
    const T = Type.Array(C)
    Fail(T, [
      [1, 'hello'],
      [1, 'hello'],
      [1, 'hello'],
    ])
  })
  it('Should not validate array with failed minItems', () => {
    const T = Type.Array(Type.Number(), { minItems: 3 })
    Fail(T, [0, 1])
  })
  it('Should not validate array with failed maxItems', () => {
    const T = Type.Array(Type.Number(), { maxItems: 3 })
    Fail(T, [0, 1, 2, 3])
  })
  // ---------------------------------------------------------
  // Unique Items
  // ---------------------------------------------------------
  it('Should validate array with uniqueItems when items are distinct objects', () => {
    const T = Type.Array(Type.Object({ x: Type.Number(), y: Type.Number() }), { uniqueItems: true })
    Ok(T, [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ])
  })
  it('Should not validate array with uniqueItems when items are not distinct objects', () => {
    const T = Type.Array(Type.Object({ x: Type.Number(), y: Type.Number() }), { uniqueItems: true })
    Fail(T, [
      { x: 1, y: 0 },
      { x: 1, y: 0 },
    ])
  })
  it('Should not validate array with non uniqueItems', () => {
    const T = Type.Array(Type.Number(), { uniqueItems: true })
    Fail(T, [0, 0])
  })
  // ---------------------------------------------------------
  // Contains
  // ---------------------------------------------------------
  it('Should validate for contains', () => {
    const T = Type.Array(Type.Number(), { contains: Type.Literal(1) })
    Ok(T, [1])
    Ok(T, [1, 2])
    Fail(T, [])
    Fail(T, [2])
  })
  it('Should validate for minContains', () => {
    const T = Type.Array(Type.Number(), { contains: Type.Literal(1), minContains: 3 })
    Ok(T, [1, 1, 1, 2])
    Ok(T, [2, 1, 1, 1, 2])
    Ok(T, [1, 1, 1])
    Fail(T, [])
    Fail(T, [1, 1])
    Fail(T, [2])
  })
  it('Should validate for maxContains', () => {
    const T = Type.Array(Type.Number(), { contains: Type.Literal(1), maxContains: 3 })
    Ok(T, [1, 1, 1])
    Ok(T, [1, 1])
    Ok(T, [2, 2, 2, 2, 1, 1, 1])
    Fail(T, [1, 1, 1, 1])
  })
  it('Should validate for minContains and maxContains', () => {
    const T = Type.Array(Type.Number(), { contains: Type.Literal(1), minContains: 3, maxContains: 5 })
    Fail(T, [1, 1])
    Ok(T, [1, 1, 1])
    Ok(T, [1, 1, 1, 1])
    Ok(T, [1, 1, 1, 1, 1])
    Fail(T, [1, 1, 1, 1, 1, 1])
  })
  it('Should not validate minContains or maxContains when contains is unspecified', () => {
    const T = Type.Array(Type.Number(), { minContains: 3, maxContains: 5 })
    Fail(T, [1, 1])
    Fail(T, [1, 1, 1])
    Fail(T, [1, 1, 1, 1])
    Fail(T, [1, 1, 1, 1, 1])
    Fail(T, [1, 1, 1, 1, 1, 1])
  })
  it('Should produce illogical schema when contains is not sub type of items', () => {
    const T = Type.Array(Type.Number(), { contains: Type.String(), minContains: 3, maxContains: 5 })
    Fail(T, [1, 1])
    Fail(T, [1, 1, 1])
    Fail(T, [1, 1, 1, 1])
    Fail(T, [1, 1, 1, 1, 1])
    Fail(T, [1, 1, 1, 1, 1, 1])
  })
})
