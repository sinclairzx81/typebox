import { Type } from '@sinclair/typebox'
import { ValueErrorIterator, ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/Union', () => {
  const T = Type.Union([Type.String(), Type.Number()])
  it('Should pass 0', () => {
    const R = Resolve(T, '1')
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, 1)
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 2', () => {
    const R = Resolve(T, true)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.Union)
    Assert.IsInstanceOf(R[0].errors, ValueErrorIterator)
    const variantErrors = [...R[0].errors]
    Assert.IsEqual(variantErrors[0].type, ValueErrorType.String)
    Assert.IsEqual(variantErrors[1].type, ValueErrorType.Number)
  })
})
