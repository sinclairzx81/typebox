import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Record')

// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<Record<string, number>, null>(false)
  const T: ExtendsResult.TExtendsFalse = Extends({}, Type.Record(Type.String(), Type.Number()), Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(T))
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Extends 2', () => {
  Assert.IsExtends<Record<string, number>, any>(true)
  const T: Type.ExtendsResult.TExtendsTrue<{}> = Extends({}, Type.Record(Type.String(), Type.Number()), Type.Any())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(T))
})
Test('Should Extends 3', () => {
  Assert.IsExtends<Record<string, number>, unknown>(true)
  const T: Type.ExtendsResult.TExtendsTrue<{}> = Extends({}, Type.Record(Type.String(), Type.Number()), Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(T))
})
Test('Should Extends 4', () => {
  Assert.IsExtends<Record<string, number>, never>(false)
  const T: Type.ExtendsResult.TExtendsFalse = Extends({}, Type.Record(Type.String(), Type.Number()), Type.Never())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(T))
})
// ------------------------------------------------------------------
// RecordToRecord
// ------------------------------------------------------------------
Test('Should Extends 5', () => {
  Assert.IsExtends<Record<string, string>, Record<string, string>>(true)
  const L = Type.Record(Type.String(), Type.String())
  const R = Type.Record(Type.String(), Type.String())
  const T: ExtendsResult.TExtendsTrue = Extends({}, L, R)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(T))
})
Test('Should Extends 6', () => {
  Assert.IsExtends<Record<string, string>, Record<string, number>>(false)
  const L = Type.Record(Type.String(), Type.String())
  const R = Type.Record(Type.String(), Type.Number())
  const T: ExtendsResult.TExtendsFalse = Extends({}, L, R)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(T))
})
Test('Should Extends 7', () => {
  Assert.IsExtends<Record<number, string>, Record<string, string>>(true)
  const L = Type.Record(Type.Number(), Type.String())
  const R = Type.Record(Type.String(), Type.String())
  const T: ExtendsResult.TExtendsTrue = Extends({}, L, R)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(T))
})
// ------------------------------------------------------------------
// RecordToObject
// ------------------------------------------------------------------
Test('Should Extends 8', () => {
  Assert.IsExtends<Record<string, string>, {}>(true)
  const L = Type.Record(Type.Number(), Type.String())
  const R = Type.Object({})
  const T: ExtendsResult.TExtendsTrue = Extends({}, L, R)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(T))
})
Test('Should Extends 9', () => {
  Assert.IsExtends<Record<string, string>, { x: 1 }>(false)
  const L = Type.Record(Type.Number(), Type.String())
  const R = Type.Object({ x: Type.Literal(1) })
  const T: ExtendsResult.TExtendsFalse = Extends({}, L, R)
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(T))
})
