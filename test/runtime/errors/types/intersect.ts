import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/Intersect', () => {
  const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
  it('Should pass 0', () => {
    const R = Resolve(T, { x: 1, y: 1 })
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, { x: 1 })
    Assert.IsEqual(R.length, 2)
    Assert.IsEqual(R[0].type, ValueErrorType.Intersect)
    Assert.IsEqual(R[1].type, ValueErrorType.ObjectRequiredProperty)
  })
  it('Should pass 2', () => {
    const R = Resolve(T, { y: 1 })
    Assert.IsEqual(R.length, 2)
    Assert.IsEqual(R[0].type, ValueErrorType.Intersect)
    Assert.IsEqual(R[1].type, ValueErrorType.ObjectRequiredProperty)
  })
})
