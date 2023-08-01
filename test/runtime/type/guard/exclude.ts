import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TExclude', () => {
  it('Should extract string from number', () => {
    const T = Type.Exclude(Type.String(), Type.Number())
    Assert.IsTrue(TypeGuard.TString(T))
  })
  it('Should extract string from string', () => {
    const T = Type.Exclude(Type.String(), Type.String())
    Assert.IsTrue(TypeGuard.TNever(T))
  })
  it('Should extract string | number | boolean from string', () => {
    const T = Type.Exclude(Type.Union([Type.String(), Type.Number(), Type.Boolean()]), Type.String())
    Assert.IsTrue(TypeGuard.TUnion(T))
    Assert.IsTrue(TypeGuard.TNumber(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.TBoolean(T.anyOf[1]))
  })
  it('Should extract string | number | boolean from string | boolean', () => {
    const T = Type.Exclude(Type.Union([Type.String(), Type.Number(), Type.Boolean()]), Type.Union([Type.String(), Type.Boolean()]))
    Assert.IsTrue(TypeGuard.TNumber(T))
  })
  // ------------------------------------------------------------------------
  // TemplateLiteral | TemplateLiteral
  // ------------------------------------------------------------------------
  it('Should extract TemplateLiteral | TemplateLiteral 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(TypeGuard.TNever(T))
  })
  it('Should extract TemplateLiteral | TemplateLiteral 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(['C'].includes(T.const))
  })
  it('Should extract TemplateLiteral | TemplateLiteral 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A')])])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(['C', 'B'].includes(T.anyOf[0].const))
    Assert.IsTrue(['C', 'B'].includes(T.anyOf[1].const))
  })
  // ------------------------------------------------------------------------
  // TemplateLiteral | Union 1
  // ------------------------------------------------------------------------
  it('Should extract TemplateLiteral | Union 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(TypeGuard.TNever(T))
  })
  it('Should extract TemplateLiteral | Union 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.Union([Type.Literal('A'), Type.Literal('B')])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(['C'].includes(T.const))
  })
  it('Should extract TemplateLiteral | Union 1', () => {
    const A = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const B = Type.Union([Type.Literal('A')])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(['C', 'B'].includes(T.anyOf[0].const))
    Assert.IsTrue(['C', 'B'].includes(T.anyOf[1].const))
  })
  // ------------------------------------------------------------------------
  // Union | TemplateLiteral 1
  // ------------------------------------------------------------------------
  it('Should extract Union | TemplateLiteral 1', () => {
    const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(TypeGuard.TNever(T))
  })
  it('Should extract Union | TemplateLiteral 1', () => {
    const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Literal('B')])])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(['C'].includes(T.const))
  })
  it('Should extract Union | TemplateLiteral 1', () => {
    const A = Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')])
    const B = Type.TemplateLiteral([Type.Union([Type.Literal('A')])])
    const T = Type.Exclude(A, B)
    Assert.IsTrue(['C', 'B'].includes(T.anyOf[0].const))
    Assert.IsTrue(['C', 'B'].includes(T.anyOf[1].const))
  })
})
