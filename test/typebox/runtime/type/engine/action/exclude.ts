import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Exclude')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Exclude 1', () => {
  const A = Type.Ref('A')
  const B = Type.Literal(1)
  const T: Type.TDeferred<'Exclude', [Type.TRef<'A'>, Type.TLiteral<1>]> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Exclude')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
  Assert.IsEqual(T.parameters[1].const, 1)
})
Test('Should Exclude 2', () => {
  const A = Type.Literal(1)
  const B = Type.Ref('A')
  const T: Type.TDeferred<'Exclude', [Type.TLiteral<1>, Type.TRef<'A'>]> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Exclude')
  Assert.IsEqual(T.parameters[0].const, 1)
  Assert.IsEqual(T.parameters[1].$ref, 'A')
})
Test('Should Exclude 3', () => {
  const A = Type.Ref('A')
  const B = Type.Ref('B')
  const T = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Exclude')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
  Assert.IsEqual(T.parameters[1].$ref, 'B')
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should Exclude 4', () => {
  const A = Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3)])
  const B = Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3)])
  const T: Type.TNever = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Exclude 5', () => {
  const A = Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3)])
  const B = Type.Union([Type.Literal(1), Type.Literal(2)])
  const T: Type.TLiteral<3> = Type.Exclude(A, B)
  Assert.IsEqual(T.const, 3)
})
Test('Should Exclude 6', () => {
  const A = Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3)])
  const B = Type.Union([Type.Literal(1)])
  const T: Type.TUnion<[Type.TLiteral<2>, Type.TLiteral<3>]> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 2)
  Assert.IsEqual(T.anyOf[1].const, 3)
})
Test('Should Exclude 7', () => {
  const A = Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3)])
  const B = Type.Union([])
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 2)
  Assert.IsEqual(T.anyOf[2].const, 3)
})
Test('Should Exclude 8', () => {
  const A = Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3)])
  const B = Type.Union([Type.Literal(4)]) // unknown
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 2)
  Assert.IsEqual(T.anyOf[2].const, 3)
})
Test('Should Exclude 9', () => {
  const A = Type.Literal(1)
  const B = Type.Literal(1)
  const T: Type.TNever = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Exclude 10', () => {
  const A = Type.Literal(1)
  const B = Type.Literal(2)
  const T: Type.TLiteral<1> = Type.Exclude(A, B)
  Assert.IsEqual(T.const, 1)
})
Test('Should Exclude 11', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ x: Type.Number() })
  const T: Type.TNever = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Exclude 12', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ y: Type.Number() })
  const T: Type.TObject<{ x: Type.TNumber }> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
Test('Should Exclude 13', () => {
  const A = Type.Union([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const B = Type.Object({ y: Type.Number() })
  const T: Type.TObject<{ x: Type.TNumber }> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
Test('Should Exclude 14', () => {
  const A = Type.Tuple([Type.Literal(0), Type.Literal(1)])
  const B = Type.Tuple([Type.Literal(0), Type.Literal(1)])
  const T: Type.TNever = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Exclude 15', () => {
  const A = Type.Tuple([Type.Literal(0), Type.Literal(1)])
  const B = Type.Tuple([Type.Literal(1), Type.Literal(1)])
  const T: Type.TTuple<[
    Type.TLiteral<0>,
    Type.TLiteral<1>
  ]> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 0)
  Assert.IsEqual(T.items[1].const, 1)
})
Test('Should Exclude 16', () => {
  const A = Type.Union([
    Type.Tuple([Type.Literal(0), Type.Literal(1)]),
    Type.Tuple([Type.Literal(1), Type.Literal(1)])
  ])
  const B = Type.Tuple([Type.Literal(1), Type.Literal(1)])
  const T: Type.TTuple<[
    Type.TLiteral<0>,
    Type.TLiteral<1>
  ]> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 0)
  Assert.IsEqual(T.items[1].const, 1)
})
Test('Should Exclude 17', () => {
  const A = Type.Literal(1)
  const B = Type.Number()
  const T: Type.TNever = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Exclude 18', () => {
  const A = Type.Union([
    Type.Literal(1),
    Type.Union([
      Type.Literal(2),
      Type.Union([
        Type.Literal(3)
      ])
    ])
  ])
  const B = Type.Number()
  const T: Type.TNever = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Exclude 19', () => {
  const A = Type.Union([
    Type.Literal(1),
    Type.Union([
      Type.Literal(2),
      Type.Union([
        Type.String()
      ])
    ])
  ])
  const B = Type.Number()
  const T: Type.TString = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Exclude 20', () => {
  const A = Type.Union([
    Type.Literal(1),
    Type.Union([
      Type.Literal(2),
      Type.Union([
        Type.String()
      ])
    ]),
    Type.Union([
      Type.Literal(3),
      Type.Union([
        Type.Boolean()
      ])
    ])
  ])
  const B = Type.Number()
  const T: Type.TUnion<[
    Type.TString,
    Type.TBoolean
  ]> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsBoolean(T.anyOf[1]))
})
// ------------------------------------------------------------------
// Enum: Right
// ------------------------------------------------------------------
Test('Should Exclude 21', () => {
  const A = Type.Union([
    Type.Literal(1),
    Type.Literal(2),
    Type.Literal(3)
  ])
  const B = Type.Enum([4])
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 2)
  Assert.IsEqual(T.anyOf[2].const, 3)
})
Test('Should Exclude 22', () => {
  const A = Type.Union([
    Type.Literal(1),
    Type.Literal(2),
    Type.Literal(3)
  ])
  const B = Type.Enum([1])
  const T: Type.TUnion<[Type.TLiteral<2>, Type.TLiteral<3>]> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 2)
  Assert.IsEqual(T.anyOf[1].const, 3)
})
Test('Should Exclude 23', () => {
  const A = Type.Union([
    Type.Literal(1),
    Type.Literal(2),
    Type.Literal(3)
  ])
  const B = Type.Enum([1, 2])
  const T: Type.TLiteral<3> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 3)
})

// ------------------------------------------------------------------
// Enum: Left
// ------------------------------------------------------------------
Test('Should Exclude 24', () => {
  const A = Type.Enum([1, 2, 3])
  const B = Type.Union([
    Type.Literal(4)
  ])
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 2)
  Assert.IsEqual(T.anyOf[2].const, 3)
})
Test('Should Exclude 25', () => {
  const A = Type.Enum([1, 2, 3])
  const B = Type.Union([
    Type.Literal(1)
  ])
  const T: Type.TUnion<[Type.TLiteral<2>, Type.TLiteral<3>]> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 2)
  Assert.IsEqual(T.anyOf[1].const, 3)
})
Test('Should Exclude 26', () => {
  const A = Type.Enum([1, 2, 3])
  const B = Type.Union([
    Type.Literal(1),
    Type.Literal(2)
  ])
  const T: Type.TLiteral<3> = Type.Exclude(A, B)
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 3)
})
