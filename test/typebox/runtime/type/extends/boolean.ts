import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Boolean')

// ------------------------------------------------------------------
// Identity
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<boolean, boolean>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Boolean(), Type.Boolean())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<boolean, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Boolean(), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, boolean>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Boolean())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<any, boolean>(false)
  Assert.IsExtends<any, boolean>(true)

  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.Boolean())
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, boolean>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Boolean())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, boolean>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Boolean())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Subtype
// ------------------------------------------------------------------
Test('Should Extends 6', () => {
  type _X = boolean extends true ? true : false
  Assert.IsExtends<boolean, true>(true)
  Assert.IsExtends<boolean, true>(false) // <--- this because _X
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Boolean(), Type.Literal(true))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 7', () => {
  type _X = true extends boolean ? true : false
  Assert.IsExtends<true, boolean>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Literal(true), Type.Boolean())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
