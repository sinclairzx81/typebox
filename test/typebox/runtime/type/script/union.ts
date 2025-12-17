import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Union')

Test('Should Union 1', () => {
  const T: Type.TNull = Type.Script('null')
  Assert.IsFalse(Type.IsUnion(T))
})
Test('Should Union 1', () => {
  const T: Type.TUnion<[Type.TNull, Type.TNumber]> = Type.Script('null | number')
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNull(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
Test('Should Union 2', () => {
  const T: Type.TUnion<[Type.TNull, Type.TNumber]> = Type.Script('Assign<null | number, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Union 3', () => {
  const T = Type.Script('Assign<null | number, { a: 1, b: 2 }>')
  const O = Type.UnionOptions(T)
  Assert.IsFalse(Type.IsUnion(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
Test('Should Union 4', () => {
  const T: Type.TUnion<[
    Type.TUnion<[
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
  ]> = Type.Script('({ x: number } | { y: number }) | { z: number }')

  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsUnion(T.anyOf[0]))
  Assert.IsTrue(Type.IsObject(T.anyOf[1]))
})
Test('Should Union 5', () => {
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
  ]> = Type.Script('{ x: number } | ({ y: number } | { z: number })')
  // normalization issue here (parser): expected nested expression
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsObject(T.anyOf[0]))
  Assert.IsTrue(Type.IsObject(T.anyOf[1]))
  Assert.IsTrue(Type.IsObject(T.anyOf[2]))
})
// ------------------------------------------------------------------
// Leading Pipe
// ------------------------------------------------------------------
Test('Should Union 6', () => {
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]> = Type.Script('| 1 | 2 | 3')
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 2)
  Assert.IsEqual(T.anyOf[2].const, 3)
})
Test('Should Union 7', () => {
  const T: Type.TObject<{
    x: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]>
  }> = Type.Script(`{
    x: | 1 | 2 | 3  
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsUnion(T.properties.x))
  Assert.IsEqual(T.properties.x.anyOf[0].const, 1)
  Assert.IsEqual(T.properties.x.anyOf[1].const, 2)
  Assert.IsEqual(T.properties.x.anyOf[2].const, 3)
})
Test('Should Union 8', () => {
  const M = Type.Script(`
    type A = 
      | { x: number }
      | { y: number }
      | { z: number }

    type B = 
      | { a: number }
      | { b: number }
      | { c: number }
    `)
  const A: Type.TUnion<[
    Type.TObject<{
      x: Type.TNumber
    }>,
    Type.TObject<{
      y: Type.TNumber
    }>,
    Type.TObject<{
      z: Type.TNumber
    }>
  ]> = M.A

  const B: Type.TUnion<[
    Type.TObject<{
      a: Type.TNumber
    }>,
    Type.TObject<{
      b: Type.TNumber
    }>,
    Type.TObject<{
      c: Type.TNumber
    }>
  ]> = M.B
  Assert.IsTrue(Type.IsUnion(A))
  Assert.IsTrue(Type.IsObject(A.anyOf[0]))
  Assert.IsTrue(Type.IsObject(A.anyOf[1]))
  Assert.IsTrue(Type.IsObject(A.anyOf[2]))
  Assert.IsTrue(Type.IsNumber(A.anyOf[0].properties.x))
  Assert.IsTrue(Type.IsNumber(A.anyOf[1].properties.y))
  Assert.IsTrue(Type.IsNumber(A.anyOf[2].properties.z))

  Assert.IsTrue(Type.IsUnion(B))
  Assert.IsTrue(Type.IsObject(B.anyOf[0]))
  Assert.IsTrue(Type.IsObject(B.anyOf[1]))
  Assert.IsTrue(Type.IsObject(B.anyOf[2]))
  Assert.IsTrue(Type.IsNumber(B.anyOf[0].properties.a))
  Assert.IsTrue(Type.IsNumber(B.anyOf[1].properties.b))
  Assert.IsTrue(Type.IsNumber(B.anyOf[2].properties.c))
})
