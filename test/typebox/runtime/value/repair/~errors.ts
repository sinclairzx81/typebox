import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Errors')

// ------------------------------------------------------------------
// Unsupported
// ------------------------------------------------------------------
Test('Should Errors 1', () => {
  const T = Type.Any()
  Assert.Throws(() => Value.Repair(T, new Map()))
})
