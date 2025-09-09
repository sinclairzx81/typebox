import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Union')

// ------------------------------------------------------------------
// Identity
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<0 | 1 | 2, 0 | 1 | 2>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Union([
      Type.Literal(0),
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Union([
      Type.Literal(0),
      Type.Literal(1),
      Type.Literal(2)
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<0 | 1 | 2, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Union([
      Type.Literal(0),
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Null()
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, 0 | 1 | 2>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Null(),
    Type.Union([
      Type.Literal(0),
      Type.Literal(1),
      Type.Literal(2)
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// SubType
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<0 | 1, 0 | 1 | 2>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Union([
      Type.Literal(0),
      Type.Literal(1)
    ]),
    Type.Union([
      Type.Literal(0),
      Type.Literal(1),
      Type.Literal(2)
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 4', () => {
  type _X = 0 | 1 | 2 extends 0 | 1 ? true : false // false
  Assert.IsExtends<0 | 1 | 2, 0 | 1>(true)
  Assert.IsExtends<0 | 1 | 2, 0 | 1>(false) // use _X
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Union([
      Type.Literal(0),
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Union([
      Type.Literal(0),
      Type.Literal(1)
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
Test('Should Extends 5', () => {
  Assert.IsExtends<0 | 1 | 2, number>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Union([
      Type.Literal(0),
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Number()
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 6', () => {
  Assert.IsExtends<number, 0 | 1 | 2>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Number(),
    Type.Union([
      Type.Literal(0),
      Type.Literal(1),
      Type.Literal(2)
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Expression Nested
// ------------------------------------------------------------------
Test('Should Extends 7', () => {
  Assert.IsExtends<0 | (1 | 2), number>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Union([
      Type.Literal(0),
      Type.Union([
        Type.Literal(1),
        Type.Literal(2)
      ])
    ]),
    Type.Number()
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 8', () => {
  Assert.IsExtends<number, 0 | (1 | 2)>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Number(),
    Type.Union([
      Type.Literal(0),
      Type.Union([
        Type.Literal(1),
        Type.Literal(2)
      ])
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 9', () => {
  Assert.IsExtends<(0 | 1) | 2, number>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Union([
      Type.Union([
        Type.Literal(0),
        Type.Literal(1)
      ]),
      Type.Literal(2)
    ]),
    Type.Number()
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 10', () => {
  Assert.IsExtends<number, (0 | 1) | 2>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Number(),
    Type.Union([
      Type.Union([
        Type.Literal(0),
        Type.Literal(1)
      ]),
      Type.Literal(2)
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
