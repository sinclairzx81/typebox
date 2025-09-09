import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Never')

Test('Should Create 1', () => {
  const T = Type.Never()
  Assert.Throws(() => Value.Create(T))
})
