import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Intersect', () => {
  it('A & B', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const T = Type.Intersect([A, B])
    ok(T, {a: 'hello', b: 42 })
    fail(T, {a: 'hello' })
    fail(T, {b: 42 })
  })

  it('A & B & C', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const C = Type.Object({ c: Type.Boolean() })
    const T = Type.Intersect([A, B, C])
    
    ok(T, {a: 'hello', b: 42, c: true })
    fail(T, {a: 'hello' })
    fail(T, {b: 42 })
    fail(T, {c: true })
  })

  describe('Without Unevaluated Properties', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const C = Type.Object({ c: Type.Boolean() })
    const T = Type.Intersect([A, B, C])
    ok(T, {a: 'hello', b: 42, c: true, d: [] })
    fail(T, {a: 'hello' })
    fail(T, {b: 42 })
    fail(T, {c: true })
  })

  describe('With Unevaluated Properties', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const C = Type.Object({ c: Type.Boolean() })
    const T = Type.Intersect([A, B, C], { unevaluatedProperties: false })
    ok(T, {a: 'hello', b: 42, c: true })
    fail(T, {a: 'hello', b: 42, c: true, d: [] })
    fail(T, {a: 'hello' })
    fail(T, {b: 42 })
    fail(T, {c: true })
  })
  
  describe('Intersect Object and Record', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Record(Type.String())
    const T = Type.Intersect([A, B])
    ok(T, { a: '1', b: '1' })   // b is additional and of type string
    ok(T, { a: '1' })           // b is optional
    fail(T, { a: '1', b: 1 })   // but b must be a string.
  })
})
