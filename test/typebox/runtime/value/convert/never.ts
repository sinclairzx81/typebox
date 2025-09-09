import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Never')

Test('Should not 1', () => {
  const T = Type.Never()
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, true)
})
Test('Should not 2', () => {
  const T = Type.Never()
  const R = Value.Convert(T, 42)
  Assert.IsEqual(R, 42)
})
Test('Should not 3', () => {
  const T = Type.Never()
  const R = Value.Convert(T, 'true')
  Assert.IsEqual(R, 'true')
})
