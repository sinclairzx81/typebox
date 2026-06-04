import { Value } from 'typebox/value'
import { Assert } from 'test'
import { Type } from 'typebox'

const Test = Assert.Context('Value.Clone')

Test('Should Clone 1', () => {
  const R = Value.Clone(1)
  Assert.IsEqual(R, 1)
})
Test('Should Clone 2', () => {
  const R = Value.Clone('hello')
  Assert.IsEqual(R, 'hello')
})
Test('Should Clone 3', () => {
  const R = Value.Clone(true)
  Assert.IsEqual(R, true)
})
Test('Should Clone 4', () => {
  const R = Value.Clone(undefined)
  Assert.IsEqual(R, undefined)
})
Test('Should Clone 5', () => {
  const R = Value.Clone(null)
  Assert.IsEqual(R, null)
})
Test('Should Clone 6', () => {
  const R = Value.Clone([1, 2, 3, 4])
  Assert.IsEqual(R, [1, 2, 3, 4])
})
Test('Should Clone 7', () => {
  const R = Value.Clone(new Uint8Array([1, 2, 3, 4]))
  Assert.IsEqual(R, new Uint8Array([1, 2, 3, 4]))
})
Test('Should Clone 8', () => {
  const A = new Map(new Map([['a', 1]]))
  const B = Value.Clone(A)
  const R1 = [...A.entries()]
  const R2 = [...B.entries()]
  Assert.IsEqual(R1, R2)
})
Test('Should Clone 9', () => {
  const A = new Set([1, 2, 3])
  const B = Value.Clone(A)
  const R1 = [...A.entries()]
  const R2 = [...B.entries()]
  Assert.IsEqual(R1, R2)
})
Test('Should Clone 10', () => {
  const S = Symbol('S')
  const A = { [S]: 1 }
  const B = Value.Clone(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Deep Clone GlobalThis.Map
// ------------------------------------------------------------------
Test('Should Clone 11', () => {
  const X = { x: 1 }
  const A = new Map([['x', X]])
  const B = Value.Clone(A)
  const _ = [...B.values()][0].x = 2
  Assert.IsEqual(X, { x: 1 })
})
// ------------------------------------------------------------------
// Deep Clone GlobalThis.Set
// ------------------------------------------------------------------
Test('Should Clone 11', () => {
  const X = { x: 1 }
  const A = new Set([X])
  const B = Value.Clone(A)
  const _ = [...B.values()][0].x = 2
  Assert.IsEqual(X, { x: 1 })
})
// ------------------------------------------------------------------
// ClassInstances: No Clone
// ------------------------------------------------------------------
Test('Should Clone 12', () => {
  const A = new Date()
  const B = Value.Clone(A)
  Assert.IsTrue(A === B)
})
// ----------------------------------------------------------------
// Pollution Guards: Ensure No Unsafe Property is Cloned
//
// https://github.com/sinclairzx81/typebox/pull/1593
// ----------------------------------------------------------------
Test('Should Clone 13', () => {
  const A = { value: 1, constructor: 2 }
  const B = Value.Clone(A)
  Assert.IsEqual(B, { value: 1 })
})
Test('Should Clone 14', () => {
  const A = { value: 1, prototype: 2 }
  const B = Value.Clone(A)
  Assert.IsEqual(B, { value: 1 })
})
Test('Should Clone 15', () => {
  const A = { value: 1 }
  Object.defineProperty(A, '__proto__', { value: 2, enumerable: true })
  const B = Value.Clone(A)
  Assert.IsEqual(B, { value: 1 })
})
// Nested
Test('Should Clone 16', () => {
  const A = { outer: { value: 1, constructor: 2 } }
  const B = Value.Clone(A)
  Assert.IsEqual(B, { outer: { value: 1 } })
})
Test('Should Clone 17', () => {
  const A = { outer: { value: 1, prototype: 2 } }
  const B = Value.Clone(A)
  Assert.IsEqual(B, { outer: { value: 1 } })
})
Test('Should Clone 18', () => {
  const A = { outer: { value: 1 } }
  Object.defineProperty(A.outer, '__proto__', { value: 2, enumerable: true })
  const B = Value.Clone(A)
  Assert.IsEqual(B, { outer: { value: 1 } })
})
// ------------------------------------------------------------------
// Type Instance
// ------------------------------------------------------------------
Test('Should Clone 19', () => {
  const A = Type.String()
  const B = Value.Clone(A)

  Assert.HasPropertyKey(B, '~kind')
  Assert.HasPropertyKey(B, 'type')
  Assert.IsEqual(B.type, 'string')

  const isEnumerableA = Object.prototype.propertyIsEnumerable.call(A, '~kind')
  const isEnumerableB = Object.prototype.propertyIsEnumerable.call(B, '~kind')
  Assert.IsEqual(isEnumerableA, isEnumerableB)
})
