import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Object')

Test('Should Convert 1', () => {
  const T = Type.Object({
    x: Type.Number(),
    y: Type.Boolean(),
    z: Type.Boolean()
  })
  const R = Value.Convert(T, { x: '42', y: 'true', z: 'hello' })
  Assert.IsEqual(R, { x: 42, y: true, z: 'hello' })
})
Test('Should Convert 2', () => {
  const T = Type.Object({
    x: Type.Number(),
    y: Type.Boolean()
  })
  const R = Value.Convert(T, { x: '42', y: 'true', z: 'hello' })
  Assert.IsEqual(R, { x: 42, y: true, z: 'hello' })
})
Test('Should Convert 3', () => {
  const T = Type.Object({ x: Type.Number() })
  const R = Value.Convert(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Convert 4', () => {
  const T = Type.Object({ x: Type.Number() }, {
    additionalProperties: Type.Null()
  })
  const R = Value.Convert(T, { x: '1', y: 0 })
  Assert.IsEqual(R, { x: 1, y: null })
})
