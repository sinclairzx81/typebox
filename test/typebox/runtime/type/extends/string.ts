import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.String')

// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<string, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.String(), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, string>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.String())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<any, string>(false)
  Assert.IsExtends<any, string>(true)
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.String())
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, string>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.String())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, string>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.String())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
