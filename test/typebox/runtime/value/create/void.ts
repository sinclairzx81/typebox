import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Void')

Test('Should Create 1', () => {
  const T = Type.Void()
  Assert.IsEqual(Value.Create(T), undefined)
})

Test('Should Create 2', () => {
  const T = Type.Void({ default: 'hello' })
  Assert.IsEqual(Value.Create(T), 'hello')
})
