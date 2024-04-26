import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/Awaited', () => {
  it('Should guard for Awaited 1', () => {
    const T = Type.Awaited(Type.String())
    const R = KindGuard.IsString(T)
    Assert.IsTrue(R)
  })
  it('Should guard for Awaited 2', () => {
    const T = Type.Awaited(Type.Promise(Type.String()))
    const R = KindGuard.IsString(T)
    Assert.IsTrue(R)
  })
  it('Should guard for Awaited 3', () => {
    const T = Type.Awaited(Type.Awaited(Type.Promise(Type.String())))
    const R = KindGuard.IsString(T)
    Assert.IsTrue(R)
  })
  it('Should guard for Awaited 4', () => {
    const T = Type.Awaited(Type.Union([Type.Promise(Type.Promise(Type.String()))]))
    Assert.IsTrue(KindGuard.IsString(T))
  })
  it('Should guard for Awaited 5', () => {
    const T = Type.Awaited(Type.Union([Type.Promise(Type.Promise(Type.String())), Type.Number()]))
    Assert.IsTrue(KindGuard.IsUnion(T))
    Assert.IsTrue(KindGuard.IsString(T.anyOf[0]))
    Assert.IsTrue(KindGuard.IsNumber(T.anyOf[1]))
  })
  it('Should guard for Awaited 6', () => {
    const T = Type.Awaited(Type.Intersect([Type.Promise(Type.Promise(Type.String()))]))
    Assert.IsTrue(KindGuard.IsString(T))
  })
  it('Should guard for Awaited 7', () => {
    const T = Type.Awaited(Type.Intersect([Type.Promise(Type.Promise(Type.String())), Type.Number()]))
    Assert.IsTrue(KindGuard.IsIntersect(T))
    Assert.IsTrue(KindGuard.IsString(T.allOf[0]))
    Assert.IsTrue(KindGuard.IsNumber(T.allOf[1]))
  })
})
