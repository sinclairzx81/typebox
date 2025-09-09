import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.AsyncIterator')

// ------------------------------------------------------------------
// Identity
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<AsyncIterableIterator<null>, AsyncIterableIterator<null>>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.AsyncIterator(Type.Null()), Type.AsyncIterator(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<AsyncIterableIterator<null>, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.AsyncIterator(Type.Null()), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, AsyncIterableIterator<null>>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.AsyncIterator(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<any, AsyncIterableIterator<null>>(false)
  Assert.IsExtends<any, AsyncIterableIterator<null>>(true)
  const R = Extends({}, Type.Any(), Type.AsyncIterator(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, AsyncIterableIterator<null>>(true)
  const R = Extends({}, Type.Never(), Type.AsyncIterator(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, AsyncIterableIterator<null>>(false)
  const R = Extends({}, Type.Unknown(), Type.AsyncIterator(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Generic Covariance
// ------------------------------------------------------------------
Test('Should Extends 6', () => {
  Assert.IsExtends<AsyncIterableIterator<number>, AsyncIterableIterator<1>>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.AsyncIterator(Type.Number()), Type.AsyncIterator(Type.Literal(1)))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 7', () => {
  Assert.IsExtends<AsyncIterableIterator<1>, AsyncIterableIterator<number>>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.AsyncIterator(Type.Literal(1)), Type.AsyncIterator(Type.Number()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
