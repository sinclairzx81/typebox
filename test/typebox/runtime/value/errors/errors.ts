import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Errors')

// ------------------------------------------------------------------
// Basic
// ------------------------------------------------------------------
Test('Should Errors 1', () => {
  const R = Value.Errors(Type.String(), 1)
  Assert.IsTrue(R.length > 0)
})
Test('Should Errors 2', () => {
  const T = Type.String()
  const R = Value.Errors({ T }, Type.Ref('T'), 1)
  Assert.IsTrue(R.length > 0)
})
// ------------------------------------------------------------------
// Refine
// ------------------------------------------------------------------
Test('Should Errors 3', () => {
  const T = Type.Refine({}, (value) => value instanceof Date, () => 'Not a date')
  const R = Value.Errors(T, {})
  Assert.IsTrue(R.length > 0)
  Assert.IsEqual(R[0].message, 'Not a date')
})
