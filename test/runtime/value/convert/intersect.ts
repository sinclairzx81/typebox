import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Intersect', () => {
  it('Should convert intersected objects', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ])
    const R = Value.Convert(T, { x: '1', y: '2' })
    Assert.IsEqual(R, { x: 1, y: 2 })
  })
  it('Should not convert for non object exclusive intersect', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Number(),
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ])
    const R = Value.Convert(T, { x: '1', y: '2' })
    Assert.IsEqual(R, { x: '1', y: '2' })
  })
  it('Should convert first type for object exclusive intersect 1', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Number(),
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ])
    const R = Value.Convert(T, '123')
    Assert.IsEqual(R, 123)
  })
  it('Should convert first type for object exclusive intersect 2', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() }),
      Type.Number(),
    ])
    const R = Value.Convert(T, { x: '3', y: '4' })
    Assert.IsEqual(R, { x: 3, y: '4' })
  })
})
