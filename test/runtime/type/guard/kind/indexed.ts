import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TIndex', () => {
  it('Should Index 1', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
    })
    const I = Type.Index(T, ['x'])
    Assert.IsTrue(KindGuard.IsNumber(I))
  })
  it('Should Index 2', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
    })
    const I = Type.Index(T, ['x', 'y'])
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsNumber(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsString(I.anyOf[1]))
  })
  it('Should Index 3', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
    })
    const I = Type.Index(T, Type.KeyOf(T))
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsNumber(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsString(I.anyOf[1]))
  })
  it('Should Index 4', () => {
    const T = Type.Object({
      ab: Type.Number(),
      ac: Type.String(),
    })
    const I = Type.Index(T, Type.TemplateLiteral([Type.Literal('a'), Type.Union([Type.Literal('b'), Type.Literal('c')])]))
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsNumber(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsString(I.anyOf[1]))
  })
  it('Should Index 5', () => {
    const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.String() })])
    const I = Type.Index(T, ['x', 'y'])
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsNumber(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsString(I.anyOf[1]))
  })
  it('Should Index 6', () => {
    const T = Type.Union([Type.Object({ x: Type.Number() }), Type.Object({ x: Type.String() })])
    const I = Type.Index(T, ['x'])
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsNumber(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsString(I.anyOf[1]))
  })
  it('Should Index 7', () => {
    const T = Type.Array(Type.Null())
    const I = Type.Index(T, Type.Number())
    Assert.IsTrue(KindGuard.IsNull(I))
  })
  it('Should Index 6', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [0])
    Assert.IsTrue(KindGuard.IsLiteralString(I))
    Assert.IsEqual(I.const, 'hello')
  })
  it('Should Index 8', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [1])
    Assert.IsTrue(KindGuard.IsLiteralString(I))
    Assert.IsEqual(I.const, 'world')
  })
  it('Should Index 9', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [0, 1])
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsEqual(I.anyOf[0].const, 'hello')
    Assert.IsEqual(I.anyOf[1].const, 'world')
  })
  it('Should Index 10', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [1, 0])
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsEqual(I.anyOf[0].const, 'world')
    Assert.IsEqual(I.anyOf[1].const, 'hello')
  })
  it('Should Index 11', () => {
    const T = Type.Tuple([Type.Literal('hello'), Type.Literal('world')])
    const I = Type.Index(T, [0, 0, 0, 1])
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsEqual(I.anyOf[0].const, 'hello')
    Assert.IsEqual(I.anyOf[1].const, 'hello')
    Assert.IsEqual(I.anyOf[2].const, 'hello')
    Assert.IsEqual(I.anyOf[3].const, 'world')
  })
  it('Should Index 12', () => {
    const T = Type.Tuple([Type.String(), Type.Boolean()])
    const I = Type.Index(T, Type.Number())
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsBoolean(I.anyOf[1]))
  })
  it('Should Index 13', () => {
    const T = Type.Tuple([Type.String()])
    const I = Type.Index(T, Type.Number())
    Assert.IsTrue(KindGuard.IsString(I))
  })
  it('Should Index 14', () => {
    const T = Type.Tuple([])
    const I = Type.Index(T, Type.Number())
    Assert.IsTrue(KindGuard.IsNever(I))
  })
  it('Should Index 15', () => {
    const T = Type.Object({
      0: Type.Number(),
    })
    const I = Type.Index(T, Type.Literal(0))
    Assert.IsTrue(KindGuard.IsNumber(I))
  })
  it('Should Index 16', () => {
    const T = Type.Object({
      0: Type.Number(),
    })
    const I = Type.Index(T, Type.Literal('0'))
    Assert.IsTrue(KindGuard.IsNumber(I))
  })
  it('Should Index 17', () => {
    const T = Type.Object({
      '0': Type.Number(),
    })
    const I = Type.Index(T, Type.Literal(0))
    Assert.IsTrue(KindGuard.IsNumber(I))
  })
  it('Should Index 18', () => {
    const T = Type.Object({
      '0': Type.Number(),
    })
    const I = Type.Index(T, Type.Literal('0'))
    Assert.IsTrue(KindGuard.IsNumber(I))
  })
  it('Should Index 19', () => {
    const T = Type.Object({
      0: Type.Number(),
      1: Type.String(),
      2: Type.Boolean(),
    })
    const I = Type.Index(T, Type.Union([Type.Literal(0), Type.Literal(2)]))
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsNumber(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsBoolean(I.anyOf[1]))
  })
  it('Should Index 20', () => {
    const T = Type.Object({
      0: Type.Number(),
      1: Type.String(),
      2: Type.Boolean(),
    })
    const I = Type.Index(T, Type.BigInt())
    Assert.IsTrue(KindGuard.IsNever(I))
  })
  it('Should Index 21', () => {
    const T = Type.Object({
      0: Type.Number(),
      1: Type.String(),
      2: Type.Boolean(),
    })
    const I = Type.Index(T, Type.Object({}))
    Assert.IsTrue(KindGuard.IsNever(I))
  })
  it('Should Index 22', () => {
    const A = Type.Object({ x: Type.Literal('A') })
    const B = Type.Object({ x: Type.Literal('B') })
    const C = Type.Object({ x: Type.Literal('C') })
    const D = Type.Object({ x: Type.Literal('D') })
    const T = Type.Intersect([A, B, C, D])
    const I = Type.Index(T, ['x'])
    Assert.IsTrue(KindGuard.IsIntersect(I))
    Assert.IsTrue(KindGuard.IsLiteral(I.allOf[0]))
    Assert.IsTrue(KindGuard.IsLiteral(I.allOf[1]))
    Assert.IsTrue(KindGuard.IsLiteral(I.allOf[2]))
    Assert.IsTrue(KindGuard.IsLiteral(I.allOf[3]))
  })
  it('Should Index 23', () => {
    const A = Type.Object({ x: Type.Literal('A') })
    const B = Type.Object({ x: Type.Literal('B') })
    const C = Type.Object({ x: Type.Literal('C') })
    const D = Type.Object({ x: Type.Literal('D') })
    const T = Type.Union([A, B, C, D])
    const I = Type.Index(T, ['x'])
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsLiteral(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsLiteral(I.anyOf[1]))
    Assert.IsTrue(KindGuard.IsLiteral(I.anyOf[2]))
    Assert.IsTrue(KindGuard.IsLiteral(I.anyOf[3]))
  })
  it('Should Index 24', () => {
    const A = Type.Object({ x: Type.Literal('A'), y: Type.Number() })
    const B = Type.Object({ x: Type.Literal('B') })
    const C = Type.Object({ x: Type.Literal('C') })
    const D = Type.Object({ x: Type.Literal('D') })
    const T = Type.Intersect([A, B, C, D])
    const I = Type.Index(T, ['x', 'y'])
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsIntersect(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsNumber(I.anyOf[1]))
  })
  it('Should Index 25', () => {
    const A = Type.Object({ x: Type.Literal('A'), y: Type.Number() })
    const B = Type.Object({ x: Type.Literal('B'), y: Type.String() })
    const C = Type.Object({ x: Type.Literal('C') })
    const D = Type.Object({ x: Type.Literal('D') })
    const T = Type.Intersect([A, B, C, D])
    const I = Type.Index(T, ['x', 'y'])
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsIntersect(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsIntersect(I.anyOf[1]))
    Assert.IsTrue(KindGuard.IsNumber(I.anyOf[1].allOf[0]))
    Assert.IsTrue(KindGuard.IsString(I.anyOf[1].allOf[1]))
  })
  it('Should Index 26', () => {
    const T = Type.Recursive((This) =>
      Type.Object({
        x: Type.String(),
        y: Type.Number(),
        z: This,
      }),
    )
    const I = Type.Index(T, ['x', 'y', 'z'])
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsNumber(I.anyOf[1]))
    Assert.IsTrue(KindGuard.IsThis(I.anyOf[2]))
  })
  it('Should Index 27', () => {
    const T = Type.Object({
      0: Type.String(),
      1: Type.Number(),
    })
    const I = Type.Index(T, [0, 1])
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsNumber(I.anyOf[1]))
  })
  it('Should Index 28', () => {
    const T = Type.Object({
      0: Type.String(),
      '1': Type.Number(),
    })
    const I = Type.Index(T, [0, '1'])
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsNumber(I.anyOf[1]))
  })
  it('Should Index 29', () => {
    const T = Type.Object({
      0: Type.String(),
      '1': Type.Number(),
    })
    const I = Type.Index(T, Type.Union([Type.Literal(0), Type.Literal('1')]))
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsNumber(I.anyOf[1]))
  })
  it('Should Index 30', () => {
    const T = Type.Object({
      0: Type.String(),
      '1': Type.Number(),
    })
    const I = Type.Index(T, Type.Union([Type.Literal(0), Type.Literal(1)]))
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsNumber(I.anyOf[1]))
    // Note: Expect TNever for anyOf[1] but permit for TNumber due to IndexedAccess
    // Resolve() which currently cannot differentiate between string and numeric keys
    // on the object. This may be resolvable in later revisions, but test for this
    // fall-through to ensure case is documented. For review.
  })
  // --------------------------------------------------------
  // Modifier Optional Indexing
  // --------------------------------------------------------
  it('Should Index 31', () => {
    const T = Type.Object({
      x: Type.Optional(Type.String()),
      y: Type.Number(),
    })
    const I = Type.Index(T, ['x'])
    Assert.IsTrue(KindGuard.IsOptional(I))
    Assert.IsTrue(KindGuard.IsString(I))
  })
  it('Should Index 32', () => {
    const T = Type.Object({
      x: Type.Optional(Type.String()),
      y: Type.Number(),
    })
    const I = Type.Index(T, ['y'])
    Assert.IsFalse(KindGuard.IsOptional(I))
    Assert.IsTrue(KindGuard.IsNumber(I))
  })
  it('Should Index 33', () => {
    const T = Type.Object({
      x: Type.Optional(Type.String()),
      y: Type.Number(),
    })
    const I = Type.Index(T, ['x', 'y'])
    Assert.IsTrue(KindGuard.IsOptional(I))
    Assert.IsTrue(KindGuard.IsUnion(I))
    Assert.IsTrue(KindGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(KindGuard.IsNumber(I.anyOf[1]))
  })
  it('Should Index 34', () => {
    const T = Type.String()
    const I = Type.Index(T, ['x'])
    Assert.IsTrue(KindGuard.IsNever(I))
  })
  it('Should Index 35', () => {
    const T = Type.Array(Type.String())
    const I = Type.Index(T, Type.Number())
    Assert.IsTrue(KindGuard.IsString(I))
  })
  it('Should Index 36', () => {
    const T = Type.Array(Type.String())
    const I = Type.Index(T, ['[number]'])
    Assert.IsTrue(KindGuard.IsString(I))
  })
})
