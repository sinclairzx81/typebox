import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Never')

// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtendsWhenLeftIsNever<never, null>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, never>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Never())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtendsWhenLeftIsNever<never, never>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Never())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, any>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Any())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, never>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Never())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
Test('Should Extends 6', () => {
  type _X = never extends infer A extends any ? true : false // true
  const R: Type.ExtendsResult.TExtendsTrue<{ A: Type.TNever }> = Extends({}, Type.Never(), Type.Infer('A', Type.Never()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
  Assert.IsTrue(Type.IsNever(R.inferred.A))
})
Test('Should Extends 7', () => {
  type _X = never extends infer A extends unknown ? true : false // true
  const R: Type.ExtendsResult.TExtendsTrue<{ A: Type.TNever }> = Extends({}, Type.Never(), Type.Infer('A', Type.Unknown()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
  Assert.IsTrue(Type.IsNever(R.inferred.A))
})
Test('Should Extends 8', () => {
  type _X = never extends infer A extends never ? true : false // true
  const R: Type.ExtendsResult.TExtendsTrue<{ A: Type.TNever }> = Extends({}, Type.Never(), Type.Infer('A', Type.Never()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
  Assert.IsTrue(Type.IsNever(R.inferred.A))
})
