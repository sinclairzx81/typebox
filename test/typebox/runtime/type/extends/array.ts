import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Array')

// ------------------------------------------------------------------
// Identity
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<null[], null[]>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Array(Type.Null()), Type.Array(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<null, null[]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Array(Type.Null()), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, null[]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Array(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<any, null[]>(false)
  Assert.IsExtends<any, null[]>(true)
  const R = Extends({}, Type.Any(), Type.Array(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, null[]>(true)
  const R = Extends({}, Type.Never(), Type.Array(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, null[]>(false)
  const R = Extends({}, Type.Unknown(), Type.Array(Type.Null()))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Narrowed
// ------------------------------------------------------------------
Test('Should Extends 6', () => {
  Assert.IsExtends<1[], number[]>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Array(Type.Literal(1)), Type.Array(Type.Number()))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 7', () => {
  Assert.IsExtends<number[], 1[]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Array(Type.Number()), Type.Array(Type.Literal(1)))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
Test('Should Extends 8', () => {
  Assert.IsExtends<[number, number], number[]>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Tuple([
      Type.Number(),
      Type.Number()
    ]),
    Type.Array(Type.Number())
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 9', () => {
  Assert.IsExtends<number[], [number, number]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Array(Type.Number()),
    Type.Tuple([
      Type.Number(),
      Type.Number()
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 10', () => {
  Assert.IsExtends<[1, 1], number[]>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(1)
    ]),
    Type.Array(Type.Number())
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 11', () => {
  Assert.IsExtends<number[], [1, 1]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Array(Type.Number()),
    Type.Tuple([
      Type.Literal(1),
      Type.Literal(1)
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 12', () => {
  Assert.IsExtends<[number, number], 1[]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Tuple([
      Type.Number(),
      Type.Number()
    ]),
    Type.Array(Type.Literal(1))
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 13', () => {
  Assert.IsExtends<1[], [number, number]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Array(Type.Literal(1)),
    Type.Tuple([
      Type.Number(),
      Type.Number()
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 14', () => {
  Assert.IsExtends<[number, string], number[]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Tuple([
      Type.Number(),
      Type.String()
    ]),
    Type.Array(Type.Number())
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 15', () => {
  Assert.IsExtends<number[], [number, string]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Array(Type.Number()),
    Type.Tuple([
      Type.Number(),
      Type.String()
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 16', () => {
  Assert.IsExtends<[number, number | string], number[]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Tuple([
      Type.Number(),
      Type.Union([Type.Number(), Type.String()])
    ]),
    Type.Array(Type.Number())
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 17', () => {
  Assert.IsExtends<number[], [number, number | string]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Array(Type.Number()),
    Type.Tuple([
      Type.Number(),
      Type.Union([Type.Number(), Type.String()])
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 18', () => {
  Assert.IsExtends<[number, number], (string | number)[]>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Tuple([
      Type.Number(),
      Type.Number()
    ]),
    Type.Array(Type.Union([Type.Number(), Type.String()]))
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 19', () => {
  Assert.IsExtends<(string | number)[], [number, number]>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Array(Type.Union([Type.Number(), Type.String()])),
    Type.Tuple([
      Type.Number(),
      Type.Number()
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
