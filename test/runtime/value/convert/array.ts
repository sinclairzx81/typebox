import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Array', () => {
  it('Should convert array of number', () => {
    const T = Type.Array(Type.Number())
    const R = Value.Convert(T, [1, 3.14, '1', '3.14', true, false, 'true', 'false', 'hello'])
    Assert.isEqual(R, [1, 3.14, 1, 3.14, 1, 0, 1, 0, 'hello'])
  })
  it('Should convert array of boolean', () => {
    const T = Type.Array(Type.Boolean())
    const R = Value.Convert(T, [1, 3.14, '1', '3.14', true, false, 'true', 'false', 'hello'])
    Assert.isEqual(R, [true, 3.14, true, '3.14', true, false, true, false, 'hello'])
  })
  it('Should convert array of string', () => {
    const T = Type.Array(Type.String())
    const R = Value.Convert(T, [1, 3.14, '1', '3.14', true, false, 'true', 'false', 'hello'])
    Assert.isEqual(R, ['1', '3.14', '1', '3.14', 'true', 'false', 'true', 'false', 'hello'])
  })
  it('Should convert array of date', () => {
    const T = Type.Array(Type.Date())
    const R = Value.Convert(T, [1, '1', true, false, 'true', 'false', 'hello']) as any[]
    Assert.isEqual(R[0].getTime(), 1)
    Assert.isEqual(R[1].getTime(), 1)
    Assert.isEqual(R[2].getTime(), 1)
    Assert.isEqual(R[3].getTime(), 0)
    Assert.isEqual(R[4].getTime(), 1)
    Assert.isEqual(R[5].getTime(), 0)
    Assert.isEqual(R[6], 'hello')
  })
})
