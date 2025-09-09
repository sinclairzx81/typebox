import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Enum')

Test('Should Clean 1', () => {
  const T = Type.Enum({ x: 1, y: 2 })
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
