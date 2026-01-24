import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Tuple')

Test('Should not guard Tuple', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsTuple(T))
})
Test('Should Create Tuple', () => {
  const T: Type.TTuple<[Type.TNull, Type.TNumber]> = Type.Tuple([Type.Null(), Type.Number()])
})
Test('Should Create Tuple and Guard 1', () => {
  const T: Type.TTuple<[Type.TNull, Type.TNumber]> = Type.Tuple([Type.Null(), Type.Number()])
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsNull(T.items[0]))
  Assert.IsTrue(Type.IsNumber(T.items[1]))
  Assert.IsTrue(T.items.length === 2)
  Assert.IsTrue(T.additionalItems === false)
})
Test('Should Create Tuple and Guard 2', () => {
  const S: Type.TTuple<[Type.TNull, Type.TRest<Type.TArray<Type.TNumber>>]> = Type.Tuple([Type.Null(), Type.Rest(Type.Array(Type.Number()))])
  const T: Type.TTuple<[Type.TNull, Type.TNever]> = Type.Instantiate({}, S)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsNull(T.items[0]))
  Assert.IsTrue(Type.IsNever(T.items[1]))
  Assert.IsTrue(T.items.length === 2)
  Assert.IsTrue(T.additionalItems === false)
})
Test('Should Create Tuple with options', () => {
  const T: Type.TTuple<[Type.TNull, Type.TNumber]> = Type.Tuple([Type.Null(), Type.Number()], { a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Create Tuple with options then extract', () => {
  const T = Type.Tuple([Type.Null(), Type.Number()], { a: 1, b: 2 })
  const O = Type.TupleOptions(T)
  Assert.IsFalse(Type.IsTuple(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
// ------------------------------------------------------------------
// Optional Elements
// ------------------------------------------------------------------
Test('Should Create Tuple with optional elements at the end', () => {
  const T = Type.Tuple([
    Type.String(),
    Type.Number(),
    Type.Optional(Type.Boolean()),
    Type.Optional(Type.Null()),
  ])
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items.length, 4)
  Assert.IsEqual(T.minItems, 2) // Only first two are non-optional
})
Test('Should Create Tuple with all required elements', () => {
  const T = Type.Tuple([
    Type.String(),
    Type.Number(),
    Type.Boolean(),
  ])
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items.length, 3)
  Assert.IsEqual(T.minItems, 3) // All are required
})
Test('Should Create Tuple with all optional elements', () => {
  const T = Type.Tuple([
    Type.Optional(Type.String()),
    Type.Optional(Type.Number()),
  ])
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items.length, 2)
  Assert.IsEqual(T.minItems, 0) // All are optional
})
Test('Should throw error when optional element is in the middle', () => {
  Assert.Throws(() => {
    Type.Tuple([
      Type.String(),
      Type.Optional(Type.Number()),
      Type.Boolean(), // Non-optional after optional - should error
    ])
  })
})
Test('Should throw error when optional element is followed by non-optional', () => {
  Assert.Throws(() => {
    Type.Tuple([
      Type.String(),
      Type.Optional(Type.Number()),
      Type.Optional(Type.Boolean()),
      Type.String(), // Non-optional after optional - should error
    ])
  })
})