import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Never')

Test('Should Clean 1', () => {
  const T = Type.Never()
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
