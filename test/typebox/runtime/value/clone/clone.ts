import { Value } from 'typebox/value'
import { Assert } from 'test'

// ------------------------------------------------------------------
// Value.Clone tests have been moved to System.Memory.Clone. We
// keep a few superficial tests here to ensure we can call
// System.Memory.Clone via the Value.Clone interface.
// ------------------------------------------------------------------
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
  const R = Value.Clone({ x: 1 })
  Assert.IsEqual(R, { x: 1 })
})
Test('Should Clone 8', () => {
  const R = Value.Clone({ x: { y: 2 } })
  Assert.IsEqual(R, { x: { y: 2 } })
})
