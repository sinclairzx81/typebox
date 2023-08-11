import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
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
  })
})
