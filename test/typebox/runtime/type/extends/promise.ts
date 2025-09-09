import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Promise')

// ------------------------------------------------------------------
// Identity
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<Promise<null>, Promise<null>>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Promise(Type.Null()), Type.Promise(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<Promise<null>, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Promise(Type.Null()), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, Promise<null>>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Promise(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<any, Promise<null>>(false)
  Assert.IsExtends<any, Promise<null>>(true)
  const R = Extends({}, Type.Any(), Type.Promise(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, Promise<null>>(true)
  const R = Extends({}, Type.Never(), Type.Promise(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, Promise<null>>(false)
  const R = Extends({}, Type.Unknown(), Type.Promise(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Generic Covariance
// ------------------------------------------------------------------
Test('Should Extends 6', () => {
  Assert.IsExtends<Promise<number>, Promise<1>>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Promise(Type.Number()), Type.Promise(Type.Literal(1)))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 7', () => {
  Assert.IsExtends<Promise<1>, Promise<number>>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Promise(Type.Literal(1)), Type.Promise(Type.Number()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
