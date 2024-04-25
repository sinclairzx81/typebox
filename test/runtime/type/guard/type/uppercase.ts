import { TypeGuard, Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/Uppercase', () => {
  it('Should guard for Uppercase 1', () => {
    const T = Type.Uppercase(Type.Literal('hello'), { $id: 'hello', foo: 1 })
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'HELLO')
    Assert.IsEqual(T.$id, 'hello')
    Assert.IsEqual(T.foo, 1)
  })
  it('Should guard for Uppercase 2', () => {
    const T = Type.Uppercase(Type.Literal('hello'))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'HELLO')
  })
  it('Should guard for Uppercase 3', () => {
    const T = Type.Uppercase(Type.Union([Type.Literal('hello'), Type.Literal('world')]))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 'HELLO')
    Assert.IsEqual(T.anyOf[1].const, 'WORLD')
  })
  it('Should guard for Uppercase 4', () => {
    const T = Type.Uppercase(Type.TemplateLiteral('hello${0|1}'))
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(HELLO0|HELLO1)$')
  })
  it('Should guard for Uppercase 5', () => {
    const T = Type.Uppercase(Type.TemplateLiteral([Type.Literal('hello'), Type.Union([Type.Literal(0), Type.Literal(1)])]))
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(HELLO0|HELLO1)$')
  })
})
