import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Tuple')

Test('Should Tuple 1', () => {
  const T: Type.TNull = Type.Script('null')
  Assert.IsFalse(Type.IsTuple(T))
})
Test('Should Tuple 2', () => {
  const T: Type.TTuple<[Type.TNull, Type.TNumber]> = Type.Script('[null, number]')
})
Test('Should Tuple 3', () => {
  const T: Type.TTuple<[Type.TNull, Type.TNumber]> = Type.Script('[null, number]')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsNull(T.items[0]))
  Assert.IsTrue(Type.IsNumber(T.items[1]))
  Assert.IsTrue(T.items.length === 2)
  Assert.IsTrue(T.additionalItems === false)
})
Test('Should Tuple 4', () => {
  const T: Type.TTuple<[Type.TNull, Type.TNever]> = Type.Script('[null, never]')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsNull(T.items[0]))
  Assert.IsTrue(Type.IsNever(T.items[1]))
  Assert.IsTrue(T.items.length === 2)
  Assert.IsTrue(T.additionalItems === false)
})
Test('Should Tuple 5', () => {
  const T: Type.TTuple<[Type.TNull, Type.TNumber]> = Type.Script('Assign<[null, number], { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Tuple 6', () => {
  const T = Type.Script('Assign<[null, number], { a: 1, b: 2 }>')
  const O = Type.TupleOptions(T)
  Assert.IsFalse(Type.IsTuple(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
Test('Should Tuple 7', () => {
  const T: Type.TTuple<[Type.TNull, Type.TNumber]> = Type.Script('[a: null, b: number]')
})
// ------------------------------------------------------------------
// Rest
// ------------------------------------------------------------------
Test('Should Tuple 8', () => {
  const S = Type.Script('[1, 2]')
  const T: Type.TTuple<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]> = Type.Script({ S }, '[...S, 3]')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
  Assert.IsEqual(T.items[2].const, 3)
})
Test('Should Tuple 9', () => {
  const S = Type.Script('[1, 2]')
  const T: Type.TTuple<[Type.TLiteral<3>, Type.TLiteral<1>, Type.TLiteral<2>]> = Type.Script({ S }, '[3, ...S]')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 3)
  Assert.IsEqual(T.items[1].const, 1)
  Assert.IsEqual(T.items[2].const, 2)
})
// ------------------------------------------------------------------
// Optional Element
// ------------------------------------------------------------------
Test('Should Tuple 10', () => {
  const T: Type.TTuple<[Type.TLiteral<1>, Type.TOptional<Type.TLiteral<2>>]> = Type.Script('[1, 2?]')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
  Assert.IsTrue(Type.IsOptional(T.items[1]))
})
// ------------------------------------------------------------------
// Readonly Element
// ------------------------------------------------------------------
Test('Should Tuple 11', () => {
  const T: Type.TTuple<[Type.TLiteral<1>, Type.TReadonly<Type.TLiteral<2>>]> = Type.Script('[1, readonly 2]')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
  Assert.IsTrue(Type.IsReadonly(T.items[1]))
})
// ------------------------------------------------------------------
// Named Element
// ------------------------------------------------------------------
Test('Should Tuple 12', () => {
  const T: Type.TTuple<[Type.TLiteral<1>, Type.TNumber]> = Type.Script('[1, x:number]')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsTrue(Type.IsNumber(T.items[1]))
})
Test('Should Tuple 13', () => {
  const T: Type.TTuple<[Type.TLiteral<1>, Type.TOptional<Type.TNumber>]> = Type.Script('[1, x?:number]')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsTrue(Type.IsNumber(T.items[1]))
  Assert.IsTrue(Type.IsOptional(T.items[1]))
})
Test('Should Tuple 14', () => {
  const T: Type.TTuple<[Type.TLiteral<1>, Type.TReadonly<Type.TArray<Type.TNumber>>]> = Type.Script('[1, x: readonly number[]]')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsTrue(Type.IsArray(T.items[1]))
  Assert.IsTrue(Type.IsNumber(T.items[1].items))
  Assert.IsTrue(Type.IsReadonly(T.items[1]))
})
Test('Should Tuple 15', () => {
  const T: Type.TTuple<[Type.TLiteral<1>, Type.TReadonly<Type.TOptional<Type.TArray<Type.TNumber>>>]> = Type.Script('[1, x?: readonly number[]]')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsTrue(Type.IsArray(T.items[1]))
  Assert.IsTrue(Type.IsReadonly(T.items[1]))
  Assert.IsTrue(Type.IsOptional(T.items[1]))
  Assert.IsTrue(Type.IsNumber(T.items[1].items))
})
// ------------------------------------------------------------------
// Readonly Optional Element
// ------------------------------------------------------------------
Test('Should Tuple 16', () => {
  const T: Type.TTuple<[Type.TLiteral<1>, Type.TReadonly<Type.TOptional<Type.TLiteral<2>>>]> = Type.Script('[1, readonly 2?]')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
  Assert.IsTrue(Type.IsOptional(T.items[1]))
  Assert.IsTrue(Type.IsReadonly(T.items[1]))
})
