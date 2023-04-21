import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index.js'

describe('type/guard/TIndex', () => {
  it('Should Index 1', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
    })
    const I = Type.Index(T, ['x'])
    Assert.deepEqual(TypeGuard.TNumber(I), true)
  })
  it('Should Index 2', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
    })
    const I = Type.Index(T, ['x', 'y'])
    Assert.deepEqual(TypeGuard.TUnion(I), true)
    Assert.deepEqual(TypeGuard.TNumber(I.anyOf[0]), true)
    Assert.deepEqual(TypeGuard.TString(I.anyOf[1]), true)
  })
  it('Should Index 3', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
    })
    const I = Type.Index(T, Type.KeyOf(T))
    Assert.deepEqual(TypeGuard.TUnion(I), true)
    Assert.deepEqual(TypeGuard.TNumber(I.anyOf[0]), true)
    Assert.deepEqual(TypeGuard.TString(I.anyOf[1]), true)
  })
  it('Should Index 4', () => {
    const T = Type.Object({
      ab: Type.Number(),
      ac: Type.String(),
    })
    const I = Type.Index(T, Type.TemplateLiteral([Type.Literal('a'), Type.Union([Type.Literal('b'), Type.Literal('c')])]))
    Assert.deepEqual(TypeGuard.TUnion(I), true)
    Assert.deepEqual(TypeGuard.TNumber(I.anyOf[0]), true)
    Assert.deepEqual(TypeGuard.TString(I.anyOf[1]), true)
  })
  it('Should Index 5', () => {
    const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.String() })])
    const I = Type.Index(T, ['x', 'y'])
    Assert.deepEqual(TypeGuard.TUnion(I), true)
    Assert.deepEqual(TypeGuard.TNumber(I.anyOf[0]), true)
    Assert.deepEqual(TypeGuard.TString(I.anyOf[1]), true)
  })
  it('Should Index 6', () => {
    const T = Type.Union([Type.Object({ x: Type.Number() }), Type.Object({ x: Type.String() })])
    const I = Type.Index(T, ['x'])
    Assert.deepEqual(TypeGuard.TUnion(I), true)
    Assert.deepEqual(TypeGuard.TNumber(I.anyOf[0]), true)
    Assert.deepEqual(TypeGuard.TString(I.anyOf[1]), true)
  })
  it('Should Index 7', () => {
    const T = Type.Array(Type.Null())
    const I = Type.Index(T, Type.Number())
    Assert.deepEqual(TypeGuard.TNull(I), true)
  })
  it('Should Index 6', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [0])
    Assert.deepEqual(TypeGuard.TLiteralString(I), true)
    Assert.deepEqual(I.const, 'hello')
  })
  it('Should Index 8', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [1])
    Assert.deepEqual(TypeGuard.TLiteralString(I), true)
    Assert.deepEqual(I.const, 'world')
  })
  it('Should Index 9', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [0, 1])
    Assert.deepEqual(TypeGuard.TUnion(I), true)
    Assert.deepEqual(I.anyOf[0].const, 'hello')
    Assert.deepEqual(I.anyOf[1].const, 'world')
  })
  it('Should Index 10', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [1, 0])
    Assert.deepEqual(TypeGuard.TUnion(I), true)
    Assert.deepEqual(I.anyOf[0].const, 'world')
    Assert.deepEqual(I.anyOf[1].const, 'hello')
  })
  it('Should Index 11', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [0, 0, 0, 1])
    Assert.deepEqual(TypeGuard.TUnion(I), true)
    Assert.deepEqual(I.anyOf[0].const, 'hello')
    Assert.deepEqual(I.anyOf[1].const, 'hello')
    Assert.deepEqual(I.anyOf[2].const, 'hello')
    Assert.deepEqual(I.anyOf[3].const, 'world')
  })
})
