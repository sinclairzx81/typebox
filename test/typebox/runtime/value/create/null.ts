import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Null')

Test('Should Create 1', () => {
  const T = Type.Null()
  Assert.IsEqual(Value.Create(T), null)
})

Test('Should Create 2', () => {
  const T = Type.Null({ default: 'hello' })
  Assert.IsEqual(Value.Create(T), 'hello')
})
