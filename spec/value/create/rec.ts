import { Value } from '@sidewinder/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Rec', () => {
  it('Should create value', () => {
    const T = Type.Rec((Self) =>
      Type.Object({
        id: Type.String(),
        nodes: Type.Array(Self),
      }),
    )
    Assert.deepEqual(Value.Create(T), {
      id: '',
      nodes: [],
    })
  })

  it('Should create default', () => {
    const T = Type.Rec(
      (Self) =>
        Type.Object({
          id: Type.String(),
          nodes: Type.Array(Self),
        }),
      { default: 7 },
    )
    Assert.deepEqual(Value.Create(T), 7)
  })
})
