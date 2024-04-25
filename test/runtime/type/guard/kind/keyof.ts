import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TKeyOf', () => {
  it('Should KeyOf 1', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    })
    const K = Type.KeyOf(T)
    Assert.IsTrue(KindGuard.IsUnion(K))
    Assert.IsTrue(KindGuard.IsLiteral(K.anyOf[0]))
    Assert.IsTrue(KindGuard.IsLiteral(K.anyOf[1]))
  })
  it('Should KeyOf 2', () => {
    const T = Type.Recursive((Self) =>
      Type.Object({
        x: Type.Number(),
        y: Type.Array(Self),
      }),
    )
    const K = Type.KeyOf(T)
    Assert.IsTrue(KindGuard.IsUnion(K))
    Assert.IsTrue(KindGuard.IsLiteral(K.anyOf[0]))
    Assert.IsTrue(KindGuard.IsLiteral(K.anyOf[1]))
  })
  it('Should KeyOf 3', () => {
    const T = Type.Intersect([
      Type.Object({
        x: Type.Number(),
      }),
      Type.Object({
        y: Type.Number(),
      }),
    ])
    const K = Type.KeyOf(T)
    Assert.IsTrue(KindGuard.IsUnion(K))
    Assert.IsTrue(KindGuard.IsLiteral(K.anyOf[0]))
    Assert.IsTrue(KindGuard.IsLiteral(K.anyOf[1]))
  })
  it('Should KeyOf 4', () => {
    const T = Type.Union([
      Type.Object({
        x: Type.Number(),
      }),
      Type.Object({
        y: Type.Number(),
      }),
    ])
    const K = Type.KeyOf(T)
    Assert.IsTrue(KindGuard.IsNever(K))
  })
  it('Should KeyOf 5', () => {
    const T = Type.Null()
    const K = Type.KeyOf(T)
    Assert.IsTrue(KindGuard.IsNever(K))
  })
  it('Should KeyOf 6', () => {
    const T = Type.Array(Type.Number())
    const K = Type.KeyOf(T)
    Assert.IsTrue(KindGuard.IsNumber(K))
  })
  it('Should KeyOf 7', () => {
    const T = Type.Tuple([])
    const K = Type.KeyOf(T)
    Assert.IsTrue(KindGuard.IsNever(K))
  })
  it('Should KeyOf 8', () => {
    const T = Type.Tuple([Type.Number(), Type.Null()])
    const K = Type.KeyOf(T)
    Assert.IsTrue(KindGuard.IsUnion(K))
    Assert.IsEqual(K.anyOf[0].const, '0')
    Assert.IsEqual(K.anyOf[1].const, '1')
  })
})
