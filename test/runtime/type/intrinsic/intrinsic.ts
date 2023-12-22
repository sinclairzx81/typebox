import { TypeGuard } from '@sinclair/typebox'
import { Intrinsic } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/intrinsic/Intrinsic', () => {
  // ----------------------------------------------------
  // Passthrough
  // ----------------------------------------------------
  it('Should passthrough 1', () => {
    const T = Intrinsic(Type.String(), 'Capitalize')
    Assert.IsTrue(TypeGuard.IsString(T))
  })
  it('Should passthrough 2', () => {
    const T = Intrinsic(Type.Number(), 'Capitalize')
    Assert.IsTrue(TypeGuard.IsNumber(T))
  })
  it('Should passthrough 3', () => {
    const T = Intrinsic(
      Type.Object({
        x: Type.Number(),
      }),
      'Capitalize',
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
  })
  // ----------------------------------------------------
  // Partial Passthrough
  // ----------------------------------------------------
  it('Should partial passthrough 3', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Literal('hello')
    const U = Type.Union([A, B])
    const T = Intrinsic(U, 'Capitalize')
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(TypeGuard.IsObject(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsLiteral(T.anyOf[1]))
    Assert.IsEqual(T.anyOf[1].const, 'Hello')
  })
  // ----------------------------------------------------
  // Mode: Literal
  // ----------------------------------------------------
  it('Should map literal: Capitalize', () => {
    const T = Intrinsic(Type.Literal('hello'), 'Capitalize')
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'Hello')
  })
  it('Should map literal: Uncapitalize', () => {
    const T = Intrinsic(Type.Literal('HELLO'), 'Uncapitalize')
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'hELLO')
  })
  it('Should map literal: Uppercase', () => {
    const T = Intrinsic(Type.Literal('hello'), 'Uppercase')
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'HELLO')
  })
  it('Should map literal: Lowercase', () => {
    const T = Intrinsic(Type.Literal('HELLO'), 'Lowercase')
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'hello')
  })
  // ----------------------------------------------------
  // Mode: Literal Union
  // ----------------------------------------------------
  it('Should map literal union: Capitalize', () => {
    const T = Intrinsic(Type.Union([Type.Literal('hello'), Type.Literal('world')]), 'Capitalize')
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 'Hello')
    Assert.IsEqual(T.anyOf[1].const, 'World')
  })
  it('Should map literal union: Uncapitalize', () => {
    const T = Intrinsic(Type.Union([Type.Literal('Hello'), Type.Literal('World')]), 'Uncapitalize')
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 'hello')
    Assert.IsEqual(T.anyOf[1].const, 'world')
  })
  it('Should map literal union: Uppercase', () => {
    const T = Intrinsic(Type.Union([Type.Literal('hello'), Type.Literal('world')]), 'Uppercase')
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 'HELLO')
    Assert.IsEqual(T.anyOf[1].const, 'WORLD')
  })
  it('Should map literal union: Lowercase', () => {
    const T = Intrinsic(Type.Union([Type.Literal('HELLO'), Type.Literal('WORLD')]), 'Lowercase')
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 'hello')
    Assert.IsEqual(T.anyOf[1].const, 'world')
  })
  // ----------------------------------------------------
  // Mode: TemplateLiteral
  // ----------------------------------------------------
  it('Should map template literal: Capitalize', () => {
    const T = Intrinsic(Type.TemplateLiteral('hello${1|2}world'), 'Capitalize')
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(Hello1world|Hello2world)$')
  })
  it('Should map template literal: Uncapitalize', () => {
    const T = Intrinsic(Type.TemplateLiteral('HELLO${1|2}WORLD'), 'Uncapitalize')
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(hELLO1WORLD|hELLO2WORLD)$')
  })
  it('Should map template literal: Uppercase', () => {
    const T = Intrinsic(Type.TemplateLiteral('hello${1|2}world'), 'Uppercase')
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(HELLO1WORLD|HELLO2WORLD)$')
  })
  it('Should map template literal: Lowercase', () => {
    const T = Intrinsic(Type.TemplateLiteral('HELLO${1|2}WORLD'), 'Lowercase')
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(hello1world|hello2world)$')
  })
  // ----------------------------------------------------
  // Mode: TemplateLiteral Numeric
  // ----------------------------------------------------
  it('Should map template literal numeric: Capitalize', () => {
    const T = Intrinsic(Type.TemplateLiteral([Type.Literal('hello'), Type.Union([Type.Literal(1), Type.Literal(2)])]), 'Capitalize')
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(Hello1|Hello2)$')
  })
  it('Should map template literal numeric: Uncapitalize', () => {
    const T = Intrinsic(Type.TemplateLiteral([Type.Literal('HELLO'), Type.Union([Type.Literal(1), Type.Literal(2)])]), 'Uncapitalize')
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(hELLO1|hELLO2)$')
  })
  it('Should map template literal numeric: Uppercase', () => {
    const T = Intrinsic(Type.TemplateLiteral([Type.Literal('hello'), Type.Union([Type.Literal(1), Type.Literal(2)])]), 'Uppercase')
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(HELLO1|HELLO2)$')
  })
  it('Should map template literal numeric: Lowercase', () => {
    const T = Intrinsic(Type.TemplateLiteral([Type.Literal('HELLO'), Type.Union([Type.Literal(1), Type.Literal(2)])]), 'Lowercase')
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(hello1|hello2)$')
  })
  // ----------------------------------------------------
  // Mode: TemplateLiteral Patterns
  // ----------------------------------------------------
  it('Should map template literal patterns 1', () => {
    const T = Intrinsic(Type.TemplateLiteral('HELLO${string}WORLD'), 'Lowercase')
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^hello(.*)world$')
  })
  it('Should map template literal patterns 2', () => {
    const T = Intrinsic(Type.TemplateLiteral('HELLO${number}WORLD'), 'Lowercase')
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^hello(0|[1-9][0-9]*)world$')
  })
  it('Should map template literal patterns 3', () => {
    const T = Intrinsic(Type.TemplateLiteral('${number}${string}'), 'Lowercase')
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(0|[1-9][0-9]*)(.*)$')
  })
  it('Should map template literal patterns 3', () => {
    const T = Intrinsic(Type.TemplateLiteral('${number}HELLO${string}'), 'Lowercase')
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(0|[1-9][0-9]*)hello(.*)$')
  })
  it('Should map template literal patterns 3', () => {
    const T = Intrinsic(Type.TemplateLiteral('${string|number}HELLO'), 'Lowercase')
    Assert.IsTrue(TypeGuard.IsTemplateLiteral(T))
    Assert.IsEqual(T.pattern, '^(stringhello|numberhello)$')
  })
})
