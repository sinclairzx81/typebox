import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Default.Intersect')

Test('Should Default 1', () => {
  const T = Type.Intersect([Type.Number(), Type.String()], { default: 1 })
  const R = Value.Default(T, undefined)
  Assert.IsEqual(R, 1)
})
Test('Should Default 2', () => {
  const T = Type.Intersect([Type.Number(), Type.String()], { default: 1 })
  const R = Value.Default(T, null)
  Assert.IsEqual(R, null)
})
// ----------------------------------------------------------------
// Intersected
// ----------------------------------------------------------------
Test('Should Default 3', () => {
  const A = Type.Object({
    a: Type.Number({ default: 1 })
  })
  const B = Type.Object({
    b: Type.Number({ default: 2 })
  })
  const T = Type.Intersect([A, B])
  const R = Value.Default(T, {})
  Assert.IsEqual(R, { a: 1, b: 2 })
})
Test('Should Default 4', () => {
  const A = Type.Object({
    a: Type.Number()
  })
  const B = Type.Object({
    b: Type.Number()
  })
  const T = Type.Intersect([A, B])
  const R = Value.Default(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Default 5', () => {
  const A = Type.Object({
    a: Type.Number({ default: 1 })
  })
  const B = Type.Object({
    b: Type.Number({ default: 2 })
  })
  const T = Type.Intersect([A, B])
  const R = Value.Default(T, { a: 3 })
  Assert.IsEqual(R, { a: 3, b: 2 })
})
Test('Should Default 6', () => {
  const A = Type.Object({
    a: Type.Number({ default: 1 })
  })
  const B = Type.Object({
    b: Type.Number({ default: 2 })
  })
  const T = Type.Intersect([A, B])
  const R = Value.Default(T, { a: 4, b: 5 })
  Assert.IsEqual(R, { a: 4, b: 5 })
})
Test('Should Default 7', () => {
  const A = Type.Object({
    a: Type.Number({ default: 1 })
  })
  const B = Type.Number({ default: 2 })
  const T = Type.Intersect([A, B])
  const R = Value.Default(T, {})
  Assert.IsEqual(R, { a: 1 })
})
Test('Should Default 8', () => {
  const A = Type.Number({ default: 2 })
  const B = Type.Object({
    a: Type.Number({ default: 1 })
  })
  const T = Type.Intersect([A, B])
  const R = Value.Default(T, {})
  Assert.IsEqual(R, { a: 1 })
})
// ----------------------------------------------------------------
// Intersected Deep
// ----------------------------------------------------------------
Test('Should Default 9', () => {
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
Test('Should Default 10', () => {
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
