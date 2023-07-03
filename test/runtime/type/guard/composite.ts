import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TComposite', () => {
  it('Should guard for distinct properties', () => {
    const T = Type.Composite([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
    Assert.isEqual(TypeGuard.TNumber(T.properties.x), true)
    Assert.isEqual(TypeGuard.TNumber(T.properties.y), true)
  })
  it('Should guard for overlapping properties', () => {
    const T = Type.Composite([Type.Object({ x: Type.Number() }), Type.Object({ x: Type.Number() })])
    Assert.isEqual(TypeGuard.TIntersect(T.properties.x), true)
    // @ts-ignore
    Assert.isEqual(TypeGuard.TNumber(T.properties.x.allOf[0]), true)
    // @ts-ignore
    Assert.isEqual(TypeGuard.TNumber(T.properties.x.allOf[1]), true)
  })
  it('Should not produce optional property if all properties are not optional', () => {
    const T = Type.Composite([Type.Object({ x: Type.Optional(Type.Number()) }), Type.Object({ x: Type.Number() })])
    Assert.isEqual(TypeGuard.TOptional(T.properties.x), false)
  })
  // Note for: https://github.com/sinclairzx81/typebox/issues/419
  // Determining if a composite property is optional requires a deep check for all properties gathered during a indexed access
  // call. Currently, there isn't a trivial way to perform this check without running into possibly infinite instantiation issues.
  // The optional check is only specific to overlapping properties. Singular properties will continue to work as expected. The
  // rule is "if all composite properties for a key are optional, then the composite property is optional". Defer this test and
  // document as minor breaking change.
  //
  it('Should produce optional property if all composited properties are optional', () => {
    // prettier-ignore
    const T = Type.Composite([
      Type.Object({ x: Type.Optional(Type.Number()) }), 
      Type.Object({ x: Type.Optional(Type.Number()) })
    ])
    Assert.isEqual(TypeGuard.TOptional(T.properties.x), true)
    Assert.isTrue(T.required === undefined)
  })
  it('Should produce required property if some composited properties are not optional', () => {
    // prettier-ignore
    const T = Type.Composite([
      Type.Object({ x: Type.Optional(Type.Number()) }), 
      Type.Object({ x: Type.Number() })
    ])
    Assert.isEqual(TypeGuard.TOptional(T.properties.x), false)
    Assert.isTrue(T.required!.includes('x'))
  })
  it('Should preserve single optional property', () => {
    // prettier-ignore
    const T = Type.Composite([
      Type.Object({ x: Type.Optional(Type.Number()) }), 
    ])
    Assert.isEqual(TypeGuard.TOptional(T.properties.x), true)
    Assert.isTrue(T.required === undefined)
  })
})
