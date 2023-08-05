import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/AsyncIterator', () => {
  const T = Type.AsyncIterator(Type.Any())
  it('Should pass 0', () => {
    const R = Resolve(T, (async function* (): any {})())
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, 1)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.AsyncIterator)
  })
})
