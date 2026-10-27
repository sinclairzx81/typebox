import { Deep } from '../../../../../src/system/memory/deep.ts'
import { Assert } from 'test'
import { Type } from 'typebox'

// ------------------------------------------------------------------
// System.Memory.Deep
//
// These tests were originally for Value.Clone, however we have moved
// them into System.Memory tests even though the Deep function is non
// public. In 1.4.0, we revert back to referential schemas, but
// continue to centralize Deep Clone behaviours under System. Note
// that the only consumer of Deep is Value.Clone.
//
// ------------------------------------------------------------------
const Test = Assert.Context('System.Memory.Deep')

Test('Should Deep 1', () => {
  const R = Deep(1)
  Assert.IsEqual(R, 1)
})
Test('Should Deep 2', () => {
  const R = Deep('hello')
  Assert.IsEqual(R, 'hello')
})
Test('Should Deep 3', () => {
  const R = Deep(true)
  Assert.IsEqual(R, true)
})
Test('Should Deep 4', () => {
  const R = Deep(undefined)
  Assert.IsEqual(R, undefined)
})
Test('Should Deep 5', () => {
  const R = Deep(null)
  Assert.IsEqual(R, null)
})
Test('Should Deep 6', () => {
  const R = Deep([1, 2, 3, 4])
  Assert.IsEqual(R, [1, 2, 3, 4])
})
Test('Should Deep 7', () => {
  const R = Deep(new Uint8Array([1, 2, 3, 4]))
  Assert.IsEqual(R, new Uint8Array([1, 2, 3, 4]))
})
Test('Should Deep 8', () => {
  const A = new Map(new Map([['a', 1]]))
  const B = Deep(A)
  const R1 = [...A.entries()]
  const R2 = [...B.entries()]
  Assert.IsEqual(R1, R2)
})
Test('Should Deep 9', () => {
  const A = new Set([1, 2, 3])
  const B = Deep(A)
  const R1 = [...A.entries()]
  const R2 = [...B.entries()]
  Assert.IsEqual(R1, R2)
})
Test('Should Deep 10', () => {
  const S = Symbol('S')
  const A = { [S]: 1 }
  const B = Deep(A)
  Assert.IsEqual(A, B)
})
// ------------------------------------------------------------------
// Deep Clone GlobalThis.Map
// ------------------------------------------------------------------
Test('Should Deep 11', () => {
  const X = { x: 1 }
  const A = new Map([['x', X]])
  const B = Deep(A)
  const _ = [...B.values()][0].x = 2
  Assert.IsEqual(X, { x: 1 })
})
// ------------------------------------------------------------------
// Deep Clone GlobalThis.Set
// ------------------------------------------------------------------
Test('Should Deep 11', () => {
  const X = { x: 1 }
  const A = new Set([X])
  const B = Deep(A)
  const _ = [...B.values()][0].x = 2
  Assert.IsEqual(X, { x: 1 })
})
// ------------------------------------------------------------------
// ClassInstances: No Clone
// ------------------------------------------------------------------
Test('Should Deep 12', () => {
  const A = new Date()
  const B = Deep(A)
  Assert.IsTrue(A === B)
})
// ------------------------------------------------------------------
// Type Instance
// ------------------------------------------------------------------
Test('Should Deep 19', () => {
  const A = Type.String()
  const B = Deep(A)

  Assert.HasPropertyKey(B, '~kind')
  Assert.HasPropertyKey(B, 'type')
  Assert.IsEqual(B.type, 'string')

  const isEnumerableA = Object.prototype.propertyIsEnumerable.call(A, '~kind')
  const isEnumerableB = Object.prototype.propertyIsEnumerable.call(B, '~kind')
  Assert.IsEqual(isEnumerableA, isEnumerableB)
})
Test('Should Deep 20', () => {
  const check = (value: unknown) => value === 'value'
  const error = (_value: unknown) => 'Invalid value'
  const A = Type.Refine(Type.String(), check, error)
  const B = Deep(A)
  Assert.IsTrue(A !== B)
  Assert.IsTrue(A['~refine'] !== B['~refine'])
  Assert.IsTrue(A['~refine'][0] !== B['~refine'][0])
  Assert.IsTrue(A['~refine'][0].check === B['~refine'][0].check)
  Assert.IsTrue(A['~refine'][0].error === B['~refine'][0].error)
})
// ----------------------------------------------------------------
// Preserve Own Keys Without Changing Object Prototypes
//
// https://github.com/sinclairzx81/typebox/pull/1593
// ----------------------------------------------------------------
Test('Should Deep 13', () => {
  const A = { value: 1, constructor: 2 }
  const B = Deep(A)
  Assert.IsEqual(B, A)
})
Test('Should Deep 14', () => {
  const A = { value: 1, prototype: 2 }
  const B = Deep(A)
  Assert.IsEqual(B, A)
})
Test('Should Deep 15', () => {
  const A = { value: 1 }
  Object.defineProperty(A, '__proto__', { value: 2, enumerable: true })
  const B = Deep(A)
  Assert.IsEqual(B, A)
})
// Nested
Test('Should Deep 16', () => {
  const A = { outer: { value: 1, constructor: 2 } }
  const B = Deep(A)
  Assert.IsEqual(B, A)
})
Test('Should Deep 17', () => {
  const A = { outer: { value: 1, prototype: 2 } }
  const B = Deep(A)
  Assert.IsEqual(B, A)
})
Test('Should Deep 18', () => {
  const A = { outer: { value: 1 } }
  Object.defineProperty(A.outer, '__proto__', { value: 2, enumerable: true })
  const B = Deep(A)
  Assert.IsEqual(B, A)
})
// ----------------------------------------------------------------
// RegExp
// ----------------------------------------------------------------
Test('Should Deep 21', () => {
  const A = /xyz/
  const B = Deep(A)
  Assert.IsTrue(A !== B)
  Assert.IsEqual(B.source, A.source)
  Assert.IsEqual(B.flags, A.flags)
})
// ----------------------------------------------------------------
// Schema Objects Preserve Own Prototype-Named Keys
// ----------------------------------------------------------------
Test('Should Deep 22', () => {
  const A: Record<PropertyKey, unknown> = { type: 'string', '~kind': 'String' }
  Object.defineProperty(A, '__proto__', { value: 'unsafe', enumerable: true })
  Object.defineProperty(A, 'constructor', { value: 'unsafe', enumerable: true })
  Object.defineProperty(A, 'prototype', { value: 'unsafe', enumerable: true })
  const B = Deep(A)
  Assert.IsEqual(B.type, 'string')
  Assert.IsEqual(B['~kind'], 'String')
  Assert.IsEqual(B, A)
  Assert.IsEqual(Object.getPrototypeOf(B), Object.prototype)
})
