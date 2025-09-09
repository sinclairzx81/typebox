import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Number')

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
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.Number())
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, number>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Number())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, number>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Number())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
