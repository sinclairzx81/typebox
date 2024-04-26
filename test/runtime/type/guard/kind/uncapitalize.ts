import { KindGuard, Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/Uncapitalize', () => {
  it('Should guard for Uncapitalize 1', () => {
    const T = Type.Uncapitalize(Type.Literal('HELLO'), { $id: 'hello', foo: 1 })
    Assert.IsTrue(KindGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'hELLO')
    Assert.IsEqual(T.$id, 'hello')
    Assert.IsEqual(T.foo, 1)
  })
  it('Should guard for Uncapitalize 2', () => {
    const T = Type.Uncapitalize(Type.Literal('HELLO'))
    Assert.IsTrue(KindGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'hELLO')
  })
  it('Should guard for Uncapitalize 3', () => {
    const T = Type.Uncapitalize(Type.Union([Type.Literal('HELLO'), Type.Literal('WORLD')]))
    Assert.IsTrue(KindGuard.IsUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 'hELLO')
    Assert.IsEqual(T.anyOf[1].const, 'wORLD')
  })
  it('Should guard for Uncapitalize 4', () => {
    const T = Type.Uncapitalize(Type.TemplateLiteral('HELLO${0|1}'))
    Assert.IsTrue(KindGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(hELLO0|hELLO1)$')
  })
  it('Should guard for Uncapitalize 5', () => {
    const T = Type.Uncapitalize(Type.TemplateLiteral([Type.Literal('HELLO'), Type.Union([Type.Literal(0), Type.Literal(1)])]))
    Assert.IsTrue(KindGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(hELLO0|hELLO1)$')
  })
})
