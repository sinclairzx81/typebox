import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/ArrayMaxContainsItems', () => {
  const T = Type.Array(Type.Any(), { contains: Type.Literal(1), maxContains: 4 })
  it('Should pass 0', () => {
    const R = Resolve(T, [1, 1, 1, 1])
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, null)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.Array)
  })
  it('Should pass 2', () => {
    const R = Resolve(T, [1, 1, 1, 1, 1])
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.ArrayMaxContains)
  })
  it('Should pass 3', () => {
    const R = Resolve(T, [])
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.ArrayContains)
  })
  it('Should pass 4', () => {
    const R = Resolve(T, [1, 2, 3, 4])
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 5', () => {
    const R = Resolve(T, [2, 3, 4])
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.ArrayContains)
  })
})
