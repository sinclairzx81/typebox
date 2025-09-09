import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.String')

Test('Should Create 1', () => {
  const T = Type.String()
  Assert.IsEqual(Value.Create(T), '')
})
Test('Should Create 2', () => {
  const T = Type.String({ default: 'hello' })
  Assert.IsEqual(Value.Create(T), 'hello')
})
Test('Should Create 3', () => {
  const T = Type.String({ minLength: 10 })
  const R = Value.Create(T)
  Assert.IsTrue(typeof R === 'string')
  Assert.IsEqual(R.length, 10)
})
Test('Should Create 4', () => {
  const T = Type.String({ pattern: '1' })
  Assert.Throws(() => Value.Create(T))
})
Test('Should Create 5', () => {
  const T = Type.String({ pattern: '1', default: 'hello' })
  const R = Value.Create(T)
  Assert.IsEqual(R, 'hello')
})
Test('Should Create 6', () => {
  const T = Type.String({ format: 'email' })
  Assert.Throws(() => Value.Create(T))
})
Test('Should Create 7', () => {
  const T = Type.String({ format: 'email', default: 'user@domain.com' })
  const R = Value.Create(T)
  Assert.IsEqual(R, 'user@domain.com')
})
