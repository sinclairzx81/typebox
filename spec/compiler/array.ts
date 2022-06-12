import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/compiler/Array', () => {
  it('Should validate an array of any', () => {
    const T = Type.Array(Type.Any())
    ok(T, [0, true, 'hello', {}])
  })

  it('Should not validate varying array when item is number', () => {
    const T = Type.Array(Type.Number())
    fail(T, [1, 2, 3, 'hello'])
  })

  it('Should validate for an array of unions', () => {
    const T = Type.Array(Type.Union([Type.Number(), Type.String()]))
    ok(T, [1, 'hello', 3, 'world'])
  })

  it('Should not validate for an array of unions where item is not in union.', () => {
    const T = Type.Array(Type.Union([Type.Number(), Type.String()]))
    fail(T, [1, 'hello', 3, 'world', true])
  })

  it('Should validate for an empty array', () => {
    const T = Type.Array(Type.Union([Type.Number(), Type.String()]))
    ok(T, [])
  })

  it('Should validate for an array of intersection types', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.String() })
    const C = Type.Intersect([A, B])
    const T = Type.Array(C)
    ok(T, [
      { a: 'hello', b: 'hello' },
      { a: 'hello', b: 'hello' },
      { a: 'hello', b: 'hello' },
    ])
  })

  it('Should not validate for an array of intersection types when passing additionalProperties false', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.String() })
    const C = Type.Intersect([A, B], { additionalProperties: false })
    const T = Type.Array(C)
    fail(T, [
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
    ok(T, [
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
    fail(T, [
      [1, 'hello'],
      [1, 'hello'],
      [1, 'hello'],
    ])
  })
})
