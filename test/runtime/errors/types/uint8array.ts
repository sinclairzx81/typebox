import { Type, FormatRegistry } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/Uint8Array', () => {
  const T = Type.Uint8Array()
  it('Should pass 0', () => {
    const R = Resolve(T, new Uint8Array(4))
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, null)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.Uint8Array)
  })
})
