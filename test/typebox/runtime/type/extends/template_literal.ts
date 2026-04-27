import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.TemplateLiteral')

// ------------------------------------------------------------------
// Base
// ------------------------------------------------------------------
const Base = Type.TemplateLiteral('${"A" | "B"}')
type Base = `${'A' | 'B'}`

// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<Base, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Base, Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, Base>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Base)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<any, Base>(false)
  Assert.IsExtends<any, Base>(true)
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Base)
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, Base>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Base)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, Base>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Base)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Literal SubType
// ------------------------------------------------------------------
Test('Should Extends 6', () => {
  Assert.IsExtends<'A', Base>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Literal('A'), Base)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 7', () => {
  Assert.IsExtends<'B', Base>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Literal('B'), Base)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 8', () => {
  Assert.IsExtends<'C', Base>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Literal('C'), Base)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Union Subtype Left
// ------------------------------------------------------------------
Test('Should Extends 9', () => {
  type _X = 'A' | 'B' | 'X' extends `${'A' | 'B'}` ? true : false // false
  Assert.IsExtends<'A' | 'B' | 'X', Base>(true) // why?
  Assert.IsExtends<'A' | 'B' | 'X', Base>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Union([
      Type.Literal('A'),
      Type.Literal('B'),
      Type.Literal('X')
    ]),
    Base
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 10', () => {
  Assert.IsExtends<'A' | 'B', Base>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Union([
      Type.Literal('A'),
      Type.Literal('B')
    ]),
    Base
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 11', () => {
  Assert.IsExtends<'B' | 'A', Base>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Union([
      Type.Literal('B'),
      Type.Literal('A')
    ]),
    Base
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 12', () => {
  type _X = 'A' | 'B' | 'C' extends `${'A' | 'B'}` ? true : false // false

  Assert.IsExtends<'A' | 'B' | 'C', Base>(false) // <--- we use this
  Assert.IsExtends<'A' | 'B' | 'C', Base>(true) // <--- but I don't know why this...
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Union([
      Type.Literal('A'),
      Type.Literal('B'),
      Type.Literal('C')
    ]),
    Base
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Union Subtype Right
// ------------------------------------------------------------------
Test('Should Extends 13', () => {
  type _X = `${'A' | 'B'}` extends 'A' | 'B' | 'X' ? true : false // true
  Assert.IsExtends<Base, 'A' | 'B' | 'X'>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Base,
    Type.Union([
      Type.Literal('A'),
      Type.Literal('B'),
      Type.Literal('X')
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 14', () => {
  Assert.IsExtends<Base, 'A' | 'B'>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Base,
    Type.Union([
      Type.Literal('A'),
      Type.Literal('B')
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 15', () => {
  Assert.IsExtends<'B' | 'A', Base>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Base,
    Type.Union([
      Type.Literal('B'),
      Type.Literal('A')
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 16', () => {
  Assert.IsExtends<Base, 'A' | 'B' | 'C'>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Base,
    Type.Union([
      Type.Literal('A'),
      Type.Literal('B'),
      Type.Literal('C')
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
