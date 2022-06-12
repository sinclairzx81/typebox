import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'
import { Assert } from '../../assert/index'

describe('type/compiler/Ref', () => {
  it('Should should validate when referencing a type', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { $id: Assert.randomUUID() },
    )
    const R = Type.Ref(T)
    ok(
      R,
      {
        x: 1,
        y: 2,
        z: 3,
      },
      [T],
    )
  })

  it('Should not validate when passing invalid data', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { $id: Assert.randomUUID() },
    )
    const R = Type.Ref(T)
    fail(
      R,
      {
        x: 1,
        y: 2,
      },
      [T],
    )
  })
})
