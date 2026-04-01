import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Indexed')

Test('Should Indexed 1', () => {
  const T: Type.TNumber = Type.Script('{ x: number }["x"]')
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Indexed 2', () => {
  const T: Type.TLiteral<1> = Type.Script('[1, 2, 3][0]')
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})
Test('Should Indexed 3', () => {
  const T: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<3>]> = Type.Script('[1, 2, 3][0 | 2]')
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 1)
  Assert.IsEqual(T.anyOf[1].const, 3)
})
Test('Should Indexed 4', () => {
  const T: Type.TString = Type.Script('(string[])[number]')
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Indexed 5', () => {
  const T: Type.TArray<Type.TString> = Type.Script('(string[][])[number]')
  Assert.IsTrue(Type.IsArray(T))
  Assert.IsTrue(Type.IsString(T.items))
})
Test('Should Indexed 6', () => {
  const A: Type.TObject<{
    x: Type.TNumber
  }> = Type.Script('{ x: number }')
  const T: Type.TNever = Type.Script({ A }, 'A[string]')
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Indexed 7', () => {
  const A: Type.TObject<{
    x: Type.TNumber
  }> = Type.Script('{ x: number }')
  const T: Type.TNumber = Type.Script({ A }, 'A[keyof A]')
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Indexed 8', () => {
  const A: Type.TObject<{
    x: Type.TNumber
    y: Type.TString
  }> = Type.Script('{ x: number, y: string }')
  // CACHE | TYPESCRIPT TYPE ID ORDER ISSUE
  const T /*: Type.TUnion<[Type.TNumber, Type.TString]> */ = Type.Script({ A }, 'A[keyof A]')
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
Test('Should Indexed 9', () => {
  const T: Type.TLiteral<1> = Type.Script('[[1], 2, 3][0][0]')
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})
Test('Should Indexed 10', () => {
  const R: Type.TIndexDeferred<Type.TRef<'A'>, Type.TLiteral<'x'>> = Type.Script('A["x"]')
  const T: Type.TNumber = Type.Instantiate({ A: Type.Script(`{ x: number }`) }, R)
  Assert.IsTrue(Type.IsNumber(T))
})
// ------------------------------------------------------------------
// Length
// ------------------------------------------------------------------
Test('Should Indexed 11', () => {
  const T = Type.Script(`[1, 2, 3]`)
  const S: Type.TLiteral<3> = Type.Script({ T }, `T['length']`)
  Assert.IsTrue(Type.IsLiteral(S))
  Assert.IsEqual(S.const, 3)
})
Test('Should Indexed 12', () => {
  const T = Type.Script(`string[]`)
  const S: Type.TNumber = Type.Script({ T }, `T['length']`)
  Assert.IsTrue(Type.IsNumber(S))
})
Test('Should Indexed 13', () => {
  const T = Type.Script(`[1, 2, 3]['length']`)
  const S: Type.TLiteral<3> = T
  Assert.IsTrue(Type.IsLiteral(S))
  Assert.IsEqual(S.const, 3)
})
Test('Should Indexed 14', () => {
  const T = Type.Script(`[1, 2, 3][]['length']`)
  const S: Type.TNumber = T
  Assert.IsTrue(Type.IsNumber(S))
})
Test('Should Indexed 15', () => {
  const T = Type.Script(`[1, 2, 3, 4, 5]['length']`)
  const S: Type.TLiteral<5> = T
  Assert.IsTrue(Type.IsLiteral(S))
  Assert.IsEqual(S.const, 5)
})
Test('Should Indexed 16', () => {
  const T = Type.Script(`[1, 2, 3, 4, 5][]['length']`)
  const S: Type.TNumber = T
  Assert.IsTrue(Type.IsNumber(S))
})
Test('Should Indexed 17', () => {
  const T = Type.Script(`string[][][]['length']`)
  const S: Type.TNumber = T
  Assert.IsTrue(Type.IsNumber(S))
})
Test('Should Indexed 18', () => {
  const T = Type.Script(`[1, 2, 3][][number]`)
  const S: Type.TTuple<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]> = T
  Assert.IsTrue(Type.IsTuple(S))
  Assert.IsEqual(S.items[0].const, 1)
  Assert.IsEqual(S.items[1].const, 2)
  Assert.IsEqual(S.items[2].const, 3)
})
Test('Should Indexed 19', () => {
  const T = Type.Script(`[1, 2, 3]['length'][]`)
  const S: Type.TArray<Type.TLiteral<3>> = T
  Assert.IsTrue(Type.IsArray(S))
  Assert.IsTrue(Type.IsLiteral(S.items))
  Assert.IsEqual(S.items.const, 3)
})
Test('Should Indexed 20', () => {
  const T = Type.Script(`[1, 2, 3][]['length'][]`)
  const S: Type.TArray<Type.TNumber> = T
  Assert.IsTrue(Type.IsArray(S))
  Assert.IsTrue(Type.IsNumber(S.items))
})
