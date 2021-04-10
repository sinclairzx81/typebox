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

  describe('Additional Properties', () => {
    const A = Type.Object({
      a: Type.String(),
      b: Type.String(),
    })
    const B = Type.Object({
      c: Type.String(),
    })
    const T = Type.Intersect([A, B])
    
    ok(T, { a: '1', b: '2', c: '3' })
    fail(T, { a: '1', b: '2' })
    fail(T, { a: '1', b: '2', c: '3', d: '4' })
  })

  describe('Duplicate Required', () => {
    const A = Type.Object({
      a: Type.String(),
    })
    const B = Type.Object({
      a: Type.String(),
      b: Type.String()
    })
    const T = Type.Intersect([A, B])

    ok(T, { a: "1", b: "2" })
    fail(T, { a: "1" })
    fail(T, { a: "1", b: "2", c: "3" })
  })
})
