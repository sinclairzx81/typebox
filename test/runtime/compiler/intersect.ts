import { Type, Static } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/compiler/Intersect', () => {
  it('Should intersect two objects', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const T = Type.Intersect([A, B], { additionalProperties: false })
    ok(T, { a: 'hello', b: 42 })
  })

  it('Should intersect with partial', () => {
    const A = Type.Partial(Type.Object({ a: Type.Number() }))
    const B = Type.Partial(Type.Object({ b: Type.Number() }))
    const P = Type.Intersect([A, B], { additionalProperties: false })
    ok(P, { a: 1, b: 2 })
    // ok(P, { a: 1 })
    // ok(P, { b: 1 })
    // ok(P, {})
    // fail(P, { c: 1 })
  })

  it('Should intersect with overlapping same type', () => {
    const A = Type.Object({ a: Type.Number() })
    const B = Type.Object({ a: Type.Number() })
    const P = Type.Intersect([A, B])
    ok(P, { a: 1 })
    fail(P, { a: 'hello' })
    fail(P, {})
  })

  it('Should intersect with overlapping varying type', () => {
    const A = Type.Object({ a: Type.Number() })
    const B = Type.Object({ a: Type.String() })
    const T = Type.Intersect([A, B])
    ok(T, { a: 1 })
    ok(T, { a: 'hello' })
    fail(T, {})
  })

  it('Should intersect with deeply nest overlapping varying type', () => {
    const A = Type.Object({ a: Type.Number() })
    const B = Type.Object({ a: Type.String() })
    const C = Type.Object({ a: Type.Boolean() })
    const D = Type.Object({ a: Type.Null() })
    const T = Type.Intersect([A, B, C, D])
    ok(T, { a: 1 })
    ok(T, { a: 'hello' })
    ok(T, { a: false })
    ok(T, { a: null })
    fail(T, { a: [] })
    fail(T, {})
  })

  it('Should pick from intersected type', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const C = Type.Object({ z: Type.Number() })
    const T = Type.Intersect([A, B, C])
    const P = Type.Pick(T, ['x', 'y'], { additionalProperties: false })
    ok(P, { x: 1, y: 1 })
    fail(P, { x: 1, y: 1, z: 1 })
  })

  it('Should omit from intersected type', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const C = Type.Object({ z: Type.Number() })
    const T = Type.Intersect([A, B, C])
    const P = Type.Omit(T, ['z'], { additionalProperties: false })
    ok(P, { x: 1, y: 1 })
    fail(P, { x: 1, y: 1, z: 1 })
  })

  it('Should intersect nested object properties', () => {
    const A = Type.Object({ x: Type.Object({ x: Type.Number() }) })
    const B = Type.Object({ x: Type.Object({ x: Type.String() }) })
    const T = Type.Intersect([A, B])
    ok(T, { x: { x: 1 } })
    ok(T, { x: { x: 'hello' } })
    fail(T, { x: { x: false } })
  })
})
