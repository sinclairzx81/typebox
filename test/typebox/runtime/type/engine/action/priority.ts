import { Assert } from 'test'

import Type, { Priority } from 'typebox'

const Test = Assert.Context('Type.Engine.Priority')

// ------------------------------------------------------------------
// Empty
// ------------------------------------------------------------------
Test('Should Priority 1', () => {
  const T: [] = Priority([])
  Assert.IsEqual(T.length, 0)
})
// ------------------------------------------------------------------
// Single
// ------------------------------------------------------------------
Test('Should Priority 2', () => {
  const T: [Type.TLiteral<1>] = Priority([Type.Literal(1)])
  Assert.IsEqual(T[0].const, 1)
})
Test('Should Priority 3', () => {
  const T: [Type.TObject<{ x: Type.TNumber }>] = Priority([Type.Object({ x: Type.Number() })])
  Assert.IsTrue(Type.IsObject(T[0]))
  Assert.IsTrue(Type.IsNumber(T[0].properties.x))
})
// ------------------------------------------------------------------
// Literals (disjoint)
// ------------------------------------------------------------------
Test('Should Priority 4', () => {
  const T: [Type.TLiteral<3>, Type.TLiteral<1>, Type.TLiteral<2>] = Priority([Type.Literal(3), Type.Literal(1), Type.Literal(2)])
  Assert.IsEqual(T[0].const, 3)
  Assert.IsEqual(T[1].const, 1)
  Assert.IsEqual(T[2].const, 2)
})
// ------------------------------------------------------------------
// Objects (subtype relationship)
// ------------------------------------------------------------------
Test('Should Priority 5', () => {
  const T: [
    Type.TObject<{ x: Type.TNumber; y: Type.TNumber; z: Type.TNumber }>,
    Type.TObject<{ x: Type.TNumber; y: Type.TNumber }>,
    Type.TObject<{ x: Type.TNumber }>
  ] = Priority([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() }),
    Type.Object({ x: Type.Number(), y: Type.Number() })
  ])
  Assert.IsTrue(Type.IsObject(T[0]))
  Assert.IsTrue(Type.IsNumber(T[0].properties.x))
  Assert.IsTrue(Type.IsNumber(T[0].properties.y))
  Assert.IsTrue(Type.IsNumber(T[0].properties.z))
  Assert.IsTrue(Type.IsObject(T[1]))
  Assert.IsTrue(Type.IsNumber(T[1].properties.x))
  Assert.IsTrue(Type.IsNumber(T[1].properties.y))
  Assert.IsTrue(Type.IsObject(T[2]))
  Assert.IsTrue(Type.IsNumber(T[2].properties.x))
})
// ------------------------------------------------------------------
// Mixed (literals + objects)
// ------------------------------------------------------------------
Test('Should Priority 6', () => {
  const T: [
    Type.TLiteral<2>,
    Type.TObject<{ x: Type.TNumber; y: Type.TNumber; z: Type.TNumber }>,
    Type.TLiteral<1>,
    Type.TObject<{ x: Type.TNumber; y: Type.TNumber }>,
    Type.TObject<{ x: Type.TNumber }>,
    Type.TLiteral<3>
  ] = Priority([
    Type.Literal(2),
    Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() }),
    Type.Literal(1),
    Type.Object({ x: Type.Number() }),
    Type.Literal(3),
    Type.Object({ x: Type.Number(), y: Type.Number() })
  ])
  Assert.IsEqual(T[0].const, 2)
  Assert.IsTrue(Type.IsObject(T[1]))
  Assert.IsTrue(Type.IsNumber(T[1].properties.z))
  Assert.IsEqual(T[2].const, 1)
  Assert.IsTrue(Type.IsObject(T[3]))
  Assert.IsTrue(Type.IsNumber(T[3].properties.y))
  Assert.IsTrue(Type.IsObject(T[4]))
  Assert.IsTrue(Type.IsNumber(T[4].properties.x))
  Assert.IsEqual(T[5].const, 3)
})

// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
Test('Should Priority 7', () => {
  const T: [
    Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>]>,
    Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]>,
    Type.TObject<{ x: Type.TNumber }>
  ] = Priority([
    Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3)]),
    Type.Object({ x: Type.Number() }),
    Type.Union([Type.Literal(1), Type.Literal(2)])
  ])
  Assert.IsTrue(Type.IsUnion(T[0]))
  Assert.IsEqual(T[0].anyOf.length, 2)
  Assert.IsTrue(Type.IsUnion(T[1]))
  Assert.IsEqual(T[1].anyOf.length, 3)
  Assert.IsTrue(Type.IsObject(T[2]))
  Assert.IsTrue(Type.IsNumber(T[2].properties.x))
})
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
Test('Should Priority 8', () => {
  const T: [
    Type.TIntersect<[Type.TObject<{ x: Type.TNumber }>, Type.TObject<{ y: Type.TNumber }>, Type.TObject<{ z: Type.TNumber }>]>,
    Type.TIntersect<[Type.TObject<{ x: Type.TNumber }>, Type.TObject<{ y: Type.TNumber }>]>,
    Type.TObject<{ x: Type.TNumber }>
  ] = Priority([
    Type.Object({ x: Type.Number() }),
    Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() }), Type.Object({ z: Type.Number() })]),
    Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
  ])
  Assert.IsTrue(Type.IsIntersect(T[0]))
  Assert.IsEqual(T[0].allOf.length, 3)
  Assert.IsTrue(Type.IsIntersect(T[1]))
  Assert.IsEqual(T[1].allOf.length, 2)
  Assert.IsTrue(Type.IsObject(T[2]))
  Assert.IsTrue(Type.IsNumber(T[2].properties.x))
})
// ------------------------------------------------------------------
// Already sorted (idempotent)
// ------------------------------------------------------------------
Test('Should Priority 9', () => {
  const T: [
    Type.TLiteral<1>,
    Type.TLiteral<3>,
    Type.TLiteral<2>
  ] = Priority([Type.Literal(1), Type.Literal(3), Type.Literal(2)])
  Assert.IsEqual(T[0].const, 1)
  Assert.IsEqual(T[1].const, 3)
  Assert.IsEqual(T[2].const, 2)
})
Test('Should Priority 10', () => {
  const T: [
    Type.TObject<{ x: Type.TNumber; y: Type.TNumber; z: Type.TNumber }>,
    Type.TObject<{ x: Type.TNumber; y: Type.TNumber }>,
    Type.TObject<{ x: Type.TNumber }>
  ] = Priority([
    Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() }),
    Type.Object({ x: Type.Number(), y: Type.Number() }),
    Type.Object({ x: Type.Number() })
  ])
  Assert.IsTrue(Type.IsNumber(T[0].properties.z))
  Assert.IsTrue(Type.IsNumber(T[1].properties.y))
  Assert.IsTrue(Type.IsNumber(T[2].properties.x))
})
// ------------------------------------------------------------------
// UnionPrioritySort (Runtime Rests)
// ------------------------------------------------------------------
Test('Should Priority 11', () => {
  const A = Type.String()
  const B = Type.Number()
  const C = Type.Boolean()
  const R: [Type.TString, Type.TNumber, Type.TBoolean] = Priority([A, B, C])
  Assert.IsEqual(R, [A, B, C])
})
Test('Should Priority 12', () => {
  const A = Type.Number()
  const B = Type.Boolean()
  const C = Type.String()
  const R: [Type.TNumber, Type.TBoolean, Type.TString] = Priority([A, B, C])
  Assert.IsEqual(R, [A, B, C])
})
Test('Should Priority 13', () => {
  const A = Type.Boolean()
  const B = Type.String()
  const C = Type.Number()
  const R: [Type.TBoolean, Type.TString, Type.TNumber] = Priority([A, B, C])
  Assert.IsEqual(R, [A, B, C])
})
Test('Should Priority 14', () => {
  const A = Type.String()
  const B = Type.Literal('A')
  const R: [Type.TLiteral<'A'>, Type.TString] = Priority([A, B])
  Assert.IsEqual(R, [B, A])
})
Test('Should Priority 15', () => {
  const A = Type.Number()
  const B = Type.Literal(1)
  const R: [Type.TLiteral<1>, Type.TNumber] = Priority([A, B])
  Assert.IsEqual(R, [B, A])
})
Test('Should Priority 16', () => {
  const A = Type.Object({ a: Type.String(), b: Type.Number() })
  const B = Type.Object({ a: Type.String() })
  const R: [
    Type.TObject<{
      a: Type.TString
      b: Type.TNumber
    }>,
    Type.TObject<{
      a: Type.TString
    }>
  ] = Priority([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should Priority 17', () => {
  const A = Type.Object({ a: Type.Literal('A') })
  const B = Type.Object({ a: Type.String() })
  const R: [
    Type.TObject<{
      a: Type.TLiteral<'A'>
    }>,
    Type.TObject<{
      a: Type.TString
    }>
  ] = Priority([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should Priority 18', () => {
  const A = Type.Tuple([Type.String(), Type.Number()])
  const B = Type.Tuple([Type.String()])
  const R: [Type.TTuple<[Type.TString]>, Type.TTuple<[Type.TString, Type.TNumber]>] = Priority([B, A])
  Assert.IsEqual(R, [B, A])
})
Test('Should Priority 19', () => {
  const A = Type.Object({ a: Type.String() })
  const B = Type.Object({ a: Type.Optional(Type.String()) })
  const R: [
    Type.TObject<{
      a: Type.TString
    }>,
    Type.TObject<{
      a: Type.TOptional<Type.TString>
    }>
  ] = Priority([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should Priority 20', () => {
  const A = Type.Intersect([Type.Object({ a: Type.String() }), Type.Object({ b: Type.Number() })])
  const B = Type.Object({ a: Type.String() })
  const R: [
    Type.TIntersect<[
      Type.TObject<{
        a: Type.TString
      }>,
      Type.TObject<{
        b: Type.TNumber
      }>
    ]>,
    Type.TObject<{
      a: Type.TString
    }>
  ] = Priority([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should Priority 21', () => {
  const A = Type.Literal('C')
  const B = Type.Literal('B')
  const C = Type.Literal('A')
  const R: [Type.TLiteral<'C'>, Type.TLiteral<'B'>, Type.TLiteral<'A'>] = Priority([A, B, C])
  Assert.IsEqual(R, [A, B, C])
})
Test('Should Priority 22', () => {
  const A = Type.Any()
  const B = Type.String()
  const C = Type.Literal('A')
  const R: [Type.TLiteral<'A'>, Type.TString, Type.TAny] = Priority([A, B, C])
  Assert.IsEqual(R, [C, B, A])
})
Test('Should Priority 23', () => {
  const A = Type.Unknown()
  const B = Type.Number()
  const R: [Type.TNumber, Type.TUnknown] = Priority([A, B])
  Assert.IsEqual(R, [B, A])
})
Test('Should Priority 24', () => {
  const A = Type.Tuple([Type.String()])
  const B = Type.Array(Type.String())
  const R: [Type.TTuple<[Type.TString]>, Type.TArray<Type.TString>] = Priority([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should Priority 25', () => {
  const A = Type.Union([Type.Literal(1), Type.Literal(2)])
  const B = Type.Number()
  const R: [Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>]>, Type.TNumber] = Priority([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should Priority 26', () => {
  const A = Type.Object({ a: Type.Object({ b: Type.String() }) })
  const B = Type.Object({ a: Type.Object({}) })
  const R: [
    Type.TObject<{
      a: Type.TObject<{
        b: Type.TString
      }>
    }>,
    Type.TObject<{
      a: Type.TObject<{}>
    }>
  ] = Priority([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should Priority 27', () => {
  const A = Type.Null()
  const B = Type.Undefined()
  const C = Type.String()
  const R: [Type.TNull, Type.TUndefined, Type.TString] = Priority([A, B, C])
  Assert.IsEqual(R, [A, B, C])
})
Test('Should Priority 28', () => {
  const A = Type.Number()
  const B = Type.Integer()
  const R: [Type.TInteger, Type.TNumber] = Priority([A, B])
  Assert.IsEqual(R, [B, A])
})
Test('Should Priority 29', () => {
  const A = Type.String({ $id: 'A' })
  const B = Type.String({ $id: 'B' })
  const R: [Type.TString, Type.TString] = Priority([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should Priority 30', () => {
  const A = Type.Object({})
  const B = Type.Object({ x: Type.Number() })
  const R: [
    Type.TObject<{
      x: Type.TNumber
    }>,
    Type.TObject<{}>
  ] = Priority([A, B])
  Assert.IsEqual(R, [B, A])
})
Test('Should Priority 31', () => {
  const A = Type.Object({ a: Type.Object({ b: Type.Literal(1) }) })
  const B = Type.Object({ a: Type.Object({ b: Type.Number() }) })
  const R: [
    Type.TObject<{
      a: Type.TObject<{
        b: Type.TLiteral<1>
      }>
    }>,
    Type.TObject<{
      a: Type.TObject<{
        b: Type.TNumber
      }>
    }>
  ] = Priority([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should Priority 32', () => {
  const A = Type.Any()
  const B = Type.Literal(1)
  const C = Type.Number()
  const D = Type.Integer()
  const R: [Type.TLiteral<1>, Type.TInteger, Type.TNumber, Type.TAny] = Priority([A, B, C, D])
  Assert.IsEqual(R, [B, D, C, A])
})
Test('Should Priority 33', () => {
  const A = Type.Object({ a: Type.String() })
  const B = Type.Record(Type.String(), Type.Any())
  const R: [
    Type.TObject<{
      a: Type.TString
    }>,
    Type.TRecord<'^.*$', Type.TAny>
  ] = Priority([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should Priority 34', () => {
  const A = Type.Object({ a: Type.String() })
  const B = Type.Record(Type.String(), Type.Any())
  const R: [
    Type.TObject<{
      a: Type.TString
    }>,
    Type.TRecord<'^.*$', Type.TAny>
  ] = Priority([A, B])
  Assert.IsEqual(R, [A, B])
})
// ------------------------------------------------------------------
// Priority Should not Mutate Source Array
//
// https://github.com/sinclairzx81/typebox/issues/1620
// ------------------------------------------------------------------
Test('Should Priority 35', () => {
  const A = [
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Number(), y: Type.Number() })
  ]
  const B = [...A]
  Priority(A) // Priority Sort (A)
  Assert.IsEqual(A, B) // Expect Equal
})
