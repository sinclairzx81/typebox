import { KindGuard, Type, Kind, TransformKind } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TPick', () => {
  // -------------------------------------------------------------------------
  // case: https://github.com/sinclairzx81/typebox/issues/384
  // -------------------------------------------------------------------------
  it('Should support TUnsafe omit properties with no Kind', () => {
    const T = Type.Pick(
      Type.Object({
        x: Type.Unsafe({ x: 1 }),
        y: Type.Number(),
      }),
      ['x'],
    )
    Assert.IsEqual(T.required, ['x'])
  })
  it('Should support TUnsafe omit properties with unregistered Kind', () => {
    const T = Type.Pick(Type.Object({ x: Type.Unsafe({ x: 1, [Kind]: 'UnknownPickType' }), y: Type.Number() }), ['x'])
    Assert.IsEqual(T.required, ['x'])
  })
  // -------------------------------------------------------------------------
  // Standard Tests
  // -------------------------------------------------------------------------
  it('Should Pick 1', () => {
    const T = Type.Pick(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
      ['x'],
    )
    Assert.IsTrue(KindGuard.IsNumber(T.properties.x))
    Assert.IsEqual(T.required, ['x'])
  })
  it('Should Pick 2', () => {
    const T = Type.Pick(
      Type.Object({
        x: Type.Optional(Type.Number()),
        y: Type.Number(),
      }),
      ['x'],
    )
    Assert.IsTrue(KindGuard.IsNumber(T.properties.x))
    Assert.IsEqual(T.required, undefined)
  })
  it('Should Pick 3', () => {
    const L = Type.Literal('x')
    const T = Type.Pick(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
      L,
    )
    Assert.IsTrue(KindGuard.IsNumber(T.properties.x))
    Assert.IsEqual(T.required, ['x'])
  })
  it('Should Pick 4', () => {
    const L = Type.Literal('x')
    const T = Type.Pick(Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })]), L)

    Assert.IsTrue(KindGuard.IsNumber(T.allOf[0].properties.x))
    // @ts-ignore
    Assert.IsEqual(T.allOf[1].properties.y, undefined)
  })
  it('Should Pick 5', () => {
    const L = Type.Union([Type.Literal('x'), Type.Literal('y')])
    const T = Type.Pick(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
      L,
    )
    Assert.IsTrue(KindGuard.IsNumber(T.properties.x))
    Assert.IsTrue(KindGuard.IsNumber(T.properties.y))
    Assert.IsEqual(T.required, ['x', 'y'])
  })
  it('Should Pick 6', () => {
    const L = Type.Union([Type.Literal('x'), Type.Literal('y'), Type.Literal('z')])
    const T = Type.Pick(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
      L,
    )
    Assert.IsTrue(KindGuard.IsNumber(T.properties.x))
    Assert.IsTrue(KindGuard.IsNumber(T.properties.y))
    Assert.IsEqual(T.required, ['x', 'y'])
  })
  it('Should Pick 7', () => {
    const L = Type.TemplateLiteral([Type.Literal('a'), Type.Union([Type.Literal('b'), Type.Literal('c')])])
    const T = Type.Pick(
      Type.Object({
        ab: Type.Number(),
        ac: Type.Number(),
        ad: Type.Number(),
      }),
      L,
    )
    Assert.IsTrue(KindGuard.IsNumber(T.properties.ab))
    Assert.IsTrue(KindGuard.IsNumber(T.properties.ac))
    Assert.IsEqual(T.required, ['ab', 'ac'])
  })
  // ----------------------------------------------------------------
  // Discard
  // ----------------------------------------------------------------
  it('Should override $id', () => {
    const A = Type.Object({ x: Type.Number() }, { $id: 'A' })
    const T = Type.Pick(A, ['x'], { $id: 'T' })
    Assert.IsEqual(T.$id!, 'T')
  })
  it('Should discard $id', () => {
    const A = Type.Object({ x: Type.Number() }, { $id: 'A' })
    const T = Type.Pick(A, ['x'])
    Assert.IsFalse('$id' in T)
  })
  it('Should discard transform', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
    })
    const S = Type.Transform(T)
      .Decode((value) => value)
      .Encode((value) => value)
    const R = Type.Pick(S, ['x'])
    Assert.IsFalse(TransformKind in R)
  })
})
