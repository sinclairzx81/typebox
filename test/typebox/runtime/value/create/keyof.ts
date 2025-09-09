import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.KeyOf')

Test('Should Create 1', () => {
  const T = Type.KeyOf(
    Type.Object({
      x: Type.Number(),
      y: Type.Number()
    })
  )
  Assert.IsEqual(Value.Create(T), 'x')
})

Test('Should Create 2', () => {
  const T = Type.KeyOf(
    Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }),
    { default: 'y' }
  )
  Assert.IsEqual(Value.Create(T), 'y')
})
