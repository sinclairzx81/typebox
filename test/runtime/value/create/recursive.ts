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
    Assert.deepEqual(Value.Create(T), {
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
    Assert.deepEqual(Value.Create(T), 7)
  })
})
