import Type from 'typebox'
import { UnionPrioritySort } from 'typebox/value'
import { Assert } from 'test'

// ------------------------------------------------------------------
// Note: Sorting order is determined by structural assignability
// (narrow-to-broad) via Compare, falling back to a deterministic
// JSON string comparison for disjoint types. Order may be subject
// to change based on Extends checks and the Hash algorithm used
// for deterministic compare (currently JSON.stringify).
//
// We test only for coverage.
//
// ------------------------------------------------------------------
const Test = Assert.Context('Value.Shared.UnionPrioritySort')

Test('Should UnionPrioritySort 1', () => {
  const A = Type.String()
  const B = Type.Number()
  const C = Type.Boolean()
  const R = UnionPrioritySort([A, B, C])
  Assert.IsEqual(R, [C, B, A])
})
Test('Should UnionPrioritySort 2', () => {
  const A = Type.Number()
  const B = Type.Boolean()
  const C = Type.String()
  const R = UnionPrioritySort([A, B, C])
  Assert.IsEqual(R, [B, A, C])
})
Test('Should UnionPrioritySort 3', () => {
  const A = Type.Boolean()
  const B = Type.String()
  const C = Type.Number()
  const R = UnionPrioritySort([A, B, C])
  Assert.IsEqual(R, [A, C, B])
})
Test('Should UnionPrioritySort 4', () => {
  const A = Type.String()
  const B = Type.Literal('A')
  const R = UnionPrioritySort([A, B])
  Assert.IsEqual(R, [B, A])
})
Test('Should UnionPrioritySort 5', () => {
  const A = Type.Number()
  const B = Type.Literal(1)
  const R = UnionPrioritySort([A, B])
  Assert.IsEqual(R, [B, A])
})
Test('Should UnionPrioritySort 6', () => {
  const A = Type.Object({ a: Type.String(), b: Type.Number() })
  const B = Type.Object({ a: Type.String() })
  const R = UnionPrioritySort([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should UnionPrioritySort 7', () => {
  const A = Type.Object({ a: Type.Literal('A') })
  const B = Type.Object({ a: Type.String() })
  const R = UnionPrioritySort([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should UnionPrioritySort 8', () => {
  const A = Type.Tuple([Type.String(), Type.Number()])
  const B = Type.Tuple([Type.String()])
  const R = UnionPrioritySort([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should UnionPrioritySort 9', () => {
  const A = Type.Literal('A')
  const B = Type.String()
  const R = UnionPrioritySort([A, B], -1)
  Assert.IsEqual(R, [B, A])
})
Test('Should UnionPrioritySort 10', () => {
  const A = Type.Object({ a: Type.String() })
  const B = Type.Object({ a: Type.Optional(Type.String()) })
  const R = UnionPrioritySort([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should UnionPrioritySort 11', () => {
  const A = Type.Intersect([Type.Object({ a: Type.String() }), Type.Object({ b: Type.Number() })])
  const B = Type.Object({ a: Type.String() })
  const R = UnionPrioritySort([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should UnionPrioritySort 12', () => {
  const A = Type.Literal('C')
  const B = Type.Literal('B')
  const C = Type.Literal('A')
  const R = UnionPrioritySort([A, B, C])
  Assert.IsEqual(R, [C, B, A])
})
Test('Should UnionPrioritySort 13', () => {
  const A = Type.Any()
  const B = Type.String()
  const C = Type.Literal('A')
  const R = UnionPrioritySort([A, B, C])
  Assert.IsEqual(R, [C, B, A])
})
Test('Should UnionPrioritySort 14', () => {
  const A = Type.Unknown()
  const B = Type.Number()
  const R = UnionPrioritySort([A, B])
  Assert.IsEqual(R, [B, A])
})
Test('Should UnionPrioritySort 15', () => {
  const A = Type.Tuple([Type.String()])
  const B = Type.Array(Type.String())
  const R = UnionPrioritySort([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should UnionPrioritySort 16', () => {
  const A = Type.Union([Type.Literal(1), Type.Literal(2)])
  const B = Type.Number()
  const R = UnionPrioritySort([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should UnionPrioritySort 17', () => {
  const A = Type.Object({ a: Type.Object({ b: Type.String() }) })
  const B = Type.Object({ a: Type.Object({}) })
  const R = UnionPrioritySort([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should UnionPrioritySort 18', () => {
  const A = Type.Null()
  const B = Type.Undefined()
  const C = Type.String()
  const R = UnionPrioritySort([A, B, C])
  Assert.IsEqual(R, [A, C, B])
})
Test('Should UnionPrioritySort 19', () => {
  const A = Type.Number()
  const B = Type.Integer()
  const R = UnionPrioritySort([A, B])
  Assert.IsEqual(R, [B, A])
})
Test('Should UnionPrioritySort 20', () => {
  const A = Type.String({ $id: 'A' })
  const B = Type.String({ $id: 'B' })
  const R = UnionPrioritySort([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should UnionPrioritySort 21', () => {
  const A = Type.Object({})
  const B = Type.Object({ x: Type.Number() })
  const R = UnionPrioritySort([A, B])
  Assert.IsEqual(R, [B, A])
})
Test('Should UnionPrioritySort 22', () => {
  const A = Type.Object({ a: Type.Object({ b: Type.Literal(1) }) })
  const B = Type.Object({ a: Type.Object({ b: Type.Number() }) })
  const R = UnionPrioritySort([B, A])
  Assert.IsEqual(R, [A, B])
})
Test('Should UnionPrioritySort 23', () => {
  const A = Type.Any()
  const B = Type.Literal(1)
  const C = Type.Number()
  const D = Type.Integer()
  const R = UnionPrioritySort([A, B, C, D])
  Assert.IsEqual(R, [D, B, C, A])
})
Test('Should UnionPrioritySort 24', () => {
  const A = Type.Object({ a: Type.String() })
  const B = Type.Record(Type.String(), Type.Any())
  const R = UnionPrioritySort([B, A])
  Assert.IsEqual(R, [B, A]) // Review on Extends Check for Record
})
// ------------------------------------------------------------------
// Reverse
// ------------------------------------------------------------------
Test('Should UnionPrioritySort 25', () => {
  const A = Type.Any()
  const B = Type.Literal(1)
  const C = Type.Number()
  const D = Type.Integer()
  const R = UnionPrioritySort([A, B, C, D], -1)
  Assert.IsEqual(R, [A, C, B, D])
})
