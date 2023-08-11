import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/Not', () => {
  const T = Type.Not(Type.String())
  it('Should pass 0', () => {
    const R = Resolve(T, true)
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, 'hello')
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.Not)
  })
})
