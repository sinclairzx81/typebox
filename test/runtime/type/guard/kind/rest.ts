import { Type, KindGuard } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TRest', () => {
  it('Should guard 1', () => {
    // union never
    const A = Type.String()
    const B = Type.Union(Type.Rest(A))
    Assert.IsTrue(KindGuard.IsNever(B))
  })
  it('Should guard 2', () => {
    // intersect never
    const A = Type.String()
    const B = Type.Intersect(Type.Rest(A))
    Assert.IsTrue(KindGuard.IsNever(B))
  })
  it('Should guard 3', () => {
    // tuple
    const A = Type.Tuple([Type.Number(), Type.String()])
    const B = Type.Union(Type.Rest(A))
    Assert.IsTrue(KindGuard.IsUnion(B))
    Assert.IsEqual(B.anyOf.length, 2)
    Assert.IsTrue(KindGuard.IsNumber(B.anyOf[0]))
    Assert.IsTrue(KindGuard.IsString(B.anyOf[1]))
  })
  it('Should guard 4', () => {
    // tuple spread
    const A = Type.Tuple([Type.Literal(1), Type.Literal(2)])
    const B = Type.Tuple([Type.Literal(3), Type.Literal(4)])
    const C = Type.Tuple([...Type.Rest(A), ...Type.Rest(B)])
    Assert.IsTrue(KindGuard.IsTuple(C))
    Assert.IsEqual(C.items!.length, 4)
    Assert.IsEqual(C.items![0].const, 1)
    Assert.IsEqual(C.items![1].const, 2)
    Assert.IsEqual(C.items![2].const, 3)
    Assert.IsEqual(C.items![3].const, 4)
  })
  it('Should guard 5', () => {
    // union to intersect
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.String() })
    const C = Type.Union([A, B])
    const D = Type.Intersect(Type.Rest(C))
    Assert.IsTrue(KindGuard.IsIntersect(D))
    Assert.IsEqual(D.allOf.length, 2)
    Assert.IsTrue(KindGuard.IsObject(D.allOf[0]))
    Assert.IsTrue(KindGuard.IsObject(D.allOf[1]))
  })
  it('Should guard 6', () => {
    // intersect to composite
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.String() })
    const C = Type.Intersect([A, B])
    const D = Type.Composite(Type.Rest(C))
    Assert.IsTrue(KindGuard.IsObject(D))
    Assert.IsTrue(KindGuard.IsNumber(D.properties.x))
    Assert.IsTrue(KindGuard.IsString(D.properties.y))
  })
})
