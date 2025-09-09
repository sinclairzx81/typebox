import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Symbol')

// ------------------------------------------------------------------
// Identity
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<symbol, symbol>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Symbol(), Type.Symbol())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<symbol, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Symbol(), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, symbol>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Symbol())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<any, symbol>(false)
  Assert.IsExtends<any, symbol>(true)
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.Symbol())
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, symbol>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Symbol())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, symbol>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Symbol())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
