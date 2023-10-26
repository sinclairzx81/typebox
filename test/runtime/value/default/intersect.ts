import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/default/Intersect', () => {
  it('Should use default', () => {
    const T = Type.Intersect([Type.Number(), Type.String()], { default: 1 })
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, 1)
  })
  it('Should use value', () => {
    const T = Type.Intersect([Type.Number(), Type.String()], { default: 1 })
    const R = Value.Default(T, null)
    Assert.IsEqual(R, null)
  })
  // ----------------------------------------------------------------
  // Intersected
  // ----------------------------------------------------------------
  it('Should use default intersected 1', () => {
    const A = Type.Object({
      a: Type.Number({ default: 1 }),
    })
    const B = Type.Object({
      b: Type.Number({ default: 2 }),
    })
    const T = Type.Intersect([A, B])
    const R = Value.Default(T, {})
    Assert.IsEqual(R, { a: 1, b: 2 })
  })
  it('Should use default intersected 2', () => {
    const A = Type.Object({
      a: Type.Number(),
    })
    const B = Type.Object({
      b: Type.Number(),
    })
    const T = Type.Intersect([A, B])
    const R = Value.Default(T, {})
    Assert.IsEqual(R, {})
  })
  it('Should use default intersected 3', () => {
    const A = Type.Object({
      a: Type.Number({ default: 1 }),
    })
    const B = Type.Object({
      b: Type.Number({ default: 2 }),
    })
    const T = Type.Intersect([A, B])
    const R = Value.Default(T, { a: 3 })
    Assert.IsEqual(R, { a: 3, b: 2 })
  })
  it('Should use default intersected 4', () => {
    const A = Type.Object({
      a: Type.Number({ default: 1 }),
    })
    const B = Type.Object({
      b: Type.Number({ default: 2 }),
    })
    const T = Type.Intersect([A, B])
    const R = Value.Default(T, { a: 4, b: 5 })
    Assert.IsEqual(R, { a: 4, b: 5 })
  })
  it('Should use default intersected 5', () => {
    const A = Type.Object({
      a: Type.Number({ default: 1 }),
    })
    const B = Type.Number({ default: 2 })
    const T = Type.Intersect([A, B])
    const R = Value.Default(T, {})
    Assert.IsEqual(R, { a: 1 })
  })
  it('Should use default intersected 6', () => {
    const A = Type.Number({ default: 2 })
    const B = Type.Object({
      a: Type.Number({ default: 1 }),
    })
    const T = Type.Intersect([A, B])
    const R = Value.Default(T, {})
    Assert.IsEqual(R, { a: 1 })
  })
  // ----------------------------------------------------------------
  // Intersected Deep
  // ----------------------------------------------------------------
  it('Should use default intersected deep 1', () => {
    const A = Type.Object({ a: Type.Number({ default: 1 }) })
    const B = Type.Object({ b: Type.Number({ default: 2 }) })
    const C = Type.Object({ c: Type.Number({ default: 3 }) })
    const D = Type.Object({ d: Type.Number({ default: 4 }) })
    const T1 = Type.Intersect([A, B])
    const T2 = Type.Intersect([C, D])
    const T = Type.Intersect([T1, T2])
    const R = Value.Default(T, {})
    Assert.IsEqual(R, { a: 1, b: 2, c: 3, d: 4 })
  })
  it('Should use default intersected deep 2', () => {
    const A = Type.Object({ a: Type.Number({}) })
    const B = Type.Object({ b: Type.Number({}) })
    const C = Type.Object({ c: Type.Number({}) })
    const D = Type.Object({ d: Type.Number({}) })
    const T1 = Type.Intersect([A, B])
    const T2 = Type.Intersect([C, D])
    const T = Type.Intersect([T1, T2])
    const R = Value.Default(T, {})
    Assert.IsEqual(R, {})
  })
})
