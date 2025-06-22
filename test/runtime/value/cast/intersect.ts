import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/cast/Intersect', () => {
  it('Should cast from an invalid object', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }), 
      Type.Object({ y: Type.Number() })
    ])
    const V = Value.Cast(T, 1)
    Assert.IsEqual(V, { x: 0, y: 0 })
  })
  it('Should cast from an partial object and preserve', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }), 
      Type.Object({ y: Type.Number() })
    ])
    const V = Value.Cast(T, { x: 1 })
    Assert.IsEqual(V, { x: 1, y: 0 })
  })
  it('Should cast and use default values', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }), 
      Type.Object({ y: Type.Number({ default: 42 }) })
    ])
    const V = Value.Cast(T, { x: 1 })
    Assert.IsEqual(V, { x: 1, y: 42 })
  })
  it('Should throw with an illogical intersect', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }), 
      Type.Object({ x: Type.String() })
    ])
    Assert.Throws(() => Value.Cast(T, { x: 1 }))
  })
  it('Should throw with an illogical intersect (primative)', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Number(), 
      Type.String()
    ])
    Assert.Throws(() => Value.Cast(T, { x: 1 }))
  })
  it('Should use last intersected default for equivalent sub schemas', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }), 
      Type.Object({ x: Type.Number({ default: 1000 }) })
    ])
    const V = Value.Cast(T, null)
    Assert.IsEqual(V, { x: 1000 })
  })
  it('Should use last intersected default for equivalent sub schemas (primitives)', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Number(), 
      Type.Number({ default: 1000 })
    ])
    const V = Value.Cast(T, null)
    Assert.IsEqual(V, 1000)
  })
  it('Should preserve if default is specified', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Number(), 
      Type.Number({ default: 1000 })
    ])
    const V = Value.Cast(T, 2000)
    Assert.IsEqual(V, 2000)
  })

  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/1264
  // ----------------------------------------------------------------
  it('Should preserve intersected properties', () => {
    const T = Type.Intersect([
      Type.Object({}),
      Type.Object({
        name: Type.String(),
        age: Type.Optional(Type.Number()),
        location: Type.Object({
          lat: Type.Number(),
          long: Type.Number(),
        }),
        greeting: Type.String(),
      }),
    ])
    const V0 = Value.Cast(T, { greeting: 'Hello' })
    const V1 = Value.Cast(T, { location: null, greeting: 'Hello' })
    const V2 = Value.Cast(T, { location: { lat: 1 }, greeting: 'Hello' })
    const V3 = Value.Cast(T, { location: { lat: 1, long: 1 }, greeting: 'Hello' })

    Assert.IsEqual(V0, { name: '', location: { lat: 0, long: 0 }, greeting: 'Hello' })
    Assert.IsEqual(V1, { name: '', location: { lat: 0, long: 0 }, greeting: 'Hello' })
    Assert.IsEqual(V2, { name: '', location: { lat: 1, long: 0 }, greeting: 'Hello' })
    Assert.IsEqual(V3, { name: '', location: { lat: 1, long: 1 }, greeting: 'Hello' })
  })

  // --------------------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/1269#issuecomment-2993924180
  // --------------------------------------------------------------------------
  it('Should Cast with intersected Record', () => {
    const T = Type.Intersect([Type.Record(Type.TemplateLiteral('x-${string}'), Type.Unknown()), Type.Object({ name: Type.String() })])
    const R = Value.Cast(T, {})
    Assert.IsEqual(R, { name: '' })
  })
})
