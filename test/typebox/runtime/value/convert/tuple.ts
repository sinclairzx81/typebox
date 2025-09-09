import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Tuple')

Test('Should Convert 1', () => {
  const T = Type.Tuple([Type.Number(), Type.Number()])
  const R = Value.Convert(T, ['1', 'true'])
  Assert.IsEqual(R, [1, 1])
})
Test('Should Convert 2', () => {
  const T = Type.Tuple([Type.Number(), Type.Number()])
  const R = Value.Convert(T, ['1'])
  Assert.IsEqual(R, [1])
})
Test('Should Convert 3', () => {
  const T = Type.Tuple([Type.Number(), Type.Number()])
  const R = Value.Convert(T, ['1', '2', '3'])
  Assert.IsEqual(R, [1, 2, '3'])
})
