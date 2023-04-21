import { TypeGuard } from '@sinclair/typebox'
import { Type, Kind } from '@sinclair/typebox'
import { Assert } from '../../assert/index.js'

describe('type/guard/TOmit', () => {
  // -------------------------------------------------------------------------
  // case: https://github.com/sinclairzx81/typebox/issues/384
  // -------------------------------------------------------------------------
  it('Should support TUnsafe omit properties with no Kind', () => {
    const T = Type.Omit(Type.Object({ x: Type.Unsafe({ x: 1 }), y: Type.Number() }), ['x'])
    Assert.deepEqual(T.required, ['y'])
  })
  it('Should support TUnsafe omit properties with unregistered Kind', () => {
    const T = Type.Omit(Type.Object({ x: Type.Unsafe({ x: 1, [Kind]: 'UnknownOmitType' }), y: Type.Number() }), ['x'])
    Assert.deepEqual(T.required, ['y'])
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
    Assert.deepEqual(TypeGuard.TNumber(T.properties.y), true)
    Assert.deepEqual(T.required, ['y'])
  })
  it('Should Omit 2', () => {
    const T = Type.Omit(
      Type.Object({
        x: Type.Number(),
        y: Type.Optional(Type.Number()),
      }),
      ['x'],
    )
    Assert.deepEqual(TypeGuard.TNumber(T.properties.y), true)
    Assert.deepEqual(T.required, undefined)
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
    Assert.deepEqual(TypeGuard.TNumber(T.properties.y), true)
    Assert.deepEqual(T.required, ['y'])
  })
  it('Should Omit 4', () => {
    const L = Type.Literal('x')
    const T = Type.Omit(Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })]), L)
    Assert.deepEqual(TypeGuard.TNumber(T.allOf[1].properties.y), true)
    // @ts-ignore
    Assert.deepEqual(T.allOf[1].properties.x, undefined)
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
    Assert.deepEqual(T.properties.x, undefined)
    // @ts-ignore
    Assert.deepEqual(T.properties.y, undefined)
    // @ts-ignore
    Assert.deepEqual(T.required, undefined)
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
    Assert.deepEqual(T.properties.x, undefined)
    // @ts-ignore
    Assert.deepEqual(T.properties.y, undefined)
    // @ts-ignore
    Assert.deepEqual(T.required, undefined)
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
    Assert.deepEqual(TypeGuard.TNumber(T.properties.ad), true)
    Assert.deepEqual(T.required, ['ad'])
  })
})
