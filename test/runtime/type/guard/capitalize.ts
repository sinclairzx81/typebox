import { TypeGuard, Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/Capitalize', () => {
  it('Should guard for Capitalize 1', () => {
    const T = Type.Capitalize(Type.Literal('hello'), { $id: 'hello', foo: 1 })
    Assert.IsTrue(TypeGuard.TLiteral(T))
    Assert.IsEqual(T.const, 'Hello')
    Assert.IsEqual(T.$id, 'hello')
    Assert.IsEqual(T.foo, 1)
  })
  it('Should guard for Capitalize 2', () => {
    const T = Type.Capitalize(Type.Literal('hello'))
    Assert.IsTrue(TypeGuard.TLiteral(T))
    Assert.IsEqual(T.const, 'Hello')
  })
  it('Should guard for Capitalize 3', () => {
    const T = Type.Capitalize(Type.Union([Type.Literal('hello'), Type.Literal('world')]))
    Assert.IsTrue(TypeGuard.TUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 'Hello')
    Assert.IsEqual(T.anyOf[1].const, 'World')
  })
  it('Should guard for Capitalize 4', () => {
    const T = Type.Capitalize(Type.TemplateLiteral('hello${0|1}'))
    Assert.IsTrue(TypeGuard.TTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(Hello0|Hello1)$')
  })
})
