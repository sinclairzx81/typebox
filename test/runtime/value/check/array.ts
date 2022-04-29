import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Array', () => {
  it('Should pass number array', () => {
    const T = Type.Array(Type.Number())
    const value = [1, 2, 3]
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })

  it('Should fail number array', () => {
    const T = Type.Array(Type.Number())
    const value = ['a', 'b', 'c']
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should pass object array', () => {
    const T = Type.Array(Type.Object({ x: Type.Number() }))
    const value = [{ x: 1 }, { x: 1 }, { x: 1 }]
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })

  it('Should fail object array', () => {
    const T = Type.Array(Type.Object({ x: Type.Number() }))
    const value = [{ x: 1 }, { x: 1 }, 1]
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })
})
