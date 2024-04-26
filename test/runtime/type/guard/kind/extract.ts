import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TExtract', () => {
  it('Should extract string from number', () => {
    const T = Type.Extract(Type.String(), Type.Number())
    Assert.IsTrue(KindGuard.IsNever(T))
  })
  it('Should extract string from string', () => {
    const T = Type.Extract(Type.String(), Type.String())
    Assert.IsTrue(KindGuard.IsString(T))
  })
  it('Should extract string | number | boolean from string', () => {
    const T = Type.Extract(Type.Union([Type.String(), Type.Number(), Type.Boolean()]), Type.String())
    Assert.IsTrue(KindGuard.IsString(T))
  })
  it('Should extract string | number | boolean from string | boolean', () => {
    const T = Type.Extract(Type.Union([Type.String(), Type.Number(), Type.Boolean()]), Type.Union([Type.String(), Type.Boolean()]))
    Assert.IsTrue(KindGuard.IsUnion(T))
    Assert.IsTrue(KindGuard.IsString(T.anyOf[0]))
    Assert.IsTrue(KindGuard.IsBoolean(T.anyOf[1]))
  })
  // ------------------------------------------------------------------------
  // TemplateLiteral | TemplateLiteral
  // ------------------------------------------------------------------------
  it('Should extract TemplateLiteral | TemplateLiteral 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const T = Type.Extract(A, B)
    Assert.IsTrue(['A', 'B', 'C'].includes(T.anyOf[0].const))
    Assert.IsTrue(['A', 'B', 'C'].includes(T.anyOf[1].const))
    Assert.IsTrue(['A', 'B', 'C'].includes(T.anyOf[2].const))
  })
  it('Should extract TemplateLiteral | TemplateLiteral 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])
    const T = Type.Extract(A, B)
    Assert.IsTrue(['A', 'B'].includes(T.anyOf[0].const))
    Assert.IsTrue(['A', 'B'].includes(T.anyOf[1].const))
  })
  it('Should extract TemplateLiteral | TemplateLiteral 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A')])])
    const T = Type.Extract(A, B)
    Assert.IsTrue(['A'].includes(T.const))
  })
  // ------------------------------------------------------------------------
  // TemplateLiteral | Union 1
  // ------------------------------------------------------------------------
  it('Should extract TemplateLiteral | Union 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
    const T = Type.Extract(A, B)
    Assert.IsTrue(['A', 'B', 'C'].includes(T.anyOf[0].const))
    Assert.IsTrue(['A', 'B', 'C'].includes(T.anyOf[1].const))
    Assert.IsTrue(['A', 'B', 'C'].includes(T.anyOf[2].const))
  })
  it('Should extract TemplateLiteral | Union 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.Union([Type.Literal('A'), Type.Literal('B')])
    const T = Type.Extract(A, B)
    Assert.IsTrue(['A', 'B'].includes(T.anyOf[0].const))
    Assert.IsTrue(['A', 'B'].includes(T.anyOf[1].const))
  })
  it('Should extract TemplateLiteral | Union 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.Union([Type.Literal('A')])
    const T = Type.Extract(A, B)
    Assert.IsTrue(['A'].includes(T.const))
  })
  // ------------------------------------------------------------------------
  // Union | TemplateLiteral 1
  // ------------------------------------------------------------------------
  it('Should extract Union | TemplateLiteral 1', () => {
    const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const T = Type.Extract(A, B)
    Assert.IsTrue(['A', 'B', 'C'].includes(T.anyOf[0].const))
    Assert.IsTrue(['A', 'B', 'C'].includes(T.anyOf[1].const))
    Assert.IsTrue(['A', 'B', 'C'].includes(T.anyOf[2].const))
  })
  it('Should extract Union | TemplateLiteral 1', () => {
    const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])
    const T = Type.Extract(A, B)
    Assert.IsTrue(['A', 'B'].includes(T.anyOf[0].const))
    Assert.IsTrue(['A', 'B'].includes(T.anyOf[1].const))
  })
  it('Should extract Union | TemplateLiteral 1', () => {
    const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A')])])
    const T = Type.Extract(A, B)
    Assert.IsTrue(['A'].includes(T.const))
  })
  it('Should extract with options', () => {
    const A = Type.String()
    const B = Type.String()
    const T = Type.Extract(A, B, { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
})
