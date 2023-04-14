import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TKeyOf', () => {
  it('Should guard for keyof TObject', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    })
    const K = Type.KeyOf(T)
    Assert.deepEqual(TypeGuard.TUnion(K), true)
    Assert.deepEqual(TypeGuard.TLiteral(K.anyOf[0]), true)
    Assert.deepEqual(TypeGuard.TLiteral(K.anyOf[1]), true)
  })
  it('Should guard for keyof TRecursive', () => {
    const T = Type.Recursive((Self) =>
      Type.Object({
        x: Type.Number(),
        y: Type.Array(Self),
      }),
    )
    const K = Type.KeyOf(T)
    Assert.deepEqual(TypeGuard.TUnion(K), true)
    Assert.deepEqual(TypeGuard.TLiteral(K.anyOf[0]), true)
    Assert.deepEqual(TypeGuard.TLiteral(K.anyOf[1]), true)
  })
  it('Should guard for keyof TIntersect', () => {
    const T = Type.Intersect([
      Type.Object({
        x: Type.Number(),
      }),
      Type.Object({
        y: Type.Number(),
      }),
    ])
    const K = Type.KeyOf(T)
    Assert.deepEqual(TypeGuard.TUnion(K), true)
    Assert.deepEqual(TypeGuard.TLiteral(K.anyOf[0]), true)
    Assert.deepEqual(TypeGuard.TLiteral(K.anyOf[1]), true)
  })
  it('Should guard for keyof TUnion', () => {
    const T = Type.Union([
      Type.Object({
        x: Type.Number(),
      }),
      Type.Object({
        y: Type.Number(),
      }),
    ])
    const K = Type.KeyOf(T)
    Assert.deepEqual(TypeGuard.TNever(K), true)
  })
  it('Should guard for keyof TNull', () => {
    const T = Type.Null()
    const K = Type.KeyOf(T)
    Assert.deepEqual(TypeGuard.TNever(K), true)
  })
})
