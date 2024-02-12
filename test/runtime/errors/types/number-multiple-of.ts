import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/NumberMultipleOf', () => {
  const T = Type.Number({ multipleOf: 2 })
  it('Should pass 0', () => {
    const R = Resolve(T, 0)
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, 1)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.NumberMultipleOf)
  })
  const T2 = Type.Number({ multipleOf: 0.1 })
  it('Should pass 2', () => {
    const R = Resolve(T2, 0)
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 3', () => {
    const R = Resolve(T2, 1)
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 4', () => {
    const R = Resolve(T2, 1.1)
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 5', () => {
    const R = Resolve(T2, 1.15)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.NumberMultipleOf)
  })
})
