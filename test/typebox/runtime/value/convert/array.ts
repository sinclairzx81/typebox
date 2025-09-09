import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Array')

Test('Should Convert 1', () => {
  const T = Type.Array(Type.Number())
  const R = Value.Convert(T, [1, 3.14, '1', '3.14', true, false, 'true', 'false', 'hello'])
  Assert.IsEqual(R, [1, 3.14, 1, 3.14, 1, 0, 1, 0, 'hello'])
})
Test('Should Convert 2', () => {
  const T = Type.Array(Type.Boolean())
  const R = Value.Convert(T, [1, 3.14, '1', '3.14', true, false, 'true', 'false', 'hello'])
  Assert.IsEqual(R, [true, 3.14, true, '3.14', true, false, true, false, 'hello'])
})
Test('Should Convert 3', () => {
  const T = Type.Array(Type.String())
  const R = Value.Convert(T, [1, 3.14, '1', '3.14', true, false, 'true', 'false', 'hello'])
  Assert.IsEqual(R, ['1', '3.14', '1', '3.14', 'true', 'false', 'true', 'false', 'hello'])
})
// ------------------------------------------------------------------
// Deprecated support for Array coercion
// ------------------------------------------------------------------
Test('Should Convert 4', () => {
  const T = Type.Array(Type.Number())
  const R = Value.Convert(T, '1')
  Assert.IsEqual(R, '1')
})
