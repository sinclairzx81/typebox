import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Constructor')

const Base = Type.Constructor([
  Type.Literal(1),
  Type.Number()
], Type.Number())

type Base = new (a: 1, b: number) => number

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
// Parameters
// ------------------------------------------------------------------
Test('Should Extends 6', () => {
  Assert.IsExtends<new (a: 1, b: number) => number, Base>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Constructor([
      Type.Literal(1),
      Type.Number()
    ], Type.Number()),
    Base
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 7', () => {
  Assert.IsExtends<new (a: null, b: number) => 3, Base>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Constructor([
      Type.Null(),
      Type.Number()
    ], Type.Number()),
    Base
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 8', () => {
  Assert.IsExtends<new (a: 1, b: null) => number, Base>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Constructor([
      Type.Literal(1),
      Type.Null()
    ], Type.Number()),
    Base
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 9', () => {
  Assert.IsExtends<Base, new (a: null, b: number) => number>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Base,
    Type.Constructor([
      Type.Null(),
      Type.Number()
    ], Type.Number())
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 10', () => {
  Assert.IsExtends<Base, new (a: 1, b: null) => number>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Base,
    Type.Constructor([
      Type.Literal(1),
      Type.Null()
    ], Type.Number())
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Narrowed Parameter
// ------------------------------------------------------------------
Test('Should Extends 11', () => {
  Assert.IsExtends<new (a: 1, b: 1) => number, Base>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Constructor([
      Type.Literal(1),
      Type.Literal(1)
    ], Type.Number()),
    Base
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 12', () => {
  Assert.IsExtends<Base, new (a: 1, b: 1) => number>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Base,
    Type.Constructor([
      Type.Literal(1),
      Type.Literal(1)
    ], Type.Number())
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Optional Parameter
// ------------------------------------------------------------------
Test('Should Extends 13', () => {
  Assert.IsExtends<new (a: 1, b?: number) => number, Base>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Constructor([
      Type.Literal(1),
      Type.Optional(Type.Number())
    ], Type.Number()),
    Base
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 14', () => {
  Assert.IsExtends<Base, new (a: 1, b?: number) => number>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Base,
    Type.Constructor([
      Type.Literal(1),
      Type.Optional(Type.Number())
    ], Type.Number())
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// InstanceType
// ------------------------------------------------------------------
Test('Should Extends 15', () => {
  Assert.IsExtends<new (a: 1, b: number) => string, Base>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Type.Constructor([
      Type.Literal(1),
      Type.Number()
    ], Type.String()),
    Base
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 16', () => {
  Assert.IsExtends<Base, new (a: 1, b: number) => string>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Base,
    Type.Constructor([
      Type.Literal(1),
      Type.Number()
    ], Type.String())
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 17', () => {
  Assert.IsExtends<new (a: 1, b: number) => 1, Base>(true)
  const R: ExtendsResult.TExtendsTrue = Extends(
    {},
    Type.Constructor([
      Type.Literal(1),
      Type.Number()
    ], Type.Literal(1)),
    Base
  )
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 18', () => {
  Assert.IsExtends<Base, new (a: 1, b: number) => 1>(false)
  const R: ExtendsResult.TExtendsFalse = Extends(
    {},
    Base,
    Type.Constructor([
      Type.Literal(1),
      Type.Number()
    ], Type.Literal(1))
  )
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Mismatched Parameter Length
// ------------------------------------------------------------------
Test('Should Extends 19', () => {
  Assert.IsExtends<new (a: number) => {}, new (a: number) => {}>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Constructor([Type.Number()], Type.Object({})), Type.Constructor([Type.Number()], Type.Object({})))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 20', () => {
  Assert.IsExtends<new (a: number, b: number) => {}, new (a: number) => {}>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Constructor([Type.Number(), Type.Number()], Type.Object({})), Type.Constructor([Type.Number()], Type.Object({})))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 21', () => {
  Assert.IsExtends<new (a: number) => {}, new (a: number, b: number) => {}>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Constructor([Type.Number()], Type.Object({})), Type.Constructor([Type.Number(), Type.Number()], Type.Object({})))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 22', () => {
  Assert.IsExtends<new (a: number, b?: number) => {}, new (a: number) => {}>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Constructor([Type.Number(), Type.Optional(Type.Number())], Type.Object({})), Type.Constructor([Type.Number()], Type.Object({})))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
