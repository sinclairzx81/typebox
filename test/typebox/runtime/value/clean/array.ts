import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Array')

Test('Should Clean 1', () => {
  const T = Type.Array(Type.Null())
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})

Test('Should Clean 2', () => {
  const T = Type.Array(
    Type.Object({
      x: Type.Number(),
      y: Type.Number()
    })
  )
  const R = Value.Clean(T, [undefined, null, { x: 1 }, { x: 1, y: 2 }, { x: 1, y: 2, z: 3 }])
  Assert.IsEqual(R, [undefined, null, { x: 1 }, { x: 1, y: 2 }, { x: 1, y: 2 }])
})
