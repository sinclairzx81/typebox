import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/BigIntMultipleOf', () => {
  const T = Type.BigInt({ multipleOf: 2n })
  it('Should pass 0', () => {
    const R = Resolve(T, 0n)
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, 1n)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.BigIntMultipleOf)
  })
})
