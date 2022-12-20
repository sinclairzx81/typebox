import { Type, Static } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('type/compiler/Intersect', () => {
  it('Should intersect two objects', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const T = Type.Intersect([A, B], { additionalProperties: false })
    Ok(T, { a: 'hello', b: 42 })
  })

  it('Should intersect with partial', () => {
    const A = Type.Partial(Type.Object({ a: Type.Number() }))
    const B = Type.Partial(Type.Object({ b: Type.Number() }))
    const P = Type.Intersect([A, B], { additionalProperties: false })
    Ok(P, { a: 1, b: 2 })
    // ok(P, { a: 1 })
    // ok(P, { b: 1 })
    // ok(P, {})
    // fail(P, { c: 1 })
  })

  it('Should intersect with overlapping same type', () => {
    const A = Type.Object({ a: Type.Number() })
    const B = Type.Object({ a: Type.Number() })
    const P = Type.Intersect([A, B])
    Ok(P, { a: 1 })
    Fail(P, { a: 'hello' })
    Fail(P, {})
  })

  it('Should intersect with overlapping varying type', () => {
    const A = Type.Object({ a: Type.Number() })
    const B = Type.Object({ a: Type.String() })
    const T = Type.Intersect([A, B])
    Ok(T, { a: 1 })
    Ok(T, { a: 'hello' })
    Fail(T, {})
  })

  it('Should intersect with deeply nest overlapping varying type', () => {
    const A = Type.Object({ a: Type.Number() })
    const B = Type.Object({ a: Type.String() })
    const C = Type.Object({ a: Type.Boolean() })
    const D = Type.Object({ a: Type.Null() })
    const T = Type.Intersect([A, B, C, D])
    Ok(T, { a: 1 })
    Ok(T, { a: 'hello' })
    Ok(T, { a: false })
    Ok(T, { a: null })
    Fail(T, { a: [] })
    Fail(T, {})
  })

  it('Should pick from intersected type', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const C = Type.Object({ z: Type.Number() })
    const T = Type.Intersect([A, B, C])
    const P = Type.Pick(T, ['x', 'y'], { additionalProperties: false })
    Ok(P, { x: 1, y: 1 })
    Fail(P, { x: 1, y: 1, z: 1 })
  })

  it('Should omit from intersected type', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const C = Type.Object({ z: Type.Number() })
    const T = Type.Intersect([A, B, C])
    const P = Type.Omit(T, ['z'], { additionalProperties: false })
    Ok(P, { x: 1, y: 1 })
    Fail(P, { x: 1, y: 1, z: 1 })
  })

  it('Should intersect nested object properties', () => {
    const A = Type.Object({ x: Type.Object({ x: Type.Number() }) })
    const B = Type.Object({ x: Type.Object({ x: Type.String() }) })
    const T = Type.Intersect([A, B])
    Ok(T, { x: { x: 1 } })
    Ok(T, { x: { x: 'hello' } })
    Fail(T, { x: { x: false } })
  })
})
