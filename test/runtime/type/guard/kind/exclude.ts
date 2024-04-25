import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TExclude', () => {
  it('Should exclude string from number', () => {
    const T = Type.Exclude(Type.String(), Type.Number())
    Assert.IsTrue(KindGuard.IsString(T))
  })
  it('Should exclude string from string', () => {
    const T = Type.Exclude(Type.String(), Type.String())
    Assert.IsTrue(KindGuard.IsNever(T))
  })
  it('Should exclude string | number | boolean from string', () => {
    const T = Type.Exclude(Type.Union([Type.String(), Type.Number(), Type.Boolean()]), Type.String())
    Assert.IsTrue(KindGuard.IsUnion(T))
    Assert.IsTrue(KindGuard.IsNumber(T.anyOf[0]))
    Assert.IsTrue(KindGuard.IsBoolean(T.anyOf[1]))
  })
  it('Should exclude string | number | boolean from string | boolean', () => {
    const T = Type.Exclude(Type.Union([Type.String(), Type.Number(), Type.Boolean()]), Type.Union([Type.String(), Type.Boolean()]))
    Assert.IsTrue(KindGuard.IsNumber(T))
  })
  // ------------------------------------------------------------------------
  // TemplateLiteral | TemplateLiteral
  // ------------------------------------------------------------------------
  it('Should exclude TemplateLiteral | TemplateLiteral 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(KindGuard.IsNever(T))
  })
  it('Should exclude TemplateLiteral | TemplateLiteral 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(['C'].includes(T.const))
  })
  it('Should exclude TemplateLiteral | TemplateLiteral 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A')])])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(['C', 'B'].includes(T.anyOf[0].const))
    Assert.IsTrue(['C', 'B'].includes(T.anyOf[1].const))
  })
  // ------------------------------------------------------------------------
  // TemplateLiteral | Union 1
  // ------------------------------------------------------------------------
  it('Should exclude TemplateLiteral | Union 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(KindGuard.IsNever(T))
  })
  it('Should exclude TemplateLiteral | Union 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.Union([Type.Literal('A'), Type.Literal('B')])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(['C'].includes(T.const))
  })
  it('Should exclude TemplateLiteral | Union 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.Union([Type.Literal('A')])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(['C', 'B'].includes(T.anyOf[0].const))
    Assert.IsTrue(['C', 'B'].includes(T.anyOf[1].const))
  })
  // ------------------------------------------------------------------------
  // Union | TemplateLiteral 1
  // ------------------------------------------------------------------------
  it('Should exclude Union | TemplateLiteral 1', () => {
    const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(KindGuard.IsNever(T))
  })
  it('Should exclude Union | TemplateLiteral 1', () => {
    const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(['C'].includes(T.const))
  })
  it('Should exclude Union | TemplateLiteral 1', () => {
    const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A')])])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(['C', 'B'].includes(T.anyOf[0].const))
    Assert.IsTrue(['C', 'B'].includes(T.anyOf[1].const))
  })
  it('Should exclude with options', () => {
    const A = Type.String()
    const B = Type.String()
    const T = Type.Exclude(A, B, { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
})
