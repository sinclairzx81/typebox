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
Test('Should Convert 4', () => {
  const T = Type.Tuple([Type.Number(), Type.Number()])
  const R = Value.Convert(T, 'not an array')
  Assert.IsEqual(R, 'not an array')
})
Test('Should Convert 5', () => {
  const T = Type.Tuple([Type.Number(), Type.Number()])
  const R = Value.Convert(T, 42)
  Assert.IsEqual(R, 42)
})
Test('Should Convert 6', () => {
  const T = Type.Tuple([Type.Number(), Type.Number()])
  const R = Value.Convert(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Convert 7', () => {
  const T = Type.Tuple([Type.Number(), Type.Number()])
  const R = Value.Convert(T, { 0: '1', 1: '2' })
  Assert.IsEqual(R, { 0: '1', 1: '2' })
})
