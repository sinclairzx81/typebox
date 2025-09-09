import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Conditional')

Test('Should Conditional 1', () => {
  const T: Type.TLiteral<true> = Type.Script('string extends string ? true : false')
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, true)
})

Test('Should Conditional 2', () => {
  const T: Type.TString = Type.Script('string extends infer S ? S : false')
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Conditional 3', () => {
  const T: Type.TTuple<[Type.TString, Type.TString]> = Type.Script('string extends infer S ? [S, S] : false')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsString(T.items[0]))
  Assert.IsTrue(Type.IsString(T.items[1]))
})
Test('Should Conditional 4', () => {
  const T: Type.TTuple<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]> = Type.Script(`{
    x: 1,
    y: 2,
    z: 3  
  } extends {
    x: infer X,
    y: infer Y,
    z: infer Z
  } ? [X, Y, Z] : never`)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
  Assert.IsEqual(T.items[2].const, 3)
})
// tailed conditional
Test('Should Conditional 5', () => {
  const T: Type.TTuple<[Type.TLiteral<3>, Type.TLiteral<2>, Type.TLiteral<1>]> = Type.Script(`(
    { x: 1, y: 2, z: 3 } extends 
    { x: infer X, y: infer Y, z: infer Z } 
      ? [X, Y, Z] 
      : never
   ) extends infer R 
    ? [R[2], R[1], R[0]] 
    : never`)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 3)
  Assert.IsEqual(T.items[1].const, 2)
  Assert.IsEqual(T.items[2].const, 1)
})
