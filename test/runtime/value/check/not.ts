import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Not', () => {
  it('Should validate with not number', () => {
    const T = Type.Not(Type.Number(), Type.String())
    Assert.equal(Value.Check(T, 1), false)
    Assert.equal(Value.Check(T, 'A'), true)
  })
  it('Should validate with union left', () => {
    // prettier-ignore
    const T = Type.Not(Type.Union([
            Type.Literal('A'),
            Type.Literal('B'),
            Type.Literal('C')
        ]), Type.String())
    Assert.equal(Value.Check(T, 'A'), false)
    Assert.equal(Value.Check(T, 'B'), false)
    Assert.equal(Value.Check(T, 'C'), false)
    Assert.equal(Value.Check(T, 'D'), true)
  })
  it('Should validate with union right', () => {
    // prettier-ignore
    const T = Type.Not(Type.Number(), Type.Union([
            Type.String(),
            Type.Boolean()
        ]))
    Assert.equal(Value.Check(T, 1), false)
    Assert.equal(Value.Check(T, 'A'), true)
    Assert.equal(Value.Check(T, true), true)
  })
  it('Should not validate with symmetric left right', () => {
    // prettier-ignore
    const T = Type.Not(Type.Number(), Type.Number())
    Assert.equal(Value.Check(T, 1), false)
    Assert.equal(Value.Check(T, true), false)
  })
})
