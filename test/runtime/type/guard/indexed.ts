import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TIndex', () => {
  it('Should Index 1', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
    })
    const I = Type.Index(T, ['x'])
    Assert.isEqual(TypeGuard.TNumber(I), true)
  })
  it('Should Index 2', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
    })
    const I = Type.Index(T, ['x', 'y'])
    Assert.isEqual(TypeGuard.TUnion(I), true)
    Assert.isEqual(TypeGuard.TNumber(I.anyOf[0]), true)
    Assert.isEqual(TypeGuard.TString(I.anyOf[1]), true)
  })
  it('Should Index 3', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
    })
    const I = Type.Index(T, Type.KeyOf(T))
    Assert.isEqual(TypeGuard.TUnion(I), true)
    Assert.isEqual(TypeGuard.TNumber(I.anyOf[0]), true)
    Assert.isEqual(TypeGuard.TString(I.anyOf[1]), true)
  })
  it('Should Index 4', () => {
    const T = Type.Object({
      ab: Type.Number(),
      ac: Type.String(),
    })
    const I = Type.Index(T, Type.TemplateLiteral([Type.Literal('a'), Type.Union([Type.Literal('b'), Type.Literal('c')])]))
    Assert.isEqual(TypeGuard.TUnion(I), true)
    Assert.isEqual(TypeGuard.TNumber(I.anyOf[0]), true)
    Assert.isEqual(TypeGuard.TString(I.anyOf[1]), true)
  })
  it('Should Index 5', () => {
    const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.String() })])
    const I = Type.Index(T, ['x', 'y'])
    Assert.isEqual(TypeGuard.TUnion(I), true)
    Assert.isEqual(TypeGuard.TNumber(I.anyOf[0]), true)
    Assert.isEqual(TypeGuard.TString(I.anyOf[1]), true)
  })
  it('Should Index 6', () => {
    const T = Type.Union([Type.Object({ x: Type.Number() }), Type.Object({ x: Type.String() })])
    const I = Type.Index(T, ['x'])
    Assert.isEqual(TypeGuard.TUnion(I), true)
    Assert.isEqual(TypeGuard.TNumber(I.anyOf[0]), true)
    Assert.isEqual(TypeGuard.TString(I.anyOf[1]), true)
  })
  it('Should Index 7', () => {
    const T = Type.Array(Type.Null())
    const I = Type.Index(T, Type.Number())
    Assert.isEqual(TypeGuard.TNull(I), true)
  })
  it('Should Index 6', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [0])
    Assert.isEqual(TypeGuard.TLiteralString(I), true)
    Assert.isEqual(I.const, 'hello')
  })
  it('Should Index 8', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [1])
    Assert.isEqual(TypeGuard.TLiteralString(I), true)
    Assert.isEqual(I.const, 'world')
  })
  it('Should Index 9', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [0, 1])
    Assert.isEqual(TypeGuard.TUnion(I), true)
    Assert.isEqual(I.anyOf[0].const, 'hello')
    Assert.isEqual(I.anyOf[1].const, 'world')
  })
  it('Should Index 10', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [1, 0])
    Assert.isEqual(TypeGuard.TUnion(I), true)
    Assert.isEqual(I.anyOf[0].const, 'world')
    Assert.isEqual(I.anyOf[1].const, 'hello')
  })
  it('Should Index 11', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [0, 0, 0, 1])
    Assert.isEqual(TypeGuard.TUnion(I), true)
    Assert.isEqual(I.anyOf[0].const, 'hello')
    Assert.isEqual(I.anyOf[1].const, 'hello')
    Assert.isEqual(I.anyOf[2].const, 'hello')
    Assert.isEqual(I.anyOf[3].const, 'world')
  })
  it('Should Index 12', () => {
    const T = Type.Tuple([Type.String(), Type.Boolean()])
    const I = Type.Index(T, Type.Number())
    Assert.isEqual(TypeGuard.TUnion(I), true)
    Assert.isEqual(TypeGuard.TString(I.anyOf[0]), true)
    Assert.isEqual(TypeGuard.TBoolean(I.anyOf[1]), true)
  })
  it('Should Index 13', () => {
    const T = Type.Tuple([Type.String()])
    const I = Type.Index(T, Type.Number())
    Assert.isEqual(TypeGuard.TString(I), true)
  })
  it('Should Index 14', () => {
    const T = Type.Tuple([])
    const I = Type.Index(T, Type.Number())
    Assert.isEqual(TypeGuard.TNever(I), true)
  })
})
