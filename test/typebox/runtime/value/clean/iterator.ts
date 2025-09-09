import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Iterator')

Test('Should Clean 1', () => {
  const T = Type.Iterator(Type.String())
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
