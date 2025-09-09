import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Ref')

Test('Should Convert 1', () => {
  const S = Type.Number()
  const T = Type.Ref('S')
  const R = Value.Convert({ S }, T, '12345')
  Assert.IsEqual(R, 12345)
})
