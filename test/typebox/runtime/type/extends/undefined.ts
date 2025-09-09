import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Undefined')

// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<undefined, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Undefined(), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, undefined>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Undefined())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<any, undefined>(false)
  Assert.IsExtends<any, undefined>(true)
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.Undefined())
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtendsWhenLeftIsNever<never, undefined>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Undefined())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 3', () => {
  Assert.IsExtends<unknown, undefined>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Undefined())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
