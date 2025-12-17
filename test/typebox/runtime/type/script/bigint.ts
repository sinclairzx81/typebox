import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.BigInt')

Test('Should BigInt 1', () => {
  const T: Type.TNull = Type.Script('null')
  Assert.IsFalse(Type.IsBigInt(T))
})
Test('Should BigInt 2', () => {
  const T: Type.TBigInt = Type.Script('bigint')
  Assert.IsTrue(Type.IsBigInt(T))
})
Test('Should BigInt 3', () => {
  const T: Type.TBigInt = Type.Script('Assign<bigint, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
