import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Extract')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Extract 1', () => {
  const A = Type.Ref('A')
  const B = Type.Literal(1)
  const T: Type.TDeferred<'Extract', [Type.TRef<'A'>, Type.TLiteral<1>]> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Extract')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
  Assert.IsEqual(T.parameters[1].const, 1)
})
Test('Should Extract 2', () => {
  const A = Type.Literal(1)
  const B = Type.Ref('A')
  const T: Type.TDeferred<'Extract', [Type.TLiteral<1>, Type.TRef<'A'>]> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Extract')
  Assert.IsEqual(T.parameters[0].const, 1)
  Assert.IsEqual(T.parameters[1].$ref, 'A')
})
Test('Should Extract 3', () => {
  const A = Type.Ref('A')
  const B = Type.Ref('B')
  const T: Type.TDeferred<'Extract', [Type.TRef<'A'>, Type.TRef<'B'>]> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Extract')
  Assert.IsEqual(T.parameters[0].$ref, 'A')
  Assert.IsEqual(T.parameters[1].$ref, 'B')
})
// ------------------------------------------------------------------
// Expression
// ------------------------------------------------------------------
Test('Should Extract 4', () => {
  const A = Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3)])
  const B = Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3)])
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 2)
  Assert.IsEqual(T.anyOf[2].const, 3)
})
Test('Should Extract 5', () => {
  const A = Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3)])
  const B = Type.Union([Type.Literal(1), Type.Literal(2)])
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>]> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 2)
})
Test('Should Extract 6', () => {
  const A = Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3)])
  const B = Type.Union([Type.Literal(1)])
  const T: Type.TLiteral<1> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})
Test('Should Extract 7', () => {
  const A = Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3)])
  const B = Type.Union([])
  const T: Type.TNever = Type.Extract(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Extract 8', () => {
  const A = Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3)])
  const B = Type.Union([Type.Literal(4)]) // unknown
  const T: Type.TNever = Type.Extract(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Extract 9', () => {
  const A = Type.Literal(1)
  const B = Type.Literal(1)
  const T: Type.TLiteral<1> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})
Test('Should Extract 10', () => {
  const A = Type.Literal(1)
  const B = Type.Literal(2)
  const T: Type.TNever = Type.Extract(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Extract 11', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ x: Type.Number() })
  const T: Type.TObject<{ x: Type.TNumber }> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
})
Test('Should Extract 12', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ y: Type.Number() })
  const T: Type.TNever = Type.Extract(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Extract 13', () => {
  const A = Type.Union([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const B = Type.Object({ y: Type.Number() })
  const T: Type.TObject<{ y: Type.TNumber }> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
})
Test('Should Extract 14', () => {
  const A = Type.Tuple([Type.Literal(0), Type.Literal(1)])
  const B = Type.Tuple([Type.Literal(0), Type.Literal(1)])
  const T: Type.TTuple<[Type.TLiteral<0>, Type.TLiteral<1>]> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 0)
  Assert.IsEqual(T.items[1].const, 1)
})
Test('Should Extract 15', () => {
  const A = Type.Tuple([Type.Literal(0), Type.Literal(1)])
  const B = Type.Tuple([Type.Literal(1), Type.Literal(1)])
  const T: Type.TNever = Type.Extract(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Extract 16', () => {
  const A = Type.Union([
    Type.Tuple([Type.Literal(0), Type.Literal(1)]),
    Type.Tuple([Type.Literal(1), Type.Literal(1)])
  ])
  const B = Type.Tuple([Type.Literal(1), Type.Literal(1)])
  const T: Type.TTuple<[
    Type.TLiteral<1>,
    Type.TLiteral<1>
  ]> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 1)
})
Test('Should Extract 17', () => {
  const A = Type.Literal(1)
  const B = Type.Number()
  const T: Type.TLiteral<1> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})
Test('Should Extract 18', () => {
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
  const T: Type.TUnion<[
    Type.TLiteral<1>,
    Type.TLiteral<2>,
    Type.TLiteral<3>
  ]> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 2)
  Assert.IsEqual(T.anyOf[2].const, 3)
})
Test('Should Extract 19', () => {
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
  const T: Type.TUnion<[
    Type.TLiteral<1>,
    Type.TLiteral<2>
  ]> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 2)
})
Test('Should Extract 20', () => {
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
    Type.TLiteral<1>,
    Type.TLiteral<2>,
    Type.TLiteral<3>
  ]> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 2)
  Assert.IsEqual(T.anyOf[2].const, 3)
})
// ------------------------------------------------------------------
// Enum: Right
// ------------------------------------------------------------------
Test('Should Extract 21', () => {
  const A = Type.Union([
    Type.Literal(1),
    Type.Literal(2),
    Type.Literal(3)
  ])
  const B = Type.Enum([4])
  const T: Type.TNever = Type.Extract(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Extract 22', () => {
  const A = Type.Union([
    Type.Literal(1),
    Type.Literal(2),
    Type.Literal(3)
  ])
  const B = Type.Enum([1])
  const T: Type.TLiteral<1> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})
Test('Should Extract 23', () => {
  const A = Type.Union([
    Type.Literal(1),
    Type.Literal(2),
    Type.Literal(3)
  ])
  const B = Type.Enum([1, 2])
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>]> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 2)
})

// ------------------------------------------------------------------
// Enum: Left
// ------------------------------------------------------------------
Test('Should Extract 24', () => {
  const A = Type.Enum([1, 2, 3])
  const B = Type.Union([
    Type.Literal(4)
  ])
  const T: Type.TNever = Type.Extract(A, B)
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Extract 25', () => {
  const A = Type.Enum([1, 2, 3])
  const B = Type.Union([
    Type.Literal(1)
  ])
  const T: Type.TLiteral<1> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})
Test('Should Extract 26', () => {
  const A = Type.Enum([1, 2, 3])
  const B = Type.Union([
    Type.Literal(1),
    Type.Literal(2)
  ])
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>]> = Type.Extract(A, B)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 2)
})
