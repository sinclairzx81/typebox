import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/ArrayUniqueItems', () => {
  const T = Type.Array(Type.Any(), { uniqueItems: true })
  it('Should pass 0', () => {
    const R = Resolve(T, [1, 2, 3, 4])
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 2', () => {
    const R = Resolve(T, [])
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 3', () => {
    const R = Resolve(T, [1, 1, 3, 4])
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.ArrayUniqueItems)
  })
})
