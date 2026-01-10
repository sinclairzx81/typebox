import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.TemplateLiteral')

Test('Should Convert 1', () => {
  const T = Type.TemplateLiteral('${1 | 2 | 3}')
  const R0 = Value.Convert(T, 1)
  const R1 = Value.Convert(T, 2)
  const R2 = Value.Convert(T, 3)
  const R3 = Value.Convert(T, 4)
  Assert.IsEqual(R0, '1')
  Assert.IsEqual(R1, '2')
  Assert.IsEqual(R2, '3')
  Assert.IsEqual(R3, 4)
})
// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1510
// ------------------------------------------------------------------
Test('Should Convert 2', () => {
  const T = Type.Object({
    test: Type.TemplateLiteral('${number}${"a"|"b"|"c"}')
  })
  const R0 = Value.Convert(T, { test: '123b' })
  Assert.IsEqual(R0, { test: '123b' })
})
