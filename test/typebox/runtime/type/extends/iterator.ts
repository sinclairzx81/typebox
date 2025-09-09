import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Iterator')

// ------------------------------------------------------------------
// Identity
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<IterableIterator<null>, IterableIterator<null>>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Iterator(Type.Null()), Type.Iterator(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<IterableIterator<null>, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Iterator(Type.Null()), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, IterableIterator<null>>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Iterator(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<any, IterableIterator<null>>(false)
  Assert.IsExtends<any, IterableIterator<null>>(true)
  const R = Extends({}, Type.Any(), Type.Iterator(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, IterableIterator<null>>(true)
  const R = Extends({}, Type.Never(), Type.Iterator(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, IterableIterator<null>>(false)
  const R = Extends({}, Type.Unknown(), Type.Iterator(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Generic Covariance
// ------------------------------------------------------------------
Test('Should Extends 6', () => {
  Assert.IsExtends<IterableIterator<number>, IterableIterator<1>>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Iterator(Type.Number()), Type.Iterator(Type.Literal(1)))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 7', () => {
  Assert.IsExtends<IterableIterator<1>, IterableIterator<number>>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Iterator(Type.Literal(1)), Type.Iterator(Type.Number()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
