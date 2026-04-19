import { Assert } from 'test'
import System from 'typebox/system'
import Value from 'typebox/value'
import Type from 'typebox'

const Test = Assert.Context('Value.Parse')

// ------------------------------------------------------------------
// Default Parse
// ----------------------------------------------------------------
Test('Should Parse Context 0', () => {
  const T = Type.Number()
  const output = Value.Parse({ T }, Type.Ref('T'), 1)
  Assert.IsEqual(output, 1)
})
// ------------------------------------------------------------------
// Default Parse
// ------------------------------------------------------------------
Test('Should Parse Default 0', () => {
  const T = Type.Number()
  const output = Value.Parse(T, 1)
  Assert.IsEqual(output, 1)
})
Test('Should Parse Default 1', () => {
  const T = Type.Number()
  Assert.Throws(() => Value.Parse(T, '1'))
})
