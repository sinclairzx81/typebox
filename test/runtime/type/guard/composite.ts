import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TComposite', () => {
  it('Should guard for distinct properties', () => {
    const T = Type.Composite([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
    Assert.IsTrue(TypeGuard.TNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.TNumber(T.properties.y))
  })
  it('Should guard for overlapping properties', () => {
    const T = Type.Composite([Type.Object({ x: Type.Number() }), Type.Object({ x: Type.Number() })])
    Assert.IsTrue(TypeGuard.TIntersect(T.properties.x))
    // @ts-ignore
    Assert.IsTrue(TypeGuard.TNumber(T.properties.x.allOf[0]))
    // @ts-ignore
    Assert.IsTrue(TypeGuard.TNumber(T.properties.x.allOf[1]))
  })
  it('Should not produce optional property if all properties are not optional', () => {
    const T = Type.Composite([Type.Object({ x: Type.Optional(Type.Number()) }), Type.Object({ x: Type.Number() })])
    Assert.IsFalse(TypeGuard.TOptional(T.properties.x))
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
    Assert.IsTrue(TypeGuard.TOptional(T.properties.x))
    Assert.IsEqual(T.required, undefined)
  })
  it('Should produce required property if some composited properties are not optional', () => {
    // prettier-ignore
    const T = Type.Composite([
      Type.Object({ x: Type.Optional(Type.Number()) }), 
      Type.Object({ x: Type.Number() })
    ])
    Assert.IsFalse(TypeGuard.TOptional(T.properties.x))
    Assert.IsTrue(T.required!.includes('x'))
  })
  it('Should preserve single optional property', () => {
    // prettier-ignore
    const T = Type.Composite([
      Type.Object({ x: Type.Optional(Type.Number()) }), 
    ])
    Assert.IsTrue(TypeGuard.TOptional(T.properties.x))
    Assert.IsEqual(T.required, undefined)
  })
})
