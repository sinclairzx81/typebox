import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Literal')

// ------------------------------------------------------------------
// Identity
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<1n, 1n>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Literal(1n), Type.Literal(1n))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 1', () => {
  Assert.IsExtends<true, true>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Literal(true), Type.Literal(true))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<1, 1>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Literal(1), Type.Literal(1))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 3', () => {
  Assert.IsExtends<'A', 'A'>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Literal('A'), Type.Literal('A'))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 4', () => {
  Assert.IsExtends<1n, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Literal(1n), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<null, 1n>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Literal(1n))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 6', () => {
  Assert.IsExtends<true, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Literal(true), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 7', () => {
  Assert.IsExtends<null, true>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Literal(true))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})

Test('Should Extends 8', () => {
  Assert.IsExtends<'A', null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Literal('A'), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 9', () => {
  Assert.IsExtends<null, 'A'>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Literal('A'))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 10', () => {
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.Literal(1n))
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 11', () => {
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Literal(1n))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 12', () => {
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Literal(1n))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 13', () => {
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.Literal(true))
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 14', () => {
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Literal(true))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 15', () => {
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Literal(true))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 16', () => {
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.Literal(1))
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 17', () => {
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Literal(1))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 18', () => {
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Literal(1))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 19', () => {
  const R: ExtendsResult.TExtendsUnion = Extends({}, Type.Any(), Type.Literal('A'))
  Assert.IsTrue(ExtendsResult.IsExtendsUnion(R))
})
Test('Should Extends 20', () => {
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Literal('A'))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 21', () => {
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Literal('A'))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})

// ------------------------------------------------------------------
// SubType
// ------------------------------------------------------------------
Test('Should Extends 22', () => {
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Literal(1n), Type.BigInt())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 23', () => {
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.BigInt(), Type.Literal(1n))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 24', () => {
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Literal(true), Type.Boolean())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 25', () => {
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Boolean(), Type.Literal(true))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 26', () => {
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Literal(1), Type.Number())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 27', () => {
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Number(), Type.Literal(1))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 28', () => {
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Literal('A'), Type.String())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 29', () => {
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.String(), Type.Literal('A'))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})

// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
Test('Should Extends 30', () => {
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Union([
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Union([
      Type.Literal(1),
      Type.Literal(2)
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 31', () => {
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Union([
      Type.Literal(1),
      Type.Literal(2)
    ]),
    Type.Union([
      Type.Literal(1)
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 32', () => {
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Union([
      Type.Literal(1)
    ]),
    Type.Union([
      Type.Literal(1),
      Type.Literal(2)
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invalid
// ------------------------------------------------------------------
Test('Should Extends 33', () => {
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Literal(null as never), Type.Literal('A'))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// TemplateLiteral
// ------------------------------------------------------------------
Test('Should Extends 34', () => {
  Assert.IsExtends<'AhelloB', `A${'hello' | 'world'}B`>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Literal('AhelloB'),
    Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Union([Type.Literal('hello'), Type.Literal('world')]),
      Type.Literal('B')
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 35', () => {
  Assert.IsExtends<`A${'hello' | 'world'}B`, 'AhelloB'>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Union([Type.Literal('hello'), Type.Literal('world')]),
      Type.Literal('B')
    ]),
    Type.Literal('AhelloB')
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 36', () => {
  Assert.IsExtends<'AhelloB', `A${'hello' | 'world'}B`>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Union([
      Type.Literal('AhelloB'),
      Type.Literal('AworldB')
    ]),
    Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Union([Type.Literal('hello'), Type.Literal('world')]),
      Type.Literal('B')
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 37', () => {
  Assert.IsExtends<'AhelloB', `A${'hello' | 'world'}B`>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Union([Type.Literal('hello'), Type.Literal('world')]),
      Type.Literal('B')
    ]),
    Type.Union([
      Type.Literal('AhelloB'),
      Type.Literal('AworldB')
    ])
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
