import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/ObjectRequiredProperty', () => {
  const T = Type.Object({ x: Type.Number(), y: Type.Number() })
  it('Should pass 0', () => {
    const R = Resolve(T, { x: 1, y: 2 })
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, { x: 1 })
    Assert.IsEqual(R.length, 2)
    Assert.IsEqual(R[0].type, ValueErrorType.ObjectRequiredProperty)
    Assert.IsEqual(R[0].path, '/y')
    Assert.IsEqual(R[0].value, undefined)
    Assert.IsEqual(R[1].type, ValueErrorType.Number)
    Assert.IsEqual(R[1].path, '/y')
    Assert.IsEqual(R[1].value, undefined)
  })
})
