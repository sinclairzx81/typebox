import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Recursive', () => {
  it('Should create value', () => {
    const T = Type.Recursive((This) =>
      Type.Object({
        id: Type.String(),
        nodes: Type.Array(This),
      }),
    )
    Assert.isEqual(Value.Create(T), {
      id: '',
      nodes: [],
    })
  })
  it('Should create default', () => {
    const T = Type.Recursive(
      (This) =>
        Type.Object({
          id: Type.String(),
          nodes: Type.Array(This),
        }),
      { default: 7 },
    )
    Assert.isEqual(Value.Create(T), 7)
  })
  it('Should throw on infinite type', () => {
    const T = Type.Recursive((This) =>
      Type.Object({
        x: This,
      }),
    )
    Assert.throws(() => Value.Create(T))
  })
})
