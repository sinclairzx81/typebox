import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Record')

Test('Should Convert 1', () => {
  const T = Type.Record(Type.String(), Type.Number())
  const R = Value.Convert(T, { x: '42', y: '24', z: 'hello' })
  Assert.IsEqual(R, { x: 42, y: 24, z: 'hello' })
})
// ----------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/930
// ----------------------------------------------------------------
Test('Should Convert 2', () => {
  const T = Type.Union([Type.Null(), Type.Record(Type.Number(), Type.Any())])
  const R = Value.Convert(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Convert 3', () => {
  const T = Type.Union([Type.Record(Type.Number(), Type.Any()), Type.Null()])
  const R = Value.Convert(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Convert 4', () => {
  const T = Type.Union([Type.Null(), Type.Record(Type.Number(), Type.Any())])
  const R = Value.Convert(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Convert 5', () => {
  const T = Type.Union([Type.Record(Type.Number(), Type.Any()), Type.Null()])
  const R = Value.Convert(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Convert 6', () => {
  const T = Type.Union([Type.Null(), Type.Record(Type.Number(), Type.Any())])
  const R = Value.Convert(T, 'NULL')
  Assert.IsEqual(R, null)
})
Test('Should Convert 7', () => {
  const T = Type.Union([Type.Record(Type.Number(), Type.Any()), Type.Null()])
  const R = Value.Convert(T, 'NULL')
  Assert.IsEqual(R, null)
})
Test('Should Convert 8', () => {
  const T = Type.Record(Type.Number(), Type.Number(), {
    additionalProperties: Type.Null()
  })
  const R = Value.Convert(T, { '0': '1', x: 0 })
  Assert.IsEqual(R, { '0': 1, x: null })
})
