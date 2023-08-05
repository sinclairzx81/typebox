import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/ArrayMaxItems', () => {
  const T = Type.Array(Type.Any(), { maxItems: 4 })
  it('Should pass 0', () => {
    const R = Resolve(T, [1, 2, 3, 4])
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, null)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.Array)
  })
  it('Should pass 2', () => {
    const R = Resolve(T, [1, 2, 3, 4, 5])
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.ArrayMaxItems)
  })
})
