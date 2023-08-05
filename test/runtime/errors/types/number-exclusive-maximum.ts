import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/NumberExclusiveMaximum', () => {
  const T = Type.Number({ exclusiveMaximum: 4 })
  it('Should pass 0', () => {
    const R = Resolve(T, 0)
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, 4)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.NumberExclusiveMaximum)
  })
})
