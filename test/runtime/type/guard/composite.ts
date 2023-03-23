import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TComposite', () => {
  it('Should guard for distinct properties', () => {
    const T = Type.Composite([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
    Assert.equal(TypeGuard.TNumber(T.properties.x), true)
    Assert.equal(TypeGuard.TNumber(T.properties.y), true)
  })
  it('Should guard for overlapping properties', () => {
    const T = Type.Composite([Type.Object({ x: Type.Number() }), Type.Object({ x: Type.Number() })])
    Assert.equal(TypeGuard.TNumber(T.properties.x), true)
  })
  it('Should guard for illogical intersection and yield never', () => {
    const T = Type.Composite([Type.Object({ x: Type.Number() }), Type.Object({ x: Type.String() })])
    Assert.equal(TypeGuard.TNever(T.properties.x), true)
  })
  it('Should not produce optional property if all properties are not optional', () => {
    const T = Type.Composite([Type.Object({ x: Type.Optional(Type.Number()) }), Type.Object({ x: Type.Number() })])
    Assert.equal(TypeGuard.TOptional(T.properties.x), false)
  })
  it('Should produce optional property if all properties are optional', () => {
    const T = Type.Composite([Type.Object({ x: Type.Optional(Type.Number()) }), Type.Object({ x: Type.Optional(Type.Number()) })])
    Assert.equal(TypeGuard.TOptional(T.properties.x), true)
  })
})
