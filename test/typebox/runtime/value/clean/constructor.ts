import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Constructor')

Test('Should Clean 1', () => {
  const T = Type.Constructor([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })], Type.Object({ z: Type.Number() }))
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
