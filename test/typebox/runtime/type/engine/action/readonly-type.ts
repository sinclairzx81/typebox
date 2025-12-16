import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.ReadonlyObject')
// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should ReadonlyObject 1', () => {
  const R = Type.Ref('B')
  const T: Type.TReadonlyObjectDeferred<Type.TRef<'B'>> = Type.ReadonlyObject(R)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsTrue(Type.IsRef(T.parameters[0]))
  Assert.IsEqual(T.parameters[0].$ref, 'B')
})
// ------------------------------------------------------------------
// Actions
// ------------------------------------------------------------------
Test('Should ReadonlyObject 2', () => {
  const A = Type.Number()
  const T: Type.TNumber = Type.ReadonlyObject(A)
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should ReadonlyObject 3', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const T: Type.TObject<{
    x: Type.TReadonly<Type.TNumber>
    y: Type.TReadonly<Type.TNumber>
    z: Type.TReadonly<Type.TNumber>
  }> = Type.ReadonlyObject(A)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsTrue(Type.IsNumber(T.properties.z))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsReadonly(T.properties.y))
  Assert.IsTrue(Type.IsReadonly(T.properties.z))
})
Test('Should ReadonlyObject 4', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T: Type.TObject<{
    x: Type.TReadonly<Type.TNumber>
    y: Type.TReadonly<Type.TNumber>
    z: Type.TReadonly<Type.TNumber>
  }> = Type.ReadonlyObject(A)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsTrue(Type.IsNumber(T.properties.z))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsReadonly(T.properties.y))
  Assert.IsTrue(Type.IsReadonly(T.properties.z))
})
Test('Should ReadonlyObject 5', () => {
  const A = Type.Union([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T: Type.TUnion<[
    Type.TObject<{
      x: Type.TReadonly<Type.TNumber>
    }>,
    Type.TObject<{
      y: Type.TReadonly<Type.TNumber>
    }>,
    Type.TObject<{
      z: Type.TReadonly<Type.TNumber>
    }>
  ]> = Type.ReadonlyObject(A)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsObject(T.anyOf[0]))
  Assert.IsTrue(Type.IsObject(T.anyOf[1]))
  Assert.IsTrue(Type.IsObject(T.anyOf[2]))

  Assert.IsTrue(Type.IsNumber(T.anyOf[0].properties.x))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1].properties.y))
  Assert.IsTrue(Type.IsNumber(T.anyOf[2].properties.z))

  Assert.IsTrue(Type.IsReadonly(T.anyOf[0].properties.x))
  Assert.IsTrue(Type.IsReadonly(T.anyOf[1].properties.y))
  Assert.IsTrue(Type.IsReadonly(T.anyOf[2].properties.z))
})
// ------------------------------------------------------------------
// Immutable
// ------------------------------------------------------------------
Test('Should ReadonlyObject 6', () => {
  const A = Type.Array(Type.Number())
  const T: Type.TArray<Type.TNumber> = Type.ReadonlyObject(A)
  Assert.IsTrue(Type.IsArray(T))
  Assert.IsTrue(Type.IsImmutable(T))
})
Test('Should ReadonlyObject 7', () => {
  const A = Type.Tuple([Type.Number(), Type.String()])
  const T: Type.TImmutable<Type.TTuple<[Type.TNumber, Type.TString]>> = Type.ReadonlyObject(A)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsImmutable(T))
})
// ------------------------------------------------------------------
// Cyclic
// ------------------------------------------------------------------
Test('Should ReadonlyObject 8', () => {
  const A = Type.Cyclic({
    X: Type.Tuple([Type.Number(), Type.String()])
  }, 'X')
  const T: Type.TCyclic<{
    X: Type.TImmutable<Type.TTuple<[Type.TNumber, Type.TString]>>
  }, 'X'> = Type.ReadonlyObject(A)
  Assert.IsTrue(Type.IsCyclic(T))
  Assert.IsTrue(Type.IsTuple(T.$defs.X))
  Assert.IsTrue(Type.IsImmutable(T.$defs.X))
})
Test('Should ReadonlyObject 9', () => {
  const A = Type.Cyclic({
    X: Type.Object({
      x: Type.Number()
    })
  }, 'X')
  const T: Type.TCyclic<{
    X: Type.TObject<{
      x: Type.TReadonly<Type.TNumber>
    }>
  }, 'X'> = Type.ReadonlyObject(A)
  Assert.IsTrue(Type.IsCyclic(T))
  Assert.IsTrue(Type.IsObject(T.$defs.X))
  Assert.IsTrue(Type.IsReadonly(T.$defs.X.properties.x))
})
