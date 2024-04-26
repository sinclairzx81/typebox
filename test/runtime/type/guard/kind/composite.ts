import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TComposite', () => {
  it('Should guard for distinct properties', () => {
    const T = Type.Composite([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
    Assert.IsTrue(KindGuard.IsNumber(T.properties.x))
    Assert.IsTrue(KindGuard.IsNumber(T.properties.y))
  })
  it('Should guard for overlapping properties', () => {
    const T = Type.Composite([Type.Object({ x: Type.Number() }), Type.Object({ x: Type.Number() })])
    Assert.IsTrue(KindGuard.IsIntersect(T.properties.x))
    // @ts-ignore
    Assert.IsTrue(KindGuard.IsNumber(T.properties.x.allOf[0]))
    // @ts-ignore
    Assert.IsTrue(KindGuard.IsNumber(T.properties.x.allOf[1]))
  })
  it('Should not produce optional property if all properties are not optional', () => {
    const T = Type.Composite([Type.Object({ x: Type.Optional(Type.Number()) }), Type.Object({ x: Type.Number() })])
    Assert.IsFalse(KindGuard.IsOptional(T.properties.x))
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
    Assert.IsTrue(KindGuard.IsOptional(T.properties.x))
    Assert.IsEqual(T.required, undefined)
  })
  // prettier-ignore
  it('Should produce required property if some composited properties are not optional', () => {
    const T = Type.Composite([
      Type.Object({ x: Type.Optional(Type.Number()) }), 
      Type.Object({ x: Type.Number() })
    ])
    Assert.IsFalse(KindGuard.IsOptional(T.properties.x))
    Assert.IsTrue(T.required!.includes('x'))
  })
  // prettier-ignore
  it('Should preserve single optional property', () => {
    const T = Type.Composite([
      Type.Object({ x: Type.Optional(Type.Number()) }), 
    ])
    Assert.IsTrue(KindGuard.IsOptional(T.properties.x))
    Assert.IsEqual(T.required, undefined)
  })
  // ----------------------------------------------------------------
  // Intersect
  // ----------------------------------------------------------------
  // prettier-ignore
  it('Should composite Intersect 1', () => {
    const T = Type.Composite([
      Type.Intersect([
        Type.Object({ x: Type.Number() }),
        Type.Object({ y: Type.Number() }),
      ]),
      Type.Intersect([
        Type.Object({ z: Type.Number() }),
      ])
    ])
    Assert.IsEqual(T, Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    }))
  })
  // prettier-ignore
  it('Should composite Intersect 2', () => {
    const T = Type.Composite([
      Type.Intersect([
        Type.Object({ x: Type.Number() }),
        Type.Object({ x: Type.Number() }),
      ]),
      Type.Intersect([
        Type.Object({ x: Type.Number() }),
      ])
    ])
    Assert.IsEqual(T, Type.Object({
      x: Type.Intersect([Type.Intersect([Type.Number(), Type.Number()]), Type.Number()])
    }))
  })
  // prettier-ignore
  it('Should composite Intersect 3', () => {
    const T = Type.Composite([
      Type.Number(),
      Type.Boolean()
    ])
    Assert.IsEqual(T, Type.Object({}))
  })
  // prettier-ignore
  it('Should composite Intersect 4', () => {
    const T = Type.Composite([
      Type.Number(),
      Type.Boolean(),
      Type.Object({ x: Type.String() })
    ])
    Assert.IsEqual(T, Type.Object({
      x: Type.String()
    }))
  })
  // prettier-ignore
  it('Should composite Intersect 5', () => {
    const T = Type.Composite([
      Type.Object({ x: Type.Optional(Type.String()) }),
      Type.Object({ x: Type.String() })
    ])
    Assert.IsEqual(T, Type.Object({
      x: Type.Intersect([Type.String(), Type.String()])
    }))
  })
  // prettier-ignore
  it('Should composite Intersect 6', () => {
    const T = Type.Composite([
      Type.Object({ x: Type.Optional(Type.String()) }),
      Type.Object({ x: Type.Optional(Type.String()) })
    ])
    Assert.IsEqual(T, Type.Object({
      x: Type.Optional(Type.Intersect([Type.String(), Type.String()]))
    }))
  })
  // ----------------------------------------------------------------
  // Union
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/789
  // prettier-ignore
  it('Should composite Union 1 (non-overlapping)', () => {
    const T = Type.Composite([
      Type.Union([
        Type.Object({ x: Type.Number() }),
        Type.Object({ y: Type.Number() }),
      ]),
      Type.Union([
        Type.Object({ z: Type.Number() }),
      ])
    ])
    Assert.IsEqual(T, Type.Object({
      z: Type.Number()
    }))
  })
  // https://github.com/sinclairzx81/typebox/issues/789
  // prettier-ignore
  it('Should composite Union 2 (overlapping)', () => {
    const T = Type.Composite([
      Type.Union([
        Type.Object({ x: Type.Number() }),
        Type.Object({ x: Type.Number() }),
      ]),
      Type.Union([
        Type.Object({ x: Type.Number() }),
      ])
    ])
    Assert.IsEqual(T, Type.Object({
      x: Type.Intersect([Type.Union([Type.Number(), Type.Number()]), Type.Number()])
    }))
  })
})
