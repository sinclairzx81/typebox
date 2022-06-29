import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'
import { strictEqual } from 'assert'

describe('type/schema/KeyOf', () => {
  it('Should validate with all object keys as a kind of union', () => {
    const T = Type.KeyOf(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      }),
    )
    ok(T, 'x')
    ok(T, 'y')
    ok(T, 'z')
    fail(T, 'w')
  })

  it('Should validate when using pick', () => {
    const T = Type.KeyOf(
      Type.Pick(
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
          z: Type.Number(),
        }),
        ['x', 'y'],
      ),
    )
    ok(T, 'x')
    ok(T, 'y')
    fail(T, 'z')
  })

  it('Should validate when using omit', () => {
    const T = Type.KeyOf(
      Type.Omit(
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
          z: Type.Number(),
        }),
        ['x', 'y'],
      ),
    )

    fail(T, 'x')
    fail(T, 'y')
    ok(T, 'z')
  })
})
