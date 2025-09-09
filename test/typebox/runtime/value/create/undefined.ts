import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Undefined')

Test('Should Create 1', () => {
  const T = Type.Undefined()
  Assert.IsEqual(Value.Create(T), undefined)
})

Test('Should Create 2', () => {
  const T = Type.Undefined({ default: 'hello' })
  Assert.IsEqual(Value.Create(T), 'hello')
})
