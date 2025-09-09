import { Assert } from 'test'
import * as Type from 'typebox'
import Guard from 'typebox/guard'
const Test = Assert.Context('Type.Script.Record')

Test('Should Record 1', () => {
  const T: Type.TNull = Type.Script('null')
  Assert.IsFalse(Type.IsRecord(T))
})
// ------------------------------------------------------------------
// RecordStringKey
// ------------------------------------------------------------------
Test('Should Record 2', () => {
  const T: Type.TRecord<typeof Type.StringKey, Type.TNull> = Type.Script('Record<any, null>')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsEqual(Type.RecordPattern(T), Type.StringKey)
})
Test('Should Record 3', () => {
  const T: Type.TObject<{}> = Type.Script('Record<never, null>')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(Guard.Keys(T.properties).length, 0)
})
Test('Should Record 4', () => {
  const T: Type.TRecord<typeof Type.IntegerKey, Type.TNull> = Type.Script('Record<integer, null>')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsEqual(Type.RecordPattern(T), Type.IntegerKey)
})
Test('Should Record 5', () => {
  const T: Type.TRecord<typeof Type.NumberKey, Type.TNull> = Type.Script('Record<number, null>')
  Assert.IsEqual(Type.RecordPattern(T), Type.NumberKey)
})
Test('Should Record 6', () => {
  const T: Type.TRecord<typeof Type.StringKey, Type.TNull> = Type.Script('Record<string, null>')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsEqual(Type.RecordPattern(T), Type.StringKey)
})
// ------------------------------------------------------------------
// RecordKeyAsType
// ------------------------------------------------------------------
Test('Should Record 7', () => {
  const T: Type.TRecord<typeof Type.IntegerKey, Type.TNull> = Type.Script('Record<integer, null>')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsInteger(Type.RecordKey(T)))
})
Test('Should Record 8', () => {
  const T: Type.TRecord<typeof Type.NumberKey, Type.TNull> = Type.Script('Record<number, null>')
  Assert.IsTrue(Type.IsNumber(Type.RecordKey(T)))
})
Test('Should Record 9', () => {
  const T: Type.TRecord<typeof Type.StringKey, Type.TNull> = Type.Script('Record<string, null>')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsString(Type.RecordKey(T)))
})
Test('Should Record 10', () => {
  const T: Type.TOptions<Type.TRecord<typeof Type.StringKey, Type.TNull>, {
    a: 1
    b: 2
  }> = Type.Script('Options<Record<string, null>, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Record 11', () => {
  const T = Type.Script('Options<Record<string, null>, { a: 1, b: 2 }>')
  const O = Type.RecordOptions(T)
  Assert.IsFalse(Type.IsRecord(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
Test('Should Record 12', () => {
  const T: Type.TObject<{
    true: Type.TString
    false: Type.TString
  }> = Type.Script('Record<boolean, string>')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.true))
  Assert.IsTrue(Type.IsString(T.properties.false))
})
Test('Should Record 13', () => {
  const T: Type.TObject<{
    x: Type.TString
    y: Type.TString
  }> = Type.Script('Record<"x" | "y", string>')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
})
// ------------------------------------------------------------------
// TemplateLiteral
// ------------------------------------------------------------------
Test('Should Record 14', () => {
  const T: Type.TRecord<'^-?(?:0|[1-9][0-9]*)n$', Type.TString> = Type.Script('Record<`${bigint}`, string>')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsEqual(Type.RecordPattern(T), '^-?(?:0|[1-9][0-9]*)n$')
})
Test('Should Record 15', () => {
  const T: Type.TRecord<'^-?(?:0|[1-9][0-9]*)$', Type.TString> = Type.Script('Record<`${integer}`, string>')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsEqual(Type.RecordPattern(T), '^-?(?:0|[1-9][0-9]*)$')
})
Test('Should Record 16', () => {
  const T: Type.TRecord<'^-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?$', Type.TString> = Type.Script('Record<`${number}`, string>')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsEqual(Type.RecordPattern(T), '^-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?$')
})
Test('Should Record 17', () => {
  const T: Type.TRecord<'^(?!)$', Type.TString> = Type.Script('Record<`${never}`, string>')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsEqual(Type.RecordPattern(T), '^(?!)$')
})
Test('Should Record 18', () => {
  const T: Type.TObject<{
    hello: Type.TString
  }> = Type.Script('Record<`hello`, string>')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.hello))
})
Test('Should Record 19', () => {
  const T: Type.TObject<{
    helloA: Type.TString
    helloB: Type.TString
  }> = Type.Script('Record<`hello${"A" | "B"}`, string>')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.helloA))
  Assert.IsTrue(Type.IsString(T.properties.helloB))
})
Test('Should Record 20', () => {
  const T: Type.TRecord<'^hello.*$', Type.TString> = Type.Script('Record<`hello${string}`, string>')
  Assert.IsTrue(Type.IsRecord(T))
  const Key = Type.RecordPattern(T)
  const Value = Type.RecordValue(T)
  Assert.IsEqual(Key, '^hello.*$')
  Assert.IsTrue(Type.IsString(Value))
})
Test('Should Record 21', () => {
  const T = Type.Script('Record<`${boolean}`, string>')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.true))
  Assert.IsTrue(Type.IsString(T.properties.false))
})
