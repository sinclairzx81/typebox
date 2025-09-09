import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Intersect')

Test('Should Intersect 1', () => {
  const T: Type.TNull = Type.Script('null')
  Assert.IsFalse(Type.IsIntersect(T))
})
Test('Should Intersect 2', () => {
  const T: Type.TIntersect<[Type.TNull, Type.TNumber]> = Type.Script('null & number')
  Assert.IsTrue(Type.IsIntersect(T))
  Assert.IsTrue(Type.IsNull(T.allOf[0]))
  Assert.IsTrue(Type.IsNumber(T.allOf[1]))
})
Test('Should Intersect 3', () => {
  const T: Type.TIntersect<[Type.TNull, Type.TNumber]> = Type.Script('Options<null & number, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Intersect 4', () => {
  const T: Type.TIntersect<[Type.TNull, Type.TNumber]> = Type.Script('Options<null & number, { a: 1, b: 2 }>')
  const O = Type.IntersectOptions(T)
  Assert.IsFalse(Type.IsIntersect(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
Test('Should Intersect 5', () => {
  const T: Type.TIntersect<[
    Type.TIntersect<[
      Type.TObject<{
        x: Type.TNumber
      }>,
      Type.TObject<{
        y: Type.TNumber
      }>
    ]>,
    Type.TObject<{
      z: Type.TNumber
    }>
  ]> = Type.Script('({ x: number } & { y: number }) & { z: number }')

  Assert.IsTrue(Type.IsIntersect(T))
  Assert.IsTrue(Type.IsIntersect(T.allOf[0]))
  Assert.IsTrue(Type.IsObject(T.allOf[1]))
})
Test('Should Intersect 6', () => {
  const T: Type.TIntersect<[
    Type.TObject<{
      x: Type.TNumber
    }>,
    Type.TObject<{
      y: Type.TNumber
    }>,
    Type.TObject<{
      z: Type.TNumber
    }>
  ]> = Type.Script('{ x: number } & ({ y: number } & { z: number })')
  // normalization issue here (parser): expected nested expression
  Assert.IsTrue(Type.IsIntersect(T))
  Assert.IsTrue(Type.IsObject(T.allOf[0]))
  Assert.IsTrue(Type.IsObject(T.allOf[1]))
  Assert.IsTrue(Type.IsObject(T.allOf[2]))
})
