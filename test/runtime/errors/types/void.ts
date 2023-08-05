import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'
import { TypeSystemPolicy } from '@sinclair/typebox/system'

describe('errors/type/Void', () => {
  const T = Type.Void()
  it('Should pass 0', () => {
    const R = Resolve(T, void 0)
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, undefined)
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 2', () => {
    const R = Resolve(T, void 1)
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 3', () => {
    const R = Resolve(T, null)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.Void)
  })
  it('Should pass 4', () => {
    TypeSystemPolicy.AllowNullVoid = true
    const R = Resolve(T, null)
    Assert.IsEqual(R.length, 0)
    TypeSystemPolicy.AllowNullVoid = false
  })
})
