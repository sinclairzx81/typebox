import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Cyclic')

Test('Should Clean 1', () => {
  const T = Type.Cyclic({
    A: Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }),
    B: Type.Ref('A'),
    C: Type.Ref('B')
  }, 'C')

  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 2', () => {
  const T = Type.Cyclic({
    A: Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }),
    B: Type.Ref('A'),
    C: Type.Ref('B')
  }, 'C')

  const R = Value.Clean(T, { x: 1, y: 2, z: 3 })
  Assert.IsEqual(R, { x: 1, y: 2 })
})
