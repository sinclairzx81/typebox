import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Not', () => {
  it('Should validate with not number', () => {
    const T = Type.Not(Type.Number(), Type.String())
    Assert.isEqual(Value.Check(T, 1), false)
    Assert.isEqual(Value.Check(T, 'A'), true)
  })
  it('Should validate with union left', () => {
    // prettier-ignore
    const T = Type.Not(Type.Union([
            Type.Literal('A'),
            Type.Literal('B'),
            Type.Literal('C')
        ]), Type.String())
    Assert.isEqual(Value.Check(T, 'A'), false)
    Assert.isEqual(Value.Check(T, 'B'), false)
    Assert.isEqual(Value.Check(T, 'C'), false)
    Assert.isEqual(Value.Check(T, 'D'), true)
  })
  it('Should validate with union right', () => {
    // prettier-ignore
    const T = Type.Not(Type.Number(), Type.Union([
            Type.String(),
            Type.Boolean()
        ]))
    Assert.isEqual(Value.Check(T, 1), false)
    Assert.isEqual(Value.Check(T, 'A'), true)
    Assert.isEqual(Value.Check(T, true), true)
  })
})
