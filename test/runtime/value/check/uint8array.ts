import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Uint8Array', () => {
  it('Should pass Uint8Array', () => {
    const T = Type.Uint8Array()
    const value = new Uint8Array(4)
    const result = Value.Check(T, value)
    Assert.IsEqual(result, true)
  })

  it('Should fail Uint8Array', () => {
    const T = Type.Uint8Array()
    const value = [0, 1, 2, 3]
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })

  it('Should fail Uint8Array with undefined', () => {
    const T = Type.Uint8Array()
    const value = undefined
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })

  it('Should fail Uint8Array with null', () => {
    const T = Type.Uint8Array()
    const value = null
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
})
