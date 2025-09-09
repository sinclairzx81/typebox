// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Intersect')

Test('Should not guard Intersect', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsIntersect(T))
})
Test('Should Create Intersect 1', () => {
  const T: Type.TIntersect<[Type.TNull, Type.TNumber]> 
    = Type.Intersect([Type.Null(), Type.Number()])
  Assert.IsTrue(Type.IsIntersect(T))
  Assert.IsTrue(Type.IsNull(T.allOf[0]))
  Assert.IsTrue(Type.IsNumber(T.allOf[1]))
})
Test('Should Create Intersect 2', () => {
  const T: Type.TIntersect<[]> 
    = Type.Intersect([])
  Assert.IsTrue(Type.IsIntersect(T))
  Assert.IsEqual(T.allOf, [])
})
Test('Should Create Intersect 3', () => {
  const T: Type.TIntersect<[Type.TNumber]> 
    = Type.Intersect([Type.Number()])
  Assert.IsTrue(Type.IsIntersect(T))
  Assert.IsTrue(Type.IsNumber(T.allOf[0]))
})
Test('Should Create Intersect with options', () => {
  const T: Type.TIntersect<[Type.TNull, Type.TNumber]> 
    = Type.Intersect([Type.Null(), Type.Number()], { a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Create Intersect with options then extract', () => {
  const T: Type.TIntersect<[Type.TNull, Type.TNumber]> 
    = Type.Intersect([Type.Null(), Type.Number()], { a: 1, b: 2 })
  const O = Type.IntersectOptions(T)
  Assert.IsFalse(Type.IsIntersect(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})