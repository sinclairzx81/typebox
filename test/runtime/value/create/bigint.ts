import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/BigInt', () => {
  it('Should create value', () => {
    const T = Type.BigInt()
    Assert.isEqual(Value.Create(T), BigInt(0))
  })
  it('Should create default', () => {
    const T = Type.BigInt({ default: true })
    Assert.isEqual(Value.Create(T), true)
  })
})
