import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Narrow')

// ------------------------------------------------------------------
// Narrow
// ------------------------------------------------------------------
Test('Should Narrow 1', () => {
  const A = Type.Number()
  const B = Type.Number()
  const R: Type.TNumber = Type.Narrow(A, B)
  Assert.IsTrue(Type.IsNumber(R))
})
Test('Should Narrow 2', () => {
  const A = Type.Number()
  const B = Type.Literal(1)
  const R: Type.TLiteral<1> = Type.Narrow(A, B)
  Assert.IsEqual(R.const, 1)
})
Test('Should Narrow 3', () => {
  const A = Type.Literal(1)
  const B = Type.Number()
  const R: Type.TLiteral<1> = Type.Narrow(A, B)
  Assert.IsEqual(R.const, 1)
})
Test('Should Narrow 4', () => {
  const A = Type.Literal(1)
  const B = Type.Literal(2)
  const R: Type.TNever = Type.Narrow(A, B)
  Assert.IsTrue(Type.IsNever(R))
})
// ------------------------------------------------------------------
// Narrow (Any, Unknown, Never)
//
// Left is checked for Never, then Any, then Unknown, all before
// Right is inspected at all. This makes the result order-dependent:
// whichever of these three appears on Left takes priority over
// whatever Right is, except Unknown on Left, which defers entirely
// and returns Right verbatim (even if Right is itself Never or Any).
// The matrix below pins down every pairing so that priority can't
// silently drift.
// ------------------------------------------------------------------
Test('Should Narrow 5', () => {
  const R: Type.TNever = Type.Narrow(Type.Never(), Type.Number())
  Assert.IsTrue(Type.IsNever(R))
})
Test('Should Narrow 6', () => {
  const R: Type.TNever = Type.Narrow(Type.Number(), Type.Never())
  Assert.IsTrue(Type.IsNever(R))
})
Test('Should Narrow 7', () => {
  const R: Type.TAny = Type.Narrow(Type.Any(), Type.Number())
  Assert.IsTrue(Type.IsAny(R))
})
Test('Should Narrow 8', () => {
  const R: Type.TAny = Type.Narrow(Type.Number(), Type.Any())
  Assert.IsTrue(Type.IsAny(R))
})
Test('Should Narrow 9', () => {
  const R: Type.TNumber = Type.Narrow(Type.Unknown(), Type.Number())
  Assert.IsTrue(Type.IsNumber(R))
})
Test('Should Narrow 10', () => {
  const R: Type.TNumber = Type.Narrow(Type.Number(), Type.Unknown())
  Assert.IsTrue(Type.IsNumber(R))
})
Test('Should Narrow 11', () => {
  // Left Never takes priority over Right Any
  const R: Type.TNever = Type.Narrow(Type.Never(), Type.Any())
  Assert.IsTrue(Type.IsNever(R))
})
Test('Should Narrow 12', () => {
  // Left Any takes priority over Right Never (asymmetric with the above)
  const R: Type.TAny = Type.Narrow(Type.Any(), Type.Never())
  Assert.IsTrue(Type.IsAny(R))
})
Test('Should Narrow 13', () => {
  const R: Type.TNever = Type.Narrow(Type.Never(), Type.Unknown())
  Assert.IsTrue(Type.IsNever(R))
})
Test('Should Narrow 14', () => {
  // Left Unknown defers to Right, so Right's Never passes through
  const R: Type.TNever = Type.Narrow(Type.Unknown(), Type.Never())
  Assert.IsTrue(Type.IsNever(R))
})
Test('Should Narrow 15', () => {
  const R: Type.TAny = Type.Narrow(Type.Any(), Type.Unknown())
  Assert.IsTrue(Type.IsAny(R))
})
Test('Should Narrow 16', () => {
  // Left Unknown defers to Right, so Right's Any passes through
  const R: Type.TAny = Type.Narrow(Type.Unknown(), Type.Any())
  Assert.IsTrue(Type.IsAny(R))
})
Test('Should Narrow 17', () => {
  const R: Type.TNever = Type.Narrow(Type.Never(), Type.Never())
  Assert.IsTrue(Type.IsNever(R))
})
Test('Should Narrow 18', () => {
  const R: Type.TAny = Type.Narrow(Type.Any(), Type.Any())
  Assert.IsTrue(Type.IsAny(R))
})
Test('Should Narrow 19', () => {
  const R: Type.TUnknown = Type.Narrow(Type.Unknown(), Type.Unknown())
  Assert.IsTrue(Type.IsUnknown(R))
})
// ------------------------------------------------------------------
// NarrowCompositeRule
//
// When both sides can composite (Object or Tuple), Narrow defers to
// Composite. When only one side can composite, that side is returned
// as-is and the other is discarded outright, though the result is
// equivalent to what Composite would have produced anyway, since a
// non-composable type contributes no properties. When neither side
// can composite, Narrow falls back to comparing the two types directly.
// ------------------------------------------------------------------
Test('Should Narrow 20', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Object({ y: Type.String() })
  const R: Type.TObject<{
    x: Type.TNumber
    y: Type.TString
  }> = Type.Narrow(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsNumber(R.properties.x))
  Assert.IsTrue(Type.IsString(R.properties.y))
})
Test('Should Narrow 21', () => {
  const A = Type.Tuple([Type.String(), Type.Number()])
  const B = Type.Tuple([Type.String(), Type.Number()])
  const R: Type.TObject<{
    0: Type.TString
    1: Type.TNumber
  }> = Type.Narrow(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsString(R.properties[0]))
  Assert.IsTrue(Type.IsNumber(R.properties[1]))
})
Test('Should Narrow 22', () => {
  const A = Type.Object({ x: Type.Number() })
  const B = Type.Number()
  const R: Type.TObject<{
    x: Type.TNumber
  }> = Type.Narrow(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsNumber(R.properties.x))
})
Test('Should Narrow 23', () => {
  const A = Type.Number()
  const B = Type.Object({ x: Type.Number() })
  const R: Type.TObject<{
    x: Type.TNumber
  }> = Type.Narrow(A, B)
  Assert.IsTrue(Type.IsObject(R))
  Assert.IsTrue(Type.IsNumber(R.properties.x))
})
Test('Should Narrow 24', () => {
  const A = Type.Tuple([Type.String()])
  const B = Type.String()
  const R: Type.TTuple<[Type.TString]> = Type.Narrow(A, B)
  Assert.IsTrue(Type.IsTuple(R))
  Assert.IsTrue(Type.IsString(R.items[0]))
})
