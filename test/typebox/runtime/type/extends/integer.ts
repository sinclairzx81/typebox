import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Integer')

// ------------------------------------------------------------------
// Identity
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<number, number>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Integer(), Type.Integer())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<number, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Integer(), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, number>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Integer())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<any, number>(false)
  Assert.IsExtends<any, number>(true)
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.Integer())
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, number>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Integer())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, number>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Integer())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Integer more Narrow than Number
// ------------------------------------------------------------------
Test('Should Extends 6', () => {
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Number(), Type.Integer())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 7', () => {
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Integer(), Type.Number())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
