import { Assert } from 'test'
import * as Type from 'typebox'
import Guard from 'typebox/guard'

const Test = Assert.Context('Type.Engine.Partial')
// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Partial 1', () => {
  const R = Type.Ref('B')
  const T: Type.TPartialDeferred<Type.TRef<'B'>> = Type.Partial(R)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsTrue(Type.IsRef(T.parameters[0]))
  Assert.IsEqual(T.parameters[0].$ref, 'B')
})
// ------------------------------------------------------------------
// Actions
// ------------------------------------------------------------------
Test('Should Partial 2', () => {
  const A = Type.Number()
  const T: Type.TObject<{}> = Type.Partial(A)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(Guard.Keys(T.properties), [])
})
Test('Should Partial 3', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const T: Type.TObject<{
    x: Type.TOptional<Type.TNumber>
    y: Type.TOptional<Type.TNumber>
    z: Type.TOptional<Type.TNumber>
  }> = Type.Partial(A)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsTrue(Type.IsNumber(T.properties.z))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.y))
  Assert.IsTrue(Type.IsOptional(T.properties.z))
})
Test('Should Partial 4', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T: Type.TObject<{
    x: Type.TOptional<Type.TNumber>
    y: Type.TOptional<Type.TNumber>
    z: Type.TOptional<Type.TNumber>
  }> = Type.Partial(A)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsTrue(Type.IsNumber(T.properties.z))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.y))
  Assert.IsTrue(Type.IsOptional(T.properties.z))
})
Test('Should Partial 5', () => {
  const A = Type.Union([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T: Type.TUnion<[
    Type.TObject<{
      x: Type.TOptional<Type.TNumber>
    }>,
    Type.TObject<{
      y: Type.TOptional<Type.TNumber>
    }>,
    Type.TObject<{
      z: Type.TOptional<Type.TNumber>
    }>
  ]> = Type.Partial(A)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsObject(T.anyOf[0]))
  Assert.IsTrue(Type.IsObject(T.anyOf[1]))
  Assert.IsTrue(Type.IsObject(T.anyOf[2]))

  Assert.IsTrue(Type.IsNumber(T.anyOf[0].properties.x))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1].properties.y))
  Assert.IsTrue(Type.IsNumber(T.anyOf[2].properties.z))

  Assert.IsTrue(Type.IsOptional(T.anyOf[0].properties.x))
  Assert.IsTrue(Type.IsOptional(T.anyOf[1].properties.y))
  Assert.IsTrue(Type.IsOptional(T.anyOf[2].properties.z))
})
