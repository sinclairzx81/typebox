import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Enum')

// ------------------------------------------------------------------
// Base
//
// Enum is interpretted as Union<[TLiteral[]]> in TypeBox. The Extends
// algorithms will transform Enum into Union as does most other
// engine operations. Tests are primarily Union in nature without
// distribution. In cases where distribution occurs, we select the
// non-distributive form.
//
// ------------------------------------------------------------------
const TbEnum = Type.Enum({ A: 0, B: 1, C: 2 } as const)
enum TsEnum {
  A,
  B,
  C
}

// ------------------------------------------------------------------
// Identity
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<TsEnum, TsEnum>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, TbEnum, TbEnum)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<TsEnum, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, TbEnum, Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, TsEnum>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), TbEnum)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Union Rules
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<number, TsEnum>(true)
  type _X = number extends 0 | 1 | 2 ? true : false // false <-- trust this
  Assert.IsExtends<number, TsEnum>(true) // true
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Number(), TbEnum)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtends<number, TsEnum>(true)
  type _X = 0 | 1 | 2 extends number ? true : false // true
  Assert.IsExtends<TsEnum, number>(true) // ... ok
  const R: ExtendsResult.TExtendsTrue = Extends({}, TbEnum, Type.Number())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Union Sub Type
// ------------------------------------------------------------------
Test('Should Extends 5', () => {
  Assert.IsExtends<0 | 1 | 2, 0 | 1 | 2>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Enum([0, 1, 2]), Type.Enum([0, 1, 2]))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 6', () => {
  Assert.IsExtends<0 | 1, 0 | 1 | 2>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Enum([0, 1]), Type.Enum([0, 1, 2]))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 7', () => {
  type _X = 0 | 1 | 2 extends 0 | 1 ? true : false // false
  Assert.IsExtends<0 | 1 | 2, 0 | 1>(true)
  Assert.IsExtends<0 | 1 | 2, 0 | 1>(false) // we use _X here
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Enum([0, 1, 2]), Type.Enum([0, 1]))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Variant types
// ------------------------------------------------------------------
Test('Should Extends 8', () => {
  Assert.IsExtends<0 | null | 'X', 0 | null | 'X'>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Enum([0, null, 'X']), Type.Enum([0, null, 'X']))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 8', () => {
  Assert.IsExtends<0 | null, 0 | null | 'X'>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Enum([0, null]), Type.Enum([0, null, 'X']))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 9', () => {
  type _X = 0 | null | 'X' extends 0 | null ? true : false // false
  Assert.IsExtends<0 | null | 'X', 0 | null>(true)
  Assert.IsExtends<0 | null | 'X', 0 | null>(false) // we use _X here
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Enum([0, null, 'X']), Type.Enum([0, null]))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Variant Types + Union
// ------------------------------------------------------------------
Test('Should Extends 10', () => {
  Assert.IsExtends<0 | null | 'X', 0 | null | 'X'>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Enum([0, null, 'X']),
    Type.Union([
      Type.Literal(0),
      Type.Null(),
      Type.Literal('X')
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 11', () => {
  Assert.IsExtends<0 | null, 0 | null | 'X'>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Enum([0, null]),
    Type.Union([
      Type.Literal(0),
      Type.Null(),
      Type.Literal('X')
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 12', () => {
  type _X = 0 | null | 'X' extends 0 | null ? true : false // false
  Assert.IsExtends<0 | null | 'X', 0 | null>(true)
  Assert.IsExtends<0 | null | 'X', 0 | null>(false) // use _X
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Enum([0, null, 'X']),
    Type.Union([
      Type.Literal(0),
      Type.Null()
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
Test('Should Extends 10', () => {
  Assert.IsExtends<0 | 1 | 2, number>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Enum([0, 1, 2]), Type.Number())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 10', () => {
  Assert.IsExtends<number, 0 | 1 | 2>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Number(), Type.Enum([0, 1, 2]))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
Test('Should Extends 11', () => {
  Assert.IsExtends<'A' | 'B', string>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Enum(['A', 'B']), Type.String())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 12', () => {
  Assert.IsExtends<string, 'A' | 'B'>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.String(), Type.Enum(['A', 'B']))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Number | String
// ------------------------------------------------------------------
Test('Should Extends 13', () => {
  type _X = 'A' | 0 extends string ? true : false // false
  Assert.IsExtends<'A' | 0, string>(true)
  Assert.IsExtends<'A' | 0, string>(false) // use _X
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Enum(['A', 0]), Type.String())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 14', () => {
  Assert.IsExtends<string, 'A' | 'B'>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.String(), Type.Enum(['A', 'B']))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
