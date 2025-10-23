import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.BigInt')

Test('Should not guard BigInt', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsBigInt(T))
})
Test('Should Create BigInt 1', () => {
  const T: Type.TBigInt = Type.BigInt()
  Assert.IsTrue(Type.IsBigInt(T))
})
Test('Should Create BigInt with options', () => {
  const T: Type.TBigInt = Type.BigInt({ a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
