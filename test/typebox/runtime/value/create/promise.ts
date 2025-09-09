import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Promise')

Test('Should Create 1', async () => {
  const T = Type.Promise(Type.Literal(123))
  Assert.IsEqual(await Value.Create(T), 123)
})
