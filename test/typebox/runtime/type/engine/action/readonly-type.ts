import { Assert } from 'test'
import * as Type from 'typebox'
import Guard from 'typebox/guard'

const Test = Assert.Context('Type.Engine.ReadonlyType')
// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should ReadonlyType 1', () => {
  const R = Type.Ref('B')
  const T: Type.TReadonlyTypeDeferred<Type.TRef<'B'>> = Type.ReadonlyType(R)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsTrue(Type.IsRef(T.parameters[0]))
  Assert.IsEqual(T.parameters[0].$ref, 'B')
})
// ------------------------------------------------------------------
// Actions
// ------------------------------------------------------------------
Test('Should ReadonlyType 2', () => {
  const A = Type.Number()
  const T: Type.TObject<{}> = Type.ReadonlyType(A)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(Guard.Keys(T.properties), [])
})
Test('Should ReadonlyType 3', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  const T: Type.TObject<{
    x: Type.TReadonly<Type.TNumber>
    y: Type.TReadonly<Type.TNumber>
    z: Type.TReadonly<Type.TNumber>
  }> = Type.ReadonlyType(A)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsTrue(Type.IsNumber(T.properties.z))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsReadonly(T.properties.y))
  Assert.IsTrue(Type.IsReadonly(T.properties.z))
})
Test('Should ReadonlyType 4', () => {
  const A = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() })
  ])
  const T: Type.TObject<{
    x: Type.TReadonly<Type.TNumber>
    y: Type.TReadonly<Type.TNumber>
    z: Type.TReadonly<Type.TNumber>
  }> = Type.ReadonlyType(A)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsTrue(Type.IsNumber(T.properties.z))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsReadonly(T.properties.y))
  Assert.IsTrue(Type.IsReadonly(T.properties.z))
})
Test('Should ReadonlyType 5', () => {
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
  ]> = Type.ReadonlyType(A)
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
Test('Should ReadonlyType 6', () => {
  const A = Type.Array(Type.Number())
  const T: Type.TArray<Type.TNumber> = Type.ReadonlyType(A)
  Assert.IsTrue(Type.IsArray(T))
  Assert.IsTrue(Type.IsImmutable(T))
})
Test('Should ReadonlyType 7', () => {
  const A = Type.Tuple([Type.Number(), Type.String()])
  const T: Type.TImmutable<Type.TTuple<[Type.TNumber, Type.TString]>> = Type.ReadonlyType(A)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsImmutable(T))
})
// ------------------------------------------------------------------
// Cyclic
// ------------------------------------------------------------------
Test('Should ReadonlyType 8', () => {
  const A = Type.Cyclic({
    X: Type.Tuple([Type.Number(), Type.String()])
  }, 'X')
  const T: Type.TCyclic<{
    X: Type.TImmutable<Type.TTuple<[Type.TNumber, Type.TString]>>
  }, 'X'> = Type.ReadonlyType(A)
  Assert.IsTrue(Type.IsCyclic(T))
  Assert.IsTrue(Type.IsTuple(T.$defs.X))
  Assert.IsTrue(Type.IsImmutable(T.$defs.X))
})
Test('Should ReadonlyType 9', () => {
  const A = Type.Cyclic({
    X: Type.Object({
      x: Type.Number()
    })
  }, 'X')
  const T: Type.TCyclic<{
    X: Type.TObject<{
      x: Type.TReadonly<Type.TNumber>
    }>
  }, 'X'> = Type.ReadonlyType(A)
  Assert.IsTrue(Type.IsCyclic(T))
  Assert.IsTrue(Type.IsObject(T.$defs.X))
  Assert.IsTrue(Type.IsReadonly(T.$defs.X.properties.x))
})
