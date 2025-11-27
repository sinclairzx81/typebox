import { Assert } from 'test'
import * as Type from 'typebox'

// ------------------------------------------------------------------
// Note: These tests invoke the TIntrinsicOrCall<...> binding of
// the parsers mapping backend. We are only interested in testing
// each mapping is invoked, see engine tests for more exhaustive
// testing of each action.
// ------------------------------------------------------------------
const Test = Assert.Context('Type.Script.Action')
Test('Should Action 1', () => {
  const T: Type.TArray<Type.TNull> = Type.Script('Array<null>')
  Assert.IsTrue(Type.IsArray(T))
  Assert.IsTrue(Type.IsNull(T.items))
})
Test('Should Action 2', () => {
  const T: Type.TAsyncIterator<Type.TNull> = Type.Script('AsyncIterator<null>')
  Assert.IsTrue(Type.IsAsyncIterator(T))
  Assert.IsTrue(Type.IsNull(T.iteratorItems))
})
Test('Should Action 3', () => {
  const T: Type.TPromise<Type.TNull> = Type.Script('Promise<null>')
  Assert.IsTrue(Type.IsPromise(T))
  Assert.IsTrue(Type.IsNull(T.item))
})
Test('Should Action 4', () => {
  const T: Type.TIterator<Type.TNull> = Type.Script('Iterator<null>')
  Assert.IsTrue(Type.IsIterator(T))
  Assert.IsTrue(Type.IsNull(T.iteratorItems))
})
Test('Should Action 5', () => {
  const T: Type.TNull = Type.Script('Awaited<Promise<null>>')
  Assert.IsTrue(Type.IsNull(T))
})
Test('Should Action 6', () => {
  const T: Type.TLiteral<'Hello'> = Type.Script('Capitalize<"hello">')
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 'Hello')
})
Test('Should Action 7', () => {
  const T: Type.TTuple<[Type.TString, Type.TNumber]> = Type.Script('ConstructorParameters<new (a: string, b: number) => {}>')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsString(T.items[0]))
  Assert.IsTrue(Type.IsNumber(T.items[1]))
})
Test('Should Action 8', () => {
  const T: Type.TLiteral<1> = Type.Script('Evaluate<number & 1>')
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})
Test('Should Action 9', () => {
  const T: Type.TUnion<[Type.TLiteral<2>, Type.TLiteral<3>]> = Type.Script('Exclude<1 | 2 | 3, 1>')
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 2)
  Assert.IsEqual(T.anyOf[1].const, 3)
})
Test('Should Action 10', () => {
  const T: Type.TLiteral<1> = Type.Script('Extract<1 | 2 | 3, 1>')
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 1)
})
Test('Should Action 11', () => {
  const T: Type.TNull = Type.Script('Index<{ x: null }, "x">')
  Assert.IsTrue(Type.IsNull(T))
})
Test('Should Action 12', () => {
  const T: Type.TNull = Type.Script('InstanceType<new (a: string, b: number) => null>')
  Assert.IsTrue(Type.IsNull(T))
})
Test('Should Action 13', () => {
  // DENO_CACHE_ERROR | EDIT FILE AND RE-RUN TEST
  const T: Type.TUnion<[Type.TLiteral<'x'>, Type.TLiteral<'y'>]> = Type.Script('KeyOf<{ x: 1, y: 2 }>')
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'x')
  Assert.IsEqual(T.anyOf[1].const, 'y')
})
Test('Should Action 14', () => {
  const T: Type.TLiteral<'hello'> = Type.Script('Lowercase<"HELLO">')
  Assert.IsTrue(Type.IsLiteral(T))
  Assert.IsEqual(T.const, 'hello')
})
Test('Should Action 15', () => {
  const T: Type.TString = Type.Script('NonNullable<string | null>')
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Action 16', () => {
  const T: Type.TObject<{
    y: Type.TNumber
  }> = Type.Script('Omit<{ x: string, y: number }, "x">')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.NotHasPropertyKey(T.properties, 'x')
})
Test('Should Action 17', () => {
  const T: Type.TOptions<Type.TNull, {
    x: 1
  }> = Type.Script('Options<null, { x: 1 }>')
  Assert.IsTrue(Type.IsNull(T))
  Assert.IsEqual(T.x, 1)
})
Test('Should Action 18', () => {
  const T: Type.TTuple<[Type.TString, Type.TNumber]> = Type.Script('Parameters<(a: string, b: number) => {}>')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsString(T.items[0]))
  Assert.IsTrue(Type.IsNumber(T.items[1]))
})
Test('Should Action 19', () => {
  const T: Type.TObject<{
    x: Type.TOptional<Type.TNumber>
  }> = Type.Script('Partial<{ x: number }>')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
})
Test('Should Action 20', () => {
  const T: Type.TObject<{
    x: Type.TString
  }> = Type.Script('Pick<{ x: string, y: number }, "x">')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.x))
  Assert.NotHasPropertyKey(T.properties, 'y')
})
Test('Should Action 21', () => {
  const T: Type.TRecord<'^.*$', Type.TNull> = Type.Script('Record<string, null>')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsEqual(Type.RecordPattern(T), '^.*$')
  Assert.IsTrue(Type.IsNull(Type.RecordValue(T)))
})
Test('Should Action 22', () => {
  const T: Type.TObject<{
    x: Type.TNumber
  }> = Type.Script('Required<{ x?: number }>')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
})
Test('Should Action 23', () => {
  const T: Type.TNull = Type.Script('ReturnType<(a: number, b: string) => null>')
  Assert.IsTrue(Type.IsNull(T))
})
Test('Should Action 24', () => {
  const T: Type.TLiteral<'hELLO'> = Type.Script('Uncapitalize<"HELLO">')
  Assert.IsEqual(T.const, 'hELLO')
})
Test('Should Action 25', () => {
  const T: Type.TLiteral<'HELLO'> = Type.Script('Uppercase<"hello">')
  Assert.IsEqual(T.const, 'HELLO')
})
