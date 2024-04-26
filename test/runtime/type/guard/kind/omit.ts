import { KindGuard, Type, Kind, TransformKind } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TOmit', () => {
  // -------------------------------------------------------------------------
  // case: https://github.com/sinclairzx81/typebox/issues/384
  // -------------------------------------------------------------------------
  it('Should support TUnsafe omit properties with no Kind', () => {
    const T = Type.Omit(Type.Object({ x: Type.Unsafe({ x: 1 }), y: Type.Number() }), ['x'])
    Assert.IsEqual(T.required, ['y'])
  })
  it('Should support TUnsafe omit properties with unregistered Kind', () => {
    const T = Type.Omit(Type.Object({ x: Type.Unsafe({ x: 1, [Kind]: 'UnknownOmitType' }), y: Type.Number() }), ['x'])
    Assert.IsEqual(T.required, ['y'])
  })
  // -------------------------------------------------------------------------
  // Standard Tests
  // -------------------------------------------------------------------------
  it('Should Omit 1', () => {
    const T = Type.Omit(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
      ['x'],
    )
    Assert.IsTrue(KindGuard.IsNumber(T.properties.y))
    Assert.IsEqual(T.required, ['y'])
  })
  it('Should Omit 2', () => {
    const T = Type.Omit(
      Type.Object({
        x: Type.Number(),
        y: Type.Optional(Type.Number()),
      }),
      ['x'],
    )
    Assert.IsTrue(KindGuard.IsNumber(T.properties.y))
    Assert.IsEqual(T.required, undefined)
  })
  it('Should Omit 3', () => {
    const L = Type.Literal('x')
    const T = Type.Omit(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
      L,
    )
    Assert.IsTrue(KindGuard.IsNumber(T.properties.y))
    Assert.IsEqual(T.required, ['y'])
  })
  it('Should Omit 4', () => {
    const L = Type.Literal('x')
    const T = Type.Omit(Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })]), L)
    Assert.IsEqual(KindGuard.IsNumber(T.allOf[1].properties.y), true)
    // @ts-ignore
    Assert.IsEqual(T.allOf[1].properties.x, undefined)
  })
  it('Should Omit 5', () => {
    const L = Type.Union([Type.Literal('x'), Type.Literal('y')])
    const T = Type.Omit(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
      L,
    )
    // @ts-ignore
    Assert.IsEqual(T.properties.x, undefined)
    // @ts-ignore
    Assert.IsEqual(T.properties.y, undefined)
    // @ts-ignore
    Assert.IsEqual(T.required, undefined)
  })
  it('Should Omit 6', () => {
    const L = Type.Union([Type.Literal('x'), Type.Literal('y'), Type.Literal('z')])
    const T = Type.Omit(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
      L,
    )
    // @ts-ignore
    Assert.IsEqual(T.properties.x, undefined)
    // @ts-ignore
    Assert.IsEqual(T.properties.y, undefined)
    // @ts-ignore
    Assert.IsEqual(T.required, undefined)
  })
  it('Should Omit 7', () => {
    const L = Type.TemplateLiteral([Type.Literal('a'), Type.Union([Type.Literal('b'), Type.Literal('c')])])
    const T = Type.Omit(
      Type.Object({
        ab: Type.Number(),
        ac: Type.Number(),
        ad: Type.Number(),
      }),
      L,
    )
    Assert.IsTrue(KindGuard.IsNumber(T.properties.ad))
    Assert.IsEqual(T.required, ['ad'])
  })
  // ----------------------------------------------------------------
  // Discard
  // ----------------------------------------------------------------
  it('Should override $id', () => {
    const A = Type.Object({ x: Type.Number() }, { $id: 'A' })
    const T = Type.Omit(A, ['x'], { $id: 'T' })
    Assert.IsEqual(T.$id!, 'T')
  })
  it('Should discard $id', () => {
    const A = Type.Object({ x: Type.Number() }, { $id: 'A' })
    const T = Type.Omit(A, ['x'])
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
    const R = Type.Omit(S, ['x'])
    Assert.IsFalse(TransformKind in R)
  })
})
