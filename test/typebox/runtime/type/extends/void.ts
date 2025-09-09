import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Void')

// ------------------------------------------------------------------
// Void
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<void, void>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Void(), Type.Void())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<void, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Void(), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, void>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Void())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<any, void>(false)
  Assert.IsExtends<any, void>(true)
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.Void())
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, void>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Void())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, void>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Void())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Void | Undefined
// ------------------------------------------------------------------
Test('Should Extends 6', () => {
  Assert.IsExtendsWhenLeftIsNever<undefined, void>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Undefined(), Type.Void())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 7', () => {
  Assert.IsExtendsWhenLeftIsNever<void, undefined>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Void(), Type.Undefined())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
