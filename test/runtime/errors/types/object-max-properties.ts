import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/ObjectMaxProperties', () => {
  const T = Type.Object({}, { maxProperties: 2 })
  it('Should pass 0', () => {
    const R = Resolve(T, { x: 1, y: 2 })
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, { x: 1, y: 2, z: 3 })
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.ObjectMaxProperties)
  })
})
