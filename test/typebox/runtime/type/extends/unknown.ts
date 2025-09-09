import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Unknown')

// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<unknown, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, unknown>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Null(), Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<any, unknown>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Any(), Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, unknown>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, unknown>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Unknown(), Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
Test('Should Extends 7', () => {
  type _X = unknown extends infer A extends any ? true : false // true
  const R: Type.ExtendsResult.TExtendsTrue<{ A: Type.TUnknown }> = Extends({}, Type.Unknown(), Type.Infer('A', Type.Any()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
  Assert.IsTrue(Type.IsUnknown(R.inferred.A))
})
Test('Should Extends 8', () => {
  type _X = unknown extends infer A extends never ? true : false // false
  const R: Type.ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Infer('A', Type.Never()))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 6', () => {
  type _X = unknown extends infer A extends unknown ? true : false // true
  const R: Type.ExtendsResult.TExtendsTrue<{ A: Type.TUnknown }> = Extends({}, Type.Unknown(), Type.Infer('A', Type.Unknown()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
  Assert.IsTrue(Type.IsUnknown(R.inferred.A))
})
