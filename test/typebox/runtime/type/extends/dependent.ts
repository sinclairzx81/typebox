import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Dependent')

// ------------------------------------------------------------------
// DependentLeft
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  const Left = Type.Dependent(Type.Number(), Type.Literal(1), Type.String())
  const Right = Type.Literal(1)
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 2', () => {
  const Left = Type.Dependent(Type.Number(), Type.Literal(1), Type.Never())
  const Right = Type.Literal(1)
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 3', () => {
  const Left = Type.Dependent(Type.String(), Type.Number(), Type.Never())
  const Right = Type.Number()
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 4', () => {
  const Left = Type.Dependent(Type.Number(), Type.Number(), Type.Never())
  const Right = Type.Number()
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 5', () => {
  const Left = Type.Dependent(Type.Number(), Type.Literal(1), Type.Unknown())
  const Right = Type.Literal(1)
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 6', () => {
  const Left = Type.Dependent(Type.Number(), Type.Literal(1), Type.Unknown())
  const Right = Type.Unknown()
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 7', () => {
  const Left = Type.Dependent(Type.String(), Type.Literal('hello'), Type.Never())
  const Right = Type.String()
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 8', () => {
  const Left = Type.Dependent(Type.Number(), Type.Literal(2), Type.Never())
  const Right = Type.Number()
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 9', () => {
  const Left = Type.Dependent(Type.Number(), Type.Literal(2), Type.Never())
  const Right = Type.Literal(2)
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 10', () => {
  // type A = number extends 1 ? true : false (false, move to else arm)
  // type B = never  extends 1 ? true : false (true)
  const Left = Type.Dependent(Type.Number(), Type.Literal(2), Type.Never())
  const Right = Type.Literal(1)
  const Result = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 11', () => {
  const Left = Type.Dependent(Type.Boolean(), Type.Literal(true), Type.Never())
  const Right = Type.Literal(true)
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 12', () => {
  const Left = Type.Dependent(Type.Boolean(), Type.Literal(true), Type.Literal(false))
  const Right = Type.Literal(true)
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 13', () => {
  const Left = Type.Dependent(Type.Boolean(), Type.Literal(false), Type.Literal(true))
  const Right = Type.Literal(false)
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 14', () => {
  // type A = unknown extends 1 ? true: false // (false, move to else arm)
  // type B = never   extends 1 ? true: false // (true)
  const Left = Type.Dependent(Type.Unknown(), Type.Literal(1), Type.Never())
  const Right = Type.Literal(1)
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 15', () => {
  const Left = Type.Dependent(Type.Never(), Type.Literal(1), Type.Never())
  const Right = Type.Literal(1)
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
// ------------------------------------------------------------------
// DependentRight
// ------------------------------------------------------------------
Test('Should Extends 16', () => {
  const Left = Type.Literal(1)
  const Right = Type.Dependent(Type.Number(), Type.Literal(1), Type.String())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 17', () => {
  const Left = Type.String()
  const Right = Type.Dependent(Type.Number(), Type.Literal(1), Type.String())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 18', () => {
  const Left = Type.Number()
  const Right = Type.Dependent(Type.Number(), Type.Literal(1), Type.String())
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 19', () => {
  const Left = Type.Literal(1)
  const Right = Type.Dependent(Type.Number(), Type.Literal(1), Type.Never())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 20', () => {
  const Left = Type.Number()
  const Right = Type.Dependent(Type.Number(), Type.Literal(1), Type.Never())
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 21', () => {
  // type A = number extends string ? true : false // (false, move to else arm)
  // type B = number extends never  ? true : false // (false)
  const Left = Type.Number()
  const Right = Type.Dependent(Type.String(), Type.Number(), Type.Never())
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 22', () => {
  const Left = Type.String()
  const Right = Type.Dependent(Type.String(), Type.Number(), Type.Never())
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 23', () => {
  const Left = Type.Literal(1)
  const Right = Type.Dependent(Type.Number(), Type.Literal(1), Type.Unknown())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 24', () => {
  const Left = Type.Literal('hello')
  const Right = Type.Dependent(Type.String(), Type.Literal('hello'), Type.Never())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 25', () => {
  const Left = Type.String()
  const Right = Type.Dependent(Type.String(), Type.Literal('hello'), Type.Never())
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 26', () => {
  const Left = Type.Literal(2)
  const Right = Type.Dependent(Type.Number(), Type.Literal(2), Type.Never())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 27', () => {
  const Left = Type.Literal(1)
  const Right = Type.Dependent(Type.Number(), Type.Literal(2), Type.Never())
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 28', () => {
  const Left = Type.Literal(true)
  const Right = Type.Dependent(Type.Boolean(), Type.Literal(true), Type.Never())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 29', () => {
  const Left = Type.Literal(false)
  const Right = Type.Dependent(Type.Boolean(), Type.Literal(true), Type.Never())
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 30', () => {
  const Left = Type.Literal(true)
  const Right = Type.Dependent(Type.Boolean(), Type.Literal(true), Type.Literal(false))
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 31', () => {
  const Left = Type.Never()
  const Right = Type.Dependent(Type.Number(), Type.Literal(1), Type.Never())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
// ------------------------------------------------------------------
// Logical: DependentLeft
// ------------------------------------------------------------------
Test('Should Extends 32', () => {
  const Left = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Right = Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })])
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 33', () => {
  const Left = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Right = Type.Object({})
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 34', () => {
  // type A = { x: number } extends { y: number } ? true : false // (false, move to else arm)
  // type B = never         extends { y: number } ? true : false // (true)
  const Left = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Right = Type.Object({ y: Type.Number() })
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 35', () => {
  // type A = { x: number } extends { z: number } ? true : false // (false, move to else arm)
  // type B = never         extends { y: number } ? true : false // (true)
  const Left = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Right = Type.Object({ z: Type.Number() })
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 36', () => {
  const Left = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Right = Type.Unknown()
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 37', () => {
  // type A = { x: number } extends never ? true : false // (false, move to else arm)
  // type B = never         extends never ? true : false // (true)
  const Left = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Right = Type.Never()
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 38', () => {
  const Left = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Right = Type.Union([
    Type.Object({ y: Type.Number() }),
    Type.Object({ z: Type.Number() }),
    Type.Object({ w: Type.Number() })
  ])
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 39', () => {
  const Left = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Right = Type.Object({ x: Type.Number() })
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
// ------------------------------------------------------------------
// Logical: DependentRight
// ------------------------------------------------------------------
Test('Should Extends 40', () => {
  // type A = { y: number } extends { x: number } ? true : false // (false, move to else arm)
  // type B = { y: number } extends never ? true: false          // (false)
  const Left = Type.Object({ y: Type.Number() })
  const Right = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 41', () => {
  // type A = { z: number } extends { x: number } ? true : false // (false, move to else arm)
  // type B = { z: number } extends never         ? true : false // (false)
  const Left = Type.Object({ z: Type.Number() })
  const Right = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 42', () => {
  // type A = { y: number, z: number } extends { x: number } ? true : false // (false, move to else arm)
  // type B = { y: number, z: number } extends never         ? true : false // (false)
  const Left = Type.Object({ y: Type.Number(), z: Type.Number() })
  const Right = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 43', () => {
  const Left = Type.Object({ x: Type.Number() })
  const Right = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 44', () => {
  const Left = Type.Unknown()
  const Right = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 45', () => {
  const Left = Type.Never()
  const Right = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 46', () => {
  // type A = ({ y: number } | { z: number }) extends { x: number } ? true : false // (false, move to else arm)
  // type B = ({ y: number } | { z: number }) extends never         ? true : false // (false)
  const Left = Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })])
  const Right = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 47', () => {
  const Left = Type.Number()
  const Right = Type.Dependent(
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Never()
  )
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
// ------------------------------------------------------------------
// DependentLeft vs DependentRight
// ------------------------------------------------------------------
Test('Should Extends 48', () => {
  // type A = number extends number ? true : false // (true, move to then arm)
  // type B = number extends 1 ? true : false      // (false)
  // move to left-else
  // type C = never extends number ? true : false  // (true, move to then arm)
  // type D = never extends 1 ? true : false       // (true)
  const Left = Type.Dependent(Type.Number(), Type.Literal(1), Type.Never())
  const Right = Type.Dependent(Type.Number(), Type.Literal(1), Type.Never())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 49', () => {
  // type A = number extends number ? true : false // (true, move then arm)
  // type B = number extends 2 ? true : false      // (false)
  // move to left-else
  // type C = never extends number ? true: false   // (true, move to then)
  // type D = never extends 2 ? true: false        // (true)
  const Left = Type.Dependent(Type.Number(), Type.Literal(1), Type.Never())
  const Right = Type.Dependent(Type.Number(), Type.Literal(2), Type.Never())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 50', () => {
  // type A = number extends string ? true : false // (false, move else arm)
  // type B = number extends never ? true : false  // (false)
  // move to left-else
  // type C = never extends string ? true: false  // (true, move to then)
  // type D = never extends never ? true: false   // (true)
  const Left = Type.Dependent(Type.Number(), Type.Literal(1), Type.Never())
  const Right = Type.Dependent(Type.String(), Type.Literal(1), Type.Never())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 51', () => {
  const Left = Type.Dependent(Type.Number(), Type.Literal(1), Type.Never())
  const Right = Type.Dependent(Type.String(), Type.Literal(1), Type.Unknown())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 52', () => {
  const Left = Type.Dependent(Type.Boolean(), Type.Literal(true), Type.Literal(false))
  const Right = Type.Dependent(Type.Boolean(), Type.Literal(true), Type.Literal(false))
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 53', () => {
  const Left = Type.Dependent(Type.Boolean(), Type.Literal(true), Type.Never())
  const Right = Type.Dependent(Type.Boolean(), Type.Boolean(), Type.Never())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 54', () => {
  const Left = Type.Dependent(Type.Never(), Type.Literal(1), Type.Never())
  const Right = Type.Dependent(Type.Number(), Type.Literal(1), Type.Never())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 55', () => {
  const Left = Type.Dependent(Type.Unknown(), Type.Literal(1), Type.Never())
  const Right = Type.Dependent(Type.Number(), Type.Literal(1), Type.Never())
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
// ------------------------------------------------------------------
// Nested Dependent
// ------------------------------------------------------------------
Test('Should Extends 56', () => {
  const Left = Type.Dependent(
    Type.Number(),
    Type.Dependent(Type.String(), Type.Literal('a'), Type.Never()),
    Type.Never()
  )
  const Right = Type.Literal('a')
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 57', () => {
  const Left = Type.Dependent(
    Type.Number(),
    Type.Never(),
    Type.Dependent(Type.String(), Type.Literal('a'), Type.Never())
  )
  const Right = Type.Literal('a')
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 58', () => {
  const Left = Type.Dependent(
    Type.Number(),
    Type.Dependent(Type.String(), Type.Literal('a'), Type.Never()),
    Type.Literal(1)
  )
  const Right = Type.String()
  const Result: Type.ExtendsResult.TExtendsFalse = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(Result))
})
Test('Should Extends 59', () => {
  const Left = Type.Dependent(
    Type.Number(),
    Type.Dependent(Type.String(), Type.Literal('a'), Type.Never()),
    Type.Never()
  )
  const Right = Type.String()
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 60', () => {
  const Left = Type.Dependent(
    Type.Number(),
    Type.Never(),
    Type.Dependent(Type.String(), Type.Never(), Type.Literal(1))
  )
  const Right = Type.Literal(1)
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
// ------------------------------------------------------------------
// Dependent Nested Extended
// ------------------------------------------------------------------
Test('Should Extends 61', () => {
  // conditional:
  // type A = number extends number ? true : false // (true, move to then → 1)
  // type B = never  extends number ? true : false // (true, move to then → 1)
  // into left:
  // type C = 1 extends 1 ? true : false // (true, move to then → 'yes')
  // type D = never extends 1 ? true : false // (true, move to then → 'yes')
  // result:
  // type E = 'yes' extends 'yes' ? true : false // (true)
  const Condition = Type.Dependent(Type.Number(), Type.Literal(1), Type.Never())
  const Left = Type.Dependent(Condition, Type.Literal('yes'), Type.Literal('no'))
  const Right = Type.Literal('yes')
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 62', () => {
  const Condition = Type.Dependent(Type.Number(), Type.Literal(1), Type.Never())
  const Left = Type.Dependent(Condition, Type.Literal('yes'), Type.Never())
  const Right = Type.Literal('yes')
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 63', () => {
  const Condition = Type.Dependent(Type.Never(), Type.Literal(1), Type.Never())
  const Left = Type.Dependent(Condition, Type.Literal('yes'), Type.Never())
  const Right = Type.Literal('yes')
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
Test('Should Extends 64', () => {
  const Condition = Type.Dependent(Type.Unknown(), Type.Literal(1), Type.Never())
  const Left = Type.Dependent(Condition, Type.Literal('yes'), Type.Literal('no'))
  const Right = Type.String()
  const Result: Type.ExtendsResult.TExtendsTrue = Extends({}, Left, Right)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(Result))
})
