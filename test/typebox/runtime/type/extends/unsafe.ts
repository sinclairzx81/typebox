import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

// Note: TUnsafe is aliased as TUnsafe in TExtends contexts. This is handled
// via a Preflight TCanonical mapping. We may be able to improve this in
// later versions with a dedicated TNominal<T>. (Review)
const Test = Assert.Context('Extends.Unsafe')

// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<unknown, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unsafe({}), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, unknown>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Null(), Type.Unsafe({}))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Any, Never and Unsafe
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<any, unknown>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Any(), Type.Unsafe({}))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, unknown>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Unsafe({}))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, unknown>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Unsafe({}), Type.Unsafe({}))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
Test('Should Extends 7', () => {
  type _X = unknown extends infer A extends any ? true : false // true
  const R: Type.ExtendsResult.TExtendsTrue<{ A: Type.TUnknown }> = Extends({}, Type.Unsafe({}), Type.Infer('A', Type.Any()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
  Assert.IsTrue(Type.IsUnknown(R.inferred.A))
})
Test('Should Extends 8', () => {
  type _X = unknown extends infer A extends never ? true : false // false
  const R: Type.ExtendsResult.TExtendsFalse = Extends({}, Type.Unsafe({}), Type.Infer('A', Type.Never()))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 9', () => {
  type _X = unknown extends infer A extends unknown ? true : false // true
  const R: Type.ExtendsResult.TExtendsTrue<{ A: Type.TUnknown }> = Extends({}, Type.Unsafe({}), Type.Infer('A', Type.Unknown()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
  Assert.IsTrue(Type.IsUnknown(R.inferred.A))
})
