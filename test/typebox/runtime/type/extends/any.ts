import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Any')

// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<any, null>(false)
  Assert.IsExtends<any, null>(true)
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, any>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Null(), Type.Any())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<any, any>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Any(), Type.Any())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, any>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Any())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, any>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Unknown(), Type.Any())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
Test('Should Extends 7', () => {
  type _X = any extends infer A extends any ? true : false // true
  const R: Type.ExtendsResult.TExtendsTrue<{ A: Type.TAny }> = Extends({}, Type.Any(), Type.Infer('A', Type.Any()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
  Assert.IsTrue(Type.IsAny(R.inferred.A))
})
Test('Should Extends 8', () => {
  type _X = any extends infer A extends never ? true : false // boolean
  const R: Type.ExtendsResult.TExtendsTrue<{ A: Type.TAny }> = Extends({}, Type.Any(), Type.Infer('A', Type.Never()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
  Assert.IsTrue(Type.IsAny(R.inferred.A))
})
Test('Should Extends 6', () => {
  type _X = any extends infer A extends unknown ? true : false // true
  const R: Type.ExtendsResult.TExtendsTrue<{ A: Type.TAny }> = Extends({}, Type.Any(), Type.Infer('A', Type.Unknown()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
  Assert.IsTrue(Type.IsAny(R.inferred.A))
})
