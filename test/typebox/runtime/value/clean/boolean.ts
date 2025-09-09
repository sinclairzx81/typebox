import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Boolean')

Test('Should Clean 1', () => {
  const T = Type.Boolean()
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
