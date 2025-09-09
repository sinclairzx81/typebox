import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Void')

Test('Should Clean 1', () => {
  const T = Type.Void()
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
