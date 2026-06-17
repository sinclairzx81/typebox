import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Object')

// ------------------------------------------------------------------
// Identity
// ------------------------------------------------------------------
Test('Should Extends 0', () => {
  Assert.IsExtends<{ x: number }, { x: number }>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Object({ x: Type.Number() }), Type.Object({ x: Type.Number() }))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<{ x: number }, null>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Object({ x: Type.Number() }), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, { x: number }>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Object({ x: Type.Number() }))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Subtype
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<{ x: 1 }, { x: number }>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Object({ x: Type.Literal(1) }), Type.Object({ x: Type.Number() }))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtends<{ x: number }, { x: 1 }>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Object({ x: Type.Number() }), Type.Object({ x: Type.Literal(1) }))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
Test('Should Extends 5', () => {
  Assert.IsExtends<{ x: number; y: number }, { x: number; y: number }>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Object({ x: Type.Number(), y: Type.Number() }), Type.Object({ x: Type.Number(), y: Type.Number() }))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 6', () => {
  Assert.IsExtends<{ x: number; y: number }, { x: number }>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Object({ x: Type.Number(), y: Type.Number() }), Type.Object({ x: Type.Number() }))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 7', () => {
  Assert.IsExtends<{ y: number }, { x: number; y: number }>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Object({ y: Type.Number() }), Type.Object({ x: Type.Number(), y: Type.Number() }))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Property Modifiers
// ------------------------------------------------------------------
Test('Should Extends 8', () => {
  Assert.IsExtends<{ x: number; y: number }, { x: number; y?: number }>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Object({ x: Type.Number(), y: Type.Number() }), Type.Object({ x: Type.Number(), y: Type.Optional(Type.Number()) }))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 9', () => {
  Assert.IsExtends<{ x: number; y?: number }, { x: number; y: number }>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Object({ x: Type.Number(), y: Type.Optional(Type.Number()) }), Type.Object({ x: Type.Number(), y: Type.Number() }))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should Extends 10', () => {
  Assert.IsExtends<{ x: number; y: number }, { x: number; readonly y: number }>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Object({ x: Type.Number(), y: Type.Number() }), Type.Object({ x: Type.Number(), y: Type.Readonly(Type.Number()) }))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 11', () => {
  Assert.IsExtends<{ x: number; readonly y: number }, { x: number; y: number }>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Object({ x: Type.Number(), y: Type.Readonly(Type.Number()) }), Type.Object({ x: Type.Number(), y: Type.Number() }))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 12', () => {
  Assert.IsExtends<{ x: number; y: number }, { x: number; readonly y?: number }>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Object({ x: Type.Number(), y: Type.Number() }), Type.Object({ x: Type.Number(), y: Type.Optional(Type.Readonly(Type.Number())) }))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 13', () => {
  Assert.IsExtends<{ x: number; readonly y?: number }, { x: number; y: number }>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Object({ x: Type.Number(), y: Type.Optional(Type.Readonly(Type.Number())) }), Type.Object({ x: Type.Number(), y: Type.Number() }))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})

Test('Should Extends 14', () => {
  Assert.IsExtends<{ x?: number; y?: number }, { x?: number; y?: number }>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Object({ x: Type.Optional(Type.Number()), y: Type.Optional(Type.Number()) }), Type.Object({ x: Type.Optional(Type.Number()), y: Type.Optional(Type.Number()) }))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Optionality
// ------------------------------------------------------------------
Test('Should Extends 15', () => {
  Assert.IsExtends<{}, { x?: number }>(true)
  const R = Extends({}, Type.Object({}), Type.Object({ x: Type.Optional(Type.Number()) }))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 16', () => {
  Assert.IsExtends<{ y: number }, { x?: number; y: number }>(true)
  const R = Extends({}, Type.Object({ y: Type.Number() }), Type.Object({ x: Type.Optional(Type.Number()) }))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 17', () => {
  Assert.IsExtends<{ x: string; y: number }, { x?: number; y: number }>(false)
  const R: Type.ExtendsResult.TExtendsFalse = Extends({}, Type.Object({ x: Type.String(), y: Type.Number() }), Type.Object({ x: Type.Optional(Type.Number()) }))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Optionality | Inferred
// ------------------------------------------------------------------
Test('Should Extends 18', () => {
  const R = Extends({}, Type.Object({}), Type.Object({ x: Type.Optional(Type.Infer('A')) }))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
  Assert.IsTrue(Type.IsUnknown(R.inferred.A))
})
Test('Should Extends 19', () => {
  const R = Extends({}, Type.Object({}), Type.Object({ x: Type.Optional(Type.Infer('A', Type.Number())) }))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
  Assert.IsTrue(Type.IsNumber(R.inferred.A))
})
Test('Should Extends 20', () => {
  const R = Extends({}, Type.Object({ y: Type.Number() }), Type.Object({ x: Type.Optional(Type.Infer('A')), y: Type.Infer('B') }))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
  Assert.IsTrue(Type.IsUnknown(R.inferred.A))
  Assert.IsTrue(Type.IsNumber(R.inferred.B))
})
// ------------------------------------------------------------------
// ExtendsRecord
// ------------------------------------------------------------------
Test('Should Extends 21', () => {
  const L = Type.Object({ x: Type.Literal(1), y: Type.Literal(2) })
  const R = Type.Record(Type.String(), Type.Number())
  const T: Type.ExtendsResult.TExtendsTrue<{}> = Extends({}, L, R)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(T))
})
Test('Should Extends 22', () => {
  const L = Type.Object({ x: Type.Literal(1), y: Type.Literal(2) })
  const R = Type.Record(Type.String(), Type.String())
  const T: Type.ExtendsResult.TExtendsFalse = Extends({}, L, R)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(T))
})
Test('Should Extends 23', () => {
  const L = Type.Object({ x: Type.Literal(1), y: Type.Literal(2) })
  const R = Type.Record(Type.String(), Type.Infer('X'))
  // CACHE | TYPESCRIPT TYPE ID ORDER ISSUE
  const T /*: Type.ExtendsResult.TExtendsTrue<{
    X: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>]>
  }> */ = Extends({}, L, R)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(T))
  Assert.IsTrue(Type.IsUnion(T.inferred.X))
  Assert.IsEqual(T.inferred.X.anyOf[0].const, 1)
  Assert.IsEqual(T.inferred.X.anyOf[1].const, 2)
})
Test('Should Extends 24', () => {
  const L = Type.Object({ x: Type.Literal(1), y: Type.Literal(2) })
  const R = Type.Record(Type.String(), Type.Infer('X', Type.Number()))
  // CACHE | TYPESCRIPT TYPE ID ORDER ISSUE
  const T /*: Type.ExtendsResult.TExtendsTrue<{
    X: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>]>
  }> */ = Extends({}, L, R)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(T))
  Assert.IsTrue(Type.IsUnion(T.inferred.X))
  Assert.IsEqual(T.inferred.X.anyOf[0].const, 1)
  Assert.IsEqual(T.inferred.X.anyOf[1].const, 2)
})
Test('Should Extends 25', () => {
  const L = Type.Object({ x: Type.Literal(1), y: Type.Literal(2), z: Type.Literal(3) })
  const R = Type.Record(Type.String(), Type.Infer('X', Type.Number()))
  // CACHE | TYPESCRIPT TYPE ID ORDER ISSUE
  const T /*: Type.ExtendsResult.TExtendsTrue<{
    X: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]>
  }> */ = Extends({}, L, R)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(T))
  Assert.IsTrue(Type.IsUnion(T.inferred.X))
  Assert.IsEqual(T.inferred.X.anyOf[0].const, 1)
  Assert.IsEqual(T.inferred.X.anyOf[1].const, 2)
  Assert.IsEqual(T.inferred.X.anyOf[2].const, 3)
})
Test('Should Extends 26', () => {
  const L = Type.Object({ x: Type.Literal(1), y: Type.Literal(2) })
  const R = Type.Record(Type.String(), Type.Infer('X', Type.String()))
  const T: Type.ExtendsResult.TExtendsFalse = Extends({}, L, R)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(T))
})
