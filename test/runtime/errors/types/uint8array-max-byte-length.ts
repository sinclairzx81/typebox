import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/Uint8ArrayMaxByteLength', () => {
  const T = Type.Uint8Array({ maxByteLength: 4 })
  it('Should pass 0', () => {
    const R = Resolve(T, new Uint8Array(4))
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, new Uint8Array(5))
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.Uint8ArrayMaxByteLength)
  })
})
