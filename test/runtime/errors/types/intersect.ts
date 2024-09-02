import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/Intersect', () => {
  it('Should pass 0', () => {
    const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
    const R = Resolve(T, { x: 1, y: 1 })
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
    const R = Resolve(T, { x: 1 })
    Assert.IsEqual(R.length, 3)
    Assert.IsEqual(R[0].type, ValueErrorType.ObjectRequiredProperty)
    Assert.IsEqual(R[1].type, ValueErrorType.Number)
    Assert.IsEqual(R[2].type, ValueErrorType.Intersect)
  })
  it('Should pass 2', () => {
    const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
    const R = Resolve(T, { y: 1 })
    Assert.IsEqual(R.length, 3)
    Assert.IsEqual(R[0].type, ValueErrorType.ObjectRequiredProperty)
    Assert.IsEqual(R[1].type, ValueErrorType.Number)
    Assert.IsEqual(R[2].type, ValueErrorType.Intersect)
  })
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/887
  // ----------------------------------------------------------------
  it('Should pass 3', () => {
    const A = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
    const B = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ z: Type.Number() })])
    const T = Type.Intersect([A, B])
    const R = Resolve(T, {})
    Assert.IsEqual(R.length, 11)
    Assert.IsEqual(R[0].type, ValueErrorType.ObjectRequiredProperty)
    Assert.IsEqual(R[1].type, ValueErrorType.Number)
    Assert.IsEqual(R[2].type, ValueErrorType.ObjectRequiredProperty)
    Assert.IsEqual(R[3].type, ValueErrorType.Number)
    Assert.IsEqual(R[4].type, ValueErrorType.Intersect)
    Assert.IsEqual(R[5].type, ValueErrorType.ObjectRequiredProperty)
    Assert.IsEqual(R[6].type, ValueErrorType.Number)
    Assert.IsEqual(R[7].type, ValueErrorType.ObjectRequiredProperty)
    Assert.IsEqual(R[8].type, ValueErrorType.Number)
    Assert.IsEqual(R[9].type, ValueErrorType.Intersect)
    Assert.IsEqual(R[10].type, ValueErrorType.Intersect)
  })
})
