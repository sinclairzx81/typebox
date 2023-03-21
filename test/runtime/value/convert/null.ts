import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Null', () => {
  const T = Type.Null()
  it('Should convert from string 1', () => {
    const R = Value.Convert(T, 'null')
    Assert.deepEqual(R, null)
  })
  it('Should convert from string 2', () => {
    const R = Value.Convert(T, 'NULL')
    Assert.deepEqual(R, null)
  })
  it('Should convert from string 3', () => {
    const R = Value.Convert(T, 'nil')
    Assert.deepEqual(R, 'nil')
  })
})
