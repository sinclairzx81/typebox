import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.KeyOf')

Test('Should Clean 1', () => {
  const T = Type.KeyOf(Type.Object({ x: Type.Number(), y: Type.Number() }))
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
