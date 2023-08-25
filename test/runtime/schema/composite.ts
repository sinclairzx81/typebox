import { Type } from '@sinclair/typebox'
import { Assert } from '../assert'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Composite', () => {
  it('Should compose two objects', () => {
    const A = Type.Object({ a: Type.String() })
    const B = Type.Object({ b: Type.Number() })
    const T = Type.Composite([A, B], { additionalProperties: false })
    Ok(T, { a: 'hello', b: 42 })
  })
  it('Should compose with partial', () => {
    const A = Type.Partial(Type.Object({ a: Type.Number() }))
    const B = Type.Partial(Type.Object({ b: Type.Number() }))
    const P = Type.Composite([A, B], { additionalProperties: false })
    Ok(P, { a: 1, b: 2 })
    Ok(P, { a: 1 })
    Ok(P, { b: 1 })
    Ok(P, {})
    Fail(P, { a: 1, b: 2, c: 3 })
    Fail(P, { c: 1 })
  })
  it('Should compose with overlapping same type', () => {
    const A = Type.Object({ a: Type.Number() })
    const B = Type.Object({ a: Type.Number() })
    const P = Type.Composite([A, B])
    Ok(P, { a: 1 })
    Fail(P, { a: '1' })
  })
  it('Should not compose with overlapping varying type', () => {
    const A = Type.Object({ a: Type.Number() })
    const B = Type.Object({ a: Type.String() })
    const T = Type.Composite([A, B])
    Fail(T, { a: 1 })
    Fail(T, { a: 'hello' })
    Fail(T, {})
  })
  it('Should compose with deeply nest overlapping varying type', () => {
    const A = Type.Object({ a: Type.Number() })
    const B = Type.Object({ b: Type.String() })
    const C = Type.Object({ c: Type.Boolean() })
    const D = Type.Object({ d: Type.Null() })
    const T = Type.Composite([A, B, C, D])
    Ok(T, { a: 1, b: 'hello', c: true, d: null })
  })
  it('Should not compose with deeply nest overlapping varying type', () => {
    const A = Type.Object({ a: Type.Number() })
    const B = Type.Object({ a: Type.String() })
    const C = Type.Object({ a: Type.Boolean() })
    const D = Type.Object({ a: Type.Null() })
    const T = Type.Composite([A, B, C, D])
    Fail(T, { a: 1 })
    Fail(T, { a: 'hello' })
    Fail(T, { a: false })
    Fail(T, { a: null })
    Fail(T, { a: [] })
    Fail(T, {})
  })
  it('Should pick from composited type', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const C = Type.Object({ z: Type.Number() })
    const T = Type.Composite([A, B, C])
    const P = Type.Pick(T, ['x', 'y'], { additionalProperties: false })
    Ok(P, { x: 1, y: 1 })
    Fail(P, { x: 1, y: 1, z: 1 })
  })
  it('Should omit from composited type', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const C = Type.Object({ z: Type.Number() })
    const T = Type.Composite([A, B, C])
    const P = Type.Omit(T, ['z'], { additionalProperties: false })
    Ok(P, { x: 1, y: 1 })
    Fail(P, { x: 1, y: 1, z: 1 })
  })
  it('Should compose nested object properties', () => {
    const A = Type.Object({ x: Type.Object({ x: Type.Number() }) })
    const B = Type.Object({ y: Type.Object({ x: Type.String() }) })
    const T = Type.Composite([A, B])
    Ok(T, { x: { x: 1 }, y: { x: '' } })
    Fail(T, { x: { x: '1' }, y: { x: '' } })
    Fail(T, { x: { x: 1 }, y: { x: 1 } })
  })
  // todo: move to composition / type guard spec
  it('Should compose and produce the same schema', () => {
    const T = Type.Object({
      field: Type.Optional(Type.String()),
    })
    const A = Type.Composite([T])
    const B = Type.Composite([T])
    Assert.IsEqual(A, B)
  })
})
