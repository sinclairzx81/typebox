import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Null')

// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<null, 1>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Literal(1))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<1, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Literal(1), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<any, null>(false)
  Assert.IsExtends<any, null>(true)
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, null>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
