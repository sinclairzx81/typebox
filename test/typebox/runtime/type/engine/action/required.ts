import { Assert } from 'test'
import * as Type from 'typebox'
import Guard from 'typebox/guard'

const Test = Assert.Context('Type.Engine.Required')
// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Required 1', () => {
  const R = Type.Ref('B')
  const T: Type.TRequiredDeferred<Type.TRef<'B'>> = Type.Required(R)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsTrue(Type.IsRef(T.parameters[0]))
  Assert.IsEqual(T.parameters[0].$ref, 'B')
})
// ------------------------------------------------------------------
// Actions
// ------------------------------------------------------------------
Test('Should Required 2', () => {
  const A = Type.Number()
  const T: Type.TObject<{}> = Type.Required(A)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(Guard.Keys(T.properties), [])
})
Test('Should Required 3', () => {
  const A = Type.Object({
    x: Type.Optional(Type.Number()),
    y: Type.Optional(Type.Number()),
    z: Type.Optional(Type.Number())
  })
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
    z: Type.TNumber
  }> = Type.Required(A)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsTrue(Type.IsNumber(T.properties.z))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.y))
  Assert.IsFalse(Type.IsOptional(T.properties.z))
})
Test('Should Required 4', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Optional(Type.Number()) }),
    Type.Object({ y: Type.Optional(Type.Number()) }),
    Type.Object({ z: Type.Optional(Type.Number()) })
  ])
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
    z: Type.TNumber
  }> = Type.Required(A)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsTrue(Type.IsNumber(T.properties.z))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.y))
  Assert.IsFalse(Type.IsOptional(T.properties.z))
})
Test('Should Required 5', () => {
  const A = Type.Union([
    Type.Object({ x: Type.Optional(Type.Number()) }),
    Type.Object({ y: Type.Optional(Type.Number()) }),
    Type.Object({ z: Type.Optional(Type.Number()) })
  ])
  const T: Type.TUnion<[
    Type.TObject<{
      x: Type.TNumber
    }>,
    Type.TObject<{
      y: Type.TNumber
    }>,
    Type.TObject<{
      z: Type.TNumber
    }>
  ]> = Type.Required(A)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsObject(T.anyOf[0]))
  Assert.IsTrue(Type.IsObject(T.anyOf[1]))
  Assert.IsTrue(Type.IsObject(T.anyOf[2]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0].properties.x))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1].properties.y))
  Assert.IsTrue(Type.IsNumber(T.anyOf[2].properties.z))
  Assert.IsFalse(Type.IsOptional(T.anyOf[0].properties.x))
  Assert.IsFalse(Type.IsOptional(T.anyOf[1].properties.y))
  Assert.IsFalse(Type.IsOptional(T.anyOf[2].properties.z))
})
