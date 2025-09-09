import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Cyclic')

Test('Should Create 1', () => {
  const T = Type.Cyclic({
    A: Type.Literal(1),
    B: Type.Literal(2),
    C: Type.Object({
      a: Type.Ref('A'),
      b: Type.Ref('B')
    })
  }, 'C')
  Assert.IsEqual(Value.Create(T), {
    a: 1,
    b: 2
  })
})
