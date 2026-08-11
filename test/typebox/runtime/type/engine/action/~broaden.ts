import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Broaden')

// ------------------------------------------------------------------
// General
// ------------------------------------------------------------------
Test('Should Broaden 1', () => {
  const R: [Type.TNumber, Type.TString] = Type.Broaden([Type.Number(), Type.String()])
  Assert.IsTrue(Type.IsNumber(R[0]))
  Assert.IsTrue(Type.IsString(R[1]))
})
Test('Should Broaden 2', () => {
  const R: [Type.TNumber] = Type.Broaden([Type.Number(), Type.Number()])
  Assert.IsTrue(Type.IsNumber(R[0]))
})
Test('Should Broaden 3', () => {
  const R: [Type.TNumber] = Type.Broaden([Type.Literal(1), Type.Number()])
  Assert.IsTrue(Type.IsNumber(R[0]))
})
Test('Should Broaden 4', () => {
  const R: [Type.TLiteral<1>, Type.TLiteral<2>] = Type.Broaden([Type.Literal(1), Type.Literal(2)])
  Assert.IsEqual(R[0].const, 1)
  Assert.IsEqual(R[1].const, 2)
})
// ------------------------------------------------------------------
// Any
//
// Any is a top type. It dominates everything, so its presence
// anywhere in the set collapses the whole result to [Any], and
// anything after it in evaluation order is never even considered.
// ------------------------------------------------------------------
Test('Should Broaden 5', () => {
  const R: [Type.TAny] = Type.Broaden([Type.Any()])
  Assert.IsTrue(Type.IsAny(R[0]))
})
Test('Should Broaden 6', () => {
  const R: [Type.TAny] = Type.Broaden([Type.Number(), Type.Any()])
  Assert.IsTrue(Type.IsAny(R[0]))
})
Test('Should Broaden 7', () => {
  const R: [Type.TAny] = Type.Broaden([Type.Any(), Type.Number()])
  Assert.IsTrue(Type.IsAny(R[0]))
})
Test('Should Broaden 8', () => {
  const R: [Type.TAny] = Type.Broaden([Type.String(), Type.Any(), Type.Number()])
  Assert.IsTrue(Type.IsAny(R[0]))
})
Test('Should Broaden 9', () => {
  const R: [Type.TAny] = Type.Broaden([Type.Any(), Type.Any()])
  Assert.IsTrue(Type.IsAny(R[0]))
})
// ------------------------------------------------------------------
// Unknown
//
// Unknown is also a top type, and behaves like Any: its presence
// collapses the result to [Unknown]. When both Any and Unknown are
// present, whichever is evaluated first wins, since evaluation
// terminates the instant a top type is reached.
// ------------------------------------------------------------------
Test('Should Broaden 10', () => {
  const R: [Type.TUnknown] = Type.Broaden([Type.Unknown()])
  Assert.IsTrue(Type.IsUnknown(R[0]))
})
Test('Should Broaden 11', () => {
  const R: [Type.TUnknown] = Type.Broaden([Type.Number(), Type.Unknown()])
  Assert.IsTrue(Type.IsUnknown(R[0]))
})
Test('Should Broaden 12', () => {
  const R: [Type.TUnknown] = Type.Broaden([Type.Unknown(), Type.Number()])
  Assert.IsTrue(Type.IsUnknown(R[0]))
})
Test('Should Broaden 13', () => {
  const R: [Type.TUnknown] = Type.Broaden([Type.String(), Type.Unknown(), Type.Number()])
  Assert.IsTrue(Type.IsUnknown(R[0]))
})
Test('Should Broaden 14', () => {
  const R: [Type.TUnknown] = Type.Broaden([Type.Unknown(), Type.Unknown()])
  Assert.IsTrue(Type.IsUnknown(R[0]))
})
Test('Should Broaden 15', () => {
  const R: [Type.TAny] = Type.Broaden([Type.Any(), Type.Unknown()])
  Assert.IsTrue(Type.IsAny(R[0]))
})
Test('Should Broaden 16', () => {
  const R: [Type.TUnknown] = Type.Broaden([Type.Unknown(), Type.Any()])
  Assert.IsTrue(Type.IsUnknown(R[0]))
})
// ------------------------------------------------------------------
// Never
//
// Never is the bottom type. It contributes nothing to the broadest
// set, so it's dropped wherever it appears, and a set of only Never
// broadens to an empty set.
// ------------------------------------------------------------------
Test('Should Broaden 17', () => {
  const R: [] = Type.Broaden([Type.Never()])
  Assert.IsEqual(R.length, 0)
})
Test('Should Broaden 18', () => {
  const R: [] = Type.Broaden([Type.Never(), Type.Never()])
  Assert.IsEqual(R.length, 0)
})
Test('Should Broaden 19', () => {
  const R: [Type.TNumber] = Type.Broaden([Type.Number(), Type.Never()])
  Assert.IsTrue(Type.IsNumber(R[0]))
})
Test('Should Broaden 20', () => {
  const R: [Type.TNumber] = Type.Broaden([Type.Never(), Type.Number()])
  Assert.IsTrue(Type.IsNumber(R[0]))
})
Test('Should Broaden 21', () => {
  const R: [Type.TNumber] = Type.Broaden([Type.Never(), Type.Number(), Type.Never()])
  Assert.IsTrue(Type.IsNumber(R[0]))
})
// ------------------------------------------------------------------
// Object
//
// Objects are pushed into the result without comparison, since
// comparing object schemas is currently too expensive. This means
// objects are never deduplicated against each other, even when
// structurally identical, and never filter out or get filtered by
// other entries already in the result.
// ------------------------------------------------------------------
Test('Should Broaden 22', () => {
  const R: [Type.TObject<{ x: Type.TNumber }>] = Type.Broaden([Type.Object({ x: Type.Number() })])
  Assert.IsTrue(Type.IsObject(R[0]))
})
Test('Should Broaden 23', () => {
  const R: [Type.TObject<{ x: Type.TNumber }>, Type.TObject<{ x: Type.TNumber }>] = Type.Broaden([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Number() })
  ])
  Assert.IsTrue(Type.IsObject(R[0]))
  Assert.IsTrue(Type.IsObject(R[1]))
})
Test('Should Broaden 24', () => {
  const R: [Type.TObject<{ x: Type.TNumber }>, Type.TObject<{ y: Type.TString }>] = Type.Broaden([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.String() })
  ])
  Assert.IsTrue(Type.IsObject(R[0]))
  Assert.IsTrue(Type.IsObject(R[1]))
})
Test('Should Broaden 25', () => {
  const R: [Type.TObject<{ x: Type.TNumber }>, Type.TNumber] = Type.Broaden([
    Type.Object({ x: Type.Number() }),
    Type.Number()
  ])
  Assert.IsTrue(Type.IsObject(R[0]))
  Assert.IsTrue(Type.IsNumber(R[1]))
})
Test('Should Broaden 26', () => {
  const R: [Type.TAny] = Type.Broaden([Type.Object({ x: Type.Number() }), Type.Any()])
  Assert.IsTrue(Type.IsAny(R[0]))
})
