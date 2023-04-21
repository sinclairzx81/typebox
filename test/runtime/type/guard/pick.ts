import { TypeGuard } from '@sinclair/typebox'
import { Type, Kind } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TPick', () => {
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
    Assert.isEqual(T.required, ['x'])
  })
  it('Should support TUnsafe omit properties with unregistered Kind', () => {
    const T = Type.Pick(Type.Object({ x: Type.Unsafe({ x: 1, [Kind]: 'UnknownPickType' }), y: Type.Number() }), ['x'])
    Assert.isEqual(T.required, ['x'])
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
    Assert.isEqual(TypeGuard.TNumber(T.properties.x), true)
    Assert.isEqual(T.required, ['x'])
  })
  it('Should Pick 2', () => {
    const T = Type.Pick(
      Type.Object({
        x: Type.Optional(Type.Number()),
        y: Type.Number(),
      }),
      ['x'],
    )
    Assert.isEqual(TypeGuard.TNumber(T.properties.x), true)
    Assert.isEqual(T.required, undefined)
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
    Assert.isEqual(TypeGuard.TNumber(T.properties.x), true)
    Assert.isEqual(T.required, ['x'])
  })
  it('Should Pick 4', () => {
    const L = Type.Literal('x')
    const T = Type.Pick(Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })]), L)

    Assert.isEqual(TypeGuard.TNumber(T.allOf[0].properties.x), true)
    // @ts-ignore
    Assert.isEqual(T.allOf[1].properties.y, undefined)
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
    Assert.isEqual(TypeGuard.TNumber(T.properties.x), true)
    Assert.isEqual(TypeGuard.TNumber(T.properties.y), true)
    Assert.isEqual(T.required, ['x', 'y'])
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
    Assert.isEqual(TypeGuard.TNumber(T.properties.x), true)
    Assert.isEqual(TypeGuard.TNumber(T.properties.y), true)
    Assert.isEqual(T.required, ['x', 'y'])
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
    Assert.isEqual(TypeGuard.TNumber(T.properties.ab), true)
    Assert.isEqual(TypeGuard.TNumber(T.properties.ac), true)
    Assert.isEqual(T.required, ['ab', 'ac'])
  })
})
