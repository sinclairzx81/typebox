import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/BigIntMaximum', () => {
  const T = Type.BigInt({ maximum: 4n })
  it('Should pass 0', () => {
    const R = Resolve(T, 0n)
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, 5n)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.BigIntMaximum)
  })
})
