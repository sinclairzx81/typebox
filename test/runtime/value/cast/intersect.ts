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
    Assert.deepEqual(V, { x: 0, y: 0 })
  })
  it('Should cast from an partial object and preserve', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }), 
      Type.Object({ y: Type.Number() })
    ])
    const V = Value.Cast(T, { x: 1 })
    Assert.deepEqual(V, { x: 1, y: 0 })
  })
  it('Should cast and use default values', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }), 
      Type.Object({ y: Type.Number({ default: 42 }) })
    ])
    const V = Value.Cast(T, { x: 1 })
    Assert.deepEqual(V, { x: 1, y: 42 })
  })
  it('Should throw with an illogical intersect', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }), 
      Type.Object({ x: Type.String() })
    ])
    Assert.throws(() => Value.Cast(T, { x: 1 }))
  })
  it('Should throw with an illogical intersect (primative)', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Number(), 
      Type.String()
    ])
    Assert.throws(() => Value.Cast(T, { x: 1 }))
  })
  it('Should use last intersected default for equivalent sub schemas', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Object({ x: Type.Number() }), 
      Type.Object({ x: Type.Number({ default: 1000 }) })
    ])
    const V = Value.Cast(T, null)
    Assert.deepEqual(V, { x: 1000 })
  })
  it('Should use last intersected default for equivalent sub schemas (primitives)', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Number(), 
      Type.Number({ default: 1000 })
    ])
    const V = Value.Cast(T, null)
    Assert.deepEqual(V, 1000)
  })
  it('Should preserve if default is specified', () => {
    // prettier-ignore
    const T = Type.Intersect([
      Type.Number(), 
      Type.Number({ default: 1000 })
    ])
    const V = Value.Cast(T, 2000)
    Assert.deepEqual(V, 2000)
  })
})
