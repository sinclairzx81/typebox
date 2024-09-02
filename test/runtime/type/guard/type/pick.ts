import { TypeGuard, Type, Kind, TransformKind } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TPick', () => {
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
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
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
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
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
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsEqual(T.required, ['x'])
  })
  it('Should Pick 4', () => {
    const L = Type.Literal('x')
    const T = Type.Pick(Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })]), L)

    Assert.IsTrue(TypeGuard.IsNumber(T.allOf[0].properties.x))
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
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
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
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
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
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.ab))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.ac))
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
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/944
  // ----------------------------------------------------------------
  it('Should retain interior properties 1', () => {
    const A = Type.Object({ x: Type.Number() }, { additionalProperties: false })
    const T = Type.Pick(A, ['x'])
    Assert.IsFalse(T.additionalProperties as boolean)
  })
  it('Should retain interior properties 2', () => {
    const A = Type.Object({ x: Type.Number() }, { additionalProperties: false })
    const B = Type.Object({ y: Type.Number() }, { additionalProperties: false })
    const U = Type.Union([A, B])
    const T = Type.Pick(U, ['x'])
    Assert.IsFalse(T.anyOf[0].additionalProperties as boolean)
    Assert.IsFalse(T.anyOf[1].additionalProperties as boolean)
  })
  it('Should retain interior properties 3', () => {
    const A = Type.Object({ x: Type.Number() }, { additionalProperties: false })
    const B = Type.Object({ y: Type.Number() }, { additionalProperties: false })
    const U = Type.Intersect([A, B])
    const T = Type.Pick(U, ['x'])
    Assert.IsFalse(T.allOf[0].additionalProperties as boolean)
    Assert.IsFalse(T.allOf[1].additionalProperties as boolean)
  })
  it('Should retain interior properties 4', () => {
    const A = Type.Object({ x: Type.Number(), y: Type.Number() }, { additionalProperties: false })
    const T = Type.Mapped(Type.TemplateLiteral('${x|y|z}'), (_) => Type.Pick(A, ['x']))
    Assert.IsFalse(T.properties.x.additionalProperties as boolean)
    Assert.IsFalse(T.properties.y.additionalProperties as boolean)
    Assert.IsFalse(T.properties.z.additionalProperties as boolean)
  })
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/980
  // ----------------------------------------------------------------
  it('Should override properties in source type', () => {
    const A = Type.Object({ x: Type.Number() }, { title: 'A' })
    const B = Type.Pick(A, ['x'], { title: 'B' })
    Assert.IsEqual(A.title, 'A')
    Assert.IsEqual(B.title, 'B')
  })
})
