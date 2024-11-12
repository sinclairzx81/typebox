import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

// prettier-ignore
describe('value/convert/Import', () => {
  it('Should convert properties', () => {
    const T = Type.Module({ A: Type.Object({
      x: Type.Number(),
      y: Type.Boolean(),
      z: Type.Boolean()
    })}).Import('A')
    const R = Value.Convert(T, { x: '42', y: 'true', z: 'hello' })
    Assert.IsEqual(R, { x: 42, y: true, z: 'hello' })
  })
  it('Should convert known properties', () => {
    const T = Type.Module({ A: Type.Object({
      x: Type.Number(),
      y: Type.Boolean()
    })}).Import('A')
    const R = Value.Convert(T, { x: '42', y: 'true', z: 'hello' })
    Assert.IsEqual(R, { x: 42, y: true, z: 'hello' })
  })
  it('Should not convert missing properties', () => {
    const T = Type.Module({ A: Type.Object({ x: Type.Number() }) }).Import('A')
    const R = Value.Convert(T, { })
    Assert.IsEqual(R, { })
  })
})
