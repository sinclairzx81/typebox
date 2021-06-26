import { deepStrictEqual, strictEqual } from 'assert'
import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Object', () => {
  it('Object', () => {
    const T = Type.Object({
      a: Type.Number(),
      b: Type.String(),
      c: Type.Boolean(),
      d: Type.Array(Type.Number()),
      e: Type.Object({ x: Type.Number(), y: Type.Number() })
    })
    ok(T, { a: 10, b: '', c: true, d: [1, 2, 3], e: { x: 10, y: 20 } })
    fail(T, {})
    fail(T, [])
    fail(T, 'hello')
    fail(T, true)
    fail(T, 123)
    fail(T, null)
  })

  it('Optional', () => {
    const T = Type.Object({
      a: Type.Optional(Type.Number()),
      b: Type.Optional(Type.String()),
      c: Type.Optional(Type.Boolean()),
      d: Type.Optional(Type.Array(Type.Number())),
      e: Type.Optional(Type.Object({ x: Type.Number(), y: Type.Number() }))
    }, { additionalProperties: false })

    ok(T, { a: 10, b: '', c: true, d: [1, 2, 3], e: { x: 10, y: 20 } })
    ok(T, {})

    fail(T, { z: null }) // should this fail?
    fail(T, [])
    fail(T, 'hello')
    fail(T, true)
    fail(T, 123)
    fail(T, null)
  })

  it('Readonly', () => {
    const T = Type.Object({
      a: Type.Readonly(Type.Number()),
      b: Type.Readonly(Type.String()),
      c: Type.Readonly(Type.Boolean()),
      d: Type.Readonly(Type.Array(Type.Number())),
      e: Type.Readonly(Type.Object({ x: Type.Number(), y: Type.Number() }))
    }, { additionalProperties: false })

    ok(T, { a: 10, b: '', c: true, d: [1, 2, 3], e: { x: 10, y: 20 } })

    fail(T, {})
    fail(T, [])
    fail(T, 'hello')
    fail(T, true)
    fail(T, 123)
    fail(T, null)
  })

  describe('Required', () => {
    it('Contains all non-optional properties', () => {
      const T = Type.Object({
        a: Type.String(),
        b: Type.Optional(Type.String()),
        c: Type.String(),
      });

      deepStrictEqual(T.required, ['a', 'c']);
    });

    it(`The 'required' array property is omitted when all properties are optional`, () => {
      const T = Type.Object({
        a: Type.Optional(Type.String()),
        b: Type.Optional(Type.String()),
        c: Type.Optional(Type.String()),
      })
      strictEqual(T.required, undefined);
    });
  });

  describe('Additional Properties', () => {
    const T = Type.Object({
      a: Type.String(),
      b: Type.String(),
      c: Type.String(),
    }, { additionalProperties: false });
    ok(T, { a: '1', b: '2', c: '3' })
    fail(T, { a: '1', b: '2' })
    fail(T, { a: '1', b: '2', c: '3', d: '4' })
  })
})
