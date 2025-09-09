import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Tuple')

// ------------------------------------------------------------------
// Identity
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<bigint, bigint>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Tuple([Type.Literal(1)]), Type.Tuple([Type.Literal(1)]))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 0', () => {
  Assert.IsExtends<bigint, bigint>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Tuple([]), Type.Tuple([]))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<[1], null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Tuple([Type.Literal(1)]), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, [1]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Tuple([Type.Literal(1)]))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.Tuple([Type.Literal(1)]))
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 4', () => {
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Tuple([Type.Literal(1)]))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Tuple([Type.Literal(1)]))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Subtype
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<[1], [number]>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Tuple([Type.Literal(1)]), Type.Tuple([Type.Number()]))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 0', () => {
  Assert.IsExtends<[number], [1]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Tuple([Type.Number()]), Type.Tuple([Type.Literal(1)]))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Length
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<[1], [1, 1]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Tuple([Type.Literal(1)]), Type.Tuple([Type.Literal(1), Type.Literal(1)]))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 0', () => {
  Assert.IsExtends<[1, 1], [1]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Tuple([Type.Literal(1), Type.Literal(1)]), Type.Tuple([Type.Literal(1)]))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<[1, 1], number[]>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Tuple([Type.Literal(1), Type.Literal(1)]), Type.Array(Type.Number()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 0', () => {
  Assert.IsExtends<number[], [1, 1]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Array(Type.Number()), Type.Tuple([Type.Literal(1), Type.Literal(1)]))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 0', () => {
  Assert.IsExtends<[1, 1], string[]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Tuple([Type.Literal(1), Type.Literal(1)]), Type.Array(Type.String()))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 0', () => {
  Assert.IsExtends<string[], [1, 1]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Array(Type.String()), Type.Tuple([Type.Literal(1), Type.Literal(1)]))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 0', () => {
  Assert.IsExtends<[1, 1], (number | string)[]>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Tuple([Type.Literal(1), Type.Literal(1)]), Type.Array(Type.Union([Type.Number(), Type.String()])))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 0', () => {
  Assert.IsExtends<(number | string)[], [1, 1]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Array(Type.Union([Type.Number(), Type.String()])), Type.Tuple([Type.Literal(1), Type.Literal(1)]))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
