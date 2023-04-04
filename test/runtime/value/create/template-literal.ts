import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/TemplateLiteral', () => {
  it('Should create pattern 1', () => {
    const T = Type.TemplateLiteral([Type.Literal('A')])
    const V = Value.Create(T)
    Assert.deepEqual(V, 'A')
  })
  it('Should create pattern 2', () => {
    const T = Type.TemplateLiteral([Type.Literal('A'), Type.Literal('B')])
    const V = Value.Create(T)
    Assert.deepEqual(V, 'AB')
  })
  it('Should create pattern 3 (first only)', () => {
    const T = Type.TemplateLiteral([Type.Literal('A'), Type.Union([Type.Literal('B'), Type.Literal('C')])])
    const V = Value.Create(T)
    Assert.deepEqual(V, 'AB')
  })
  it('Should create pattern 4 (first only)', () => {
    const T = Type.TemplateLiteral([Type.Boolean()])
    const V = Value.Create(T)
    Assert.deepEqual(V, 'true')
  })
  it('Should throw on infinite pattern', () => {
    const T = Type.TemplateLiteral([Type.Number()])
    Assert.throws(() => Value.Create(T))
  })
  it('Should create on infinite pattern with default', () => {
    const T = Type.TemplateLiteral([Type.Number()], { default: 42 })
    const V = Value.Create(T)
    Assert.deepEqual(V, 42)
  })
})
