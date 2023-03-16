import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Tuple', () => {
  it('Should convert from Array 1', () => {
    const T = Type.Tuple([Type.Number(), Type.Number()])
    const R = Value.Convert(T, ['1', 'true'])
    Assert.deepEqual(R, [1, true])
  })
  it('Should convert from Array 2', () => {
    const T = Type.Tuple([Type.Number(), Type.Number()])
    const R = Value.Convert(T, ['1'])
    Assert.deepEqual(R, [1])
  })
  it('Should convert from Array 3', () => {
    const T = Type.Tuple([Type.Number(), Type.Number()])
    const R = Value.Convert(T, ['1', '2', '3'])
    Assert.deepEqual(R, [1, 2, '3'])
  })
})
