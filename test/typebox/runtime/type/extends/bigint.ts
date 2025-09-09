import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.BigInt')

// ------------------------------------------------------------------
// Identity
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<bigint, bigint>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.BigInt(), Type.BigInt())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<bigint, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.BigInt(), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, bigint>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.BigInt())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.BigInt())
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 4', () => {
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.BigInt())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.BigInt())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
