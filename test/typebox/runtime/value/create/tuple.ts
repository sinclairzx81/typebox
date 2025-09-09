import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Tuple')

Test('Should Create 1', () => {
  const T = Type.Tuple([Type.Number(), Type.String()])
  Assert.IsEqual(Value.Create(T), [0, ''])
})

Test('Should Create 2', () => {
  const T = Type.Tuple([Type.Number(), Type.String()], { default: [7, 'hello'] })
  Assert.IsEqual(Value.Create(T), [7, 'hello'])
})

Test('Should Create 3', () => {
  const T = Type.Tuple([Type.Number({ default: 7 }), Type.String({ default: 'hello' })])
  Assert.IsEqual(Value.Create(T), [7, 'hello'])
})

Test('Should Create 4', () => {
  const T = Type.Tuple([Type.Number({ default: 7 }), Type.String({ default: 'hello' })], { default: [32, 'world'] })
  Assert.IsEqual(Value.Create(T), [32, 'world'])
})
