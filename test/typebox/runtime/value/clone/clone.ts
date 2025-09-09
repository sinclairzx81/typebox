import { Value } from 'typebox/value'
import { Assert } from 'test'

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
