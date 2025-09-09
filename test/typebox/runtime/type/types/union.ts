// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Union')

Test('Should not guard Union', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsUnion(T))
})
Test('Should Create Union 1', () => {
  const T: Type.TUnion<[Type.TNull, Type.TNumber]> 
    = Type.Union([Type.Null(), Type.Number()])
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNull(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
Test('Should Create Union 2', () => {
  const T: Type.TUnion<[]> 
    = Type.Union([])
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf, [])
})
Test('Should Create Union 3', () => {
  const T: Type.TUnion<[Type.TNumber]> 
    = Type.Union([Type.Number()])
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
})
Test('Should Create Union with options', () => {
  const T: Type.TUnion<[Type.TNull, Type.TNumber]> 
    = Type.Union([Type.Null(), Type.Number()], { a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Create Union with options then extract', () => {
  const T = Type.Union([Type.Null(), Type.Number()], { a: 1, b: 2 })
  const O = Type.UnionOptions(T)
  Assert.IsFalse(Type.IsUnion(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})