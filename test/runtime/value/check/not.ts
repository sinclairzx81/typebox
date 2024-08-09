import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Not', () => {
  it('Should validate with not number', () => {
    const T = Type.Not(Type.Number())
    Assert.IsEqual(Value.Check(T, 1), false)
    Assert.IsEqual(Value.Check(T, 'A'), true)
  })
  it('Should validate with union left', () => {
    // prettier-ignore
    const T = Type.Not(Type.Union([
            Type.Literal('A'),
            Type.Literal('B'),
            Type.Literal('C')
        ]))
    Assert.IsEqual(Value.Check(T, 'A'), false)
    Assert.IsEqual(Value.Check(T, 'B'), false)
    Assert.IsEqual(Value.Check(T, 'C'), false)
    Assert.IsEqual(Value.Check(T, 'D'), true)
  })
  it('Should validate with union right', () => {
    // prettier-ignore
    const T = Type.Not(Type.Number())
    Assert.IsEqual(Value.Check(T, 1), false)
    Assert.IsEqual(Value.Check(T, 'A'), true)
    Assert.IsEqual(Value.Check(T, true), true)
  })
})
