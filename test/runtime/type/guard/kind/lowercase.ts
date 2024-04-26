import { KindGuard, Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/Lowercase', () => {
  it('Should guard for Lowercase 1', () => {
    const T = Type.Lowercase(Type.Literal('HELLO'), { $id: 'hello', foo: 1 })
    Assert.IsTrue(KindGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'hello')
    Assert.IsEqual(T.$id, 'hello')
    Assert.IsEqual(T.foo, 1)
  })
  it('Should guard for Lowercase 2', () => {
    const T = Type.Lowercase(Type.Literal('HELLO'))
    Assert.IsTrue(KindGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'hello')
  })
  it('Should guard for Lowercase 3', () => {
    const T = Type.Lowercase(Type.Union([Type.Literal('HELLO'), Type.Literal('WORLD')]))
    Assert.IsTrue(KindGuard.IsUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 'hello')
    Assert.IsEqual(T.anyOf[1].const, 'world')
  })
  it('Should guard for Lowercase 4', () => {
    const T = Type.Lowercase(Type.TemplateLiteral('HELLO${0|1}'))
    Assert.IsTrue(KindGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(hello0|hello1)$')
  })
  it('Should guard for Lowercase 5', () => {
    const T = Type.Lowercase(Type.TemplateLiteral([Type.Literal('HELLO'), Type.Union([Type.Literal(0), Type.Literal(1)])]))
    Assert.IsTrue(KindGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(hello0|hello1)$')
  })
})
