import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/BigInt', () => {
  it('Should convert bitint from string 1', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, '1')
    Assert.deepEqual(R, BigInt(1))
  })
  it('Should convert bigint from string 2', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, '3.14')
    Assert.deepEqual(R, BigInt(3))
  })
  it('Should convert bitint from string 3', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, 'true')
    Assert.deepEqual(R, BigInt(1))
  })
  it('Should convert bigint from string 4', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, 'false')
    Assert.deepEqual(R, BigInt(0))
  })
  it('Should convert bitint from number 1', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, 1)
    Assert.deepEqual(R, BigInt(1))
  })
  it('Should convert bigint from number 2', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, 3.14)
    Assert.deepEqual(R, BigInt(3))
  })
  it('Should convert bitint from boolean 1', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, true)
    Assert.deepEqual(R, BigInt(1))
  })
  it('Should convert bigint from boolean 2', () => {
    const T = Type.BigInt()
    const R = Value.Convert(T, false)
    Assert.deepEqual(R, BigInt(0))
  })
})
