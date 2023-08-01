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
    Assert.IsEqual(Value.Create(T), {
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
    Assert.IsEqual(Value.Create(T), 7)
  })
  it('Should throw on infinite type', () => {
    const T = Type.Recursive((This) =>
      Type.Object({
        x: This,
      }),
    )
    Assert.Throws(() => Value.Create(T))
  })
  it('Should not throw on recursive type when terminating sub type proceeds self', () => {
    const T = Type.Recursive((This) =>
      Type.Object({
        x: Type.Union([Type.Null(), This]),
      }),
    )
    Assert.IsEqual(Value.Create(T), { x: null })
  })
  it('Should not throw on recursive type when self is optional', () => {
    const T = Type.Recursive((This) =>
      Type.Object({
        x: Type.Optional(This),
      }),
    )
    Assert.IsEqual(Value.Create(T), {})
  })
})
