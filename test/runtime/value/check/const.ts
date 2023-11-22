import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Const', () => {
  it('Should validate 1', () => {
    const T = Type.Const(1)
    Assert.IsTrue(Value.Check(T, 1))
  })
  it('Should validate 2', () => {
    const T = Type.Const('hello')
    Assert.IsTrue(Value.Check(T, 'hello'))
  })
  it('Should validate 3', () => {
    const T = Type.Const(true)
    Assert.IsTrue(Value.Check(T, true))
  })
  it('Should validate 4', () => {
    const T = Type.Const({ x: 1, y: 2 })
    Assert.IsTrue(Value.Check(T, { x: 1, y: 2 }))
  })
  it('Should validate 5', () => {
    const T = Type.Const([1, 2, 3])
    Assert.IsTrue(Value.Check(T, [1, 2, 3]))
  })
  it('Should validate 6', () => {
    const T = Type.Const([1, true, 'hello'])
    Assert.IsTrue(Value.Check(T, [1, true, 'hello']))
  })
  it('Should validate 7', () => {
    const T = Type.Const({
      x: [1, 2, 3, 4],
      y: { x: 1, y: 2, z: 3 },
    })
    Assert.IsTrue(
      Value.Check(T, {
        x: [1, 2, 3, 4],
        y: { x: 1, y: 2, z: 3 },
      }),
    )
  })
})
