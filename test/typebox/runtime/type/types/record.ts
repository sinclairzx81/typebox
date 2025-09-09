// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'
import Guard from 'typebox/guard'

const Test = Assert.Context('Type.Record')

Test('Should not guard Record', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsRecord(T))
})
// ------------------------------------------------------------------
// Record Key
// ------------------------------------------------------------------
Test('Should Create Record with Any Key', () => {
  const T: Type.TRecord<typeof Type.StringKey, Type.TNull> 
    = Type.Record(Type.Any(), Type.Null())
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsEqual(Type.RecordPattern(T), Type.StringKey)
})

Test('Should Create Record with Never Key', () => {
  const T: Type.TObject<{}> = Type.Record(Type.Never(), Type.Null())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(Guard.Keys(T.properties).length, 0)
})
Test('Should Create Record with Integer Key', () => {
  const T: Type.TRecord<typeof Type.IntegerKey, Type.TNull> 
    = Type.Record(Type.Integer(), Type.Null())
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsEqual(Type.RecordPattern(T), Type.IntegerKey)
})
Test('Should Create Record with Number Key', () => {
  const T: Type.TRecord<typeof Type.NumberKey, Type.TNull> 
    = Type.Record(Type.Number(), Type.Null())
  Assert.IsEqual(Type.RecordPattern(T), Type.NumberKey)
})
Test('Should Create Record with String Key', () => {
  const T: Type.TRecord<typeof Type.StringKey, Type.TNull> 
    = Type.Record(Type.String(), Type.Null())
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsEqual(Type.RecordPattern(T), Type.StringKey)
})
// ------------------------------------------------------------------
// RecordKey
// ------------------------------------------------------------------
Test('Should Create Record with IntegerKey', () => {
  const T: Type.TRecord<typeof Type.IntegerKey, Type.TNull> 
    = Type.Record(Type.Integer(), Type.Null())
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsInteger(Type.RecordKey(T)))
})
Test('Should Create Record with NumberKey', () => {
  const T: Type.TRecord<typeof Type.NumberKey, Type.TNull> 
    = Type.Record(Type.Number(), Type.Null())
  Assert.IsTrue(Type.IsNumber(Type.RecordKey(T)))
})
Test('Should Create Record with StringKey', () => {
  const T: Type.TRecord<typeof Type.StringKey, Type.TNull> 
    = Type.Record(Type.String(), Type.Null())
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsString(Type.RecordKey(T)))
})
Test('Should Create Record with options', () => {
  const T: Type.TRecord<typeof Type.StringKey, Type.TString> 
    = Type.Record(Type.String(), Type.String(), { a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Create Record with options then extract', () => {
  const T = Type.Record(Type.String(), Type.String(), { a: 1, b: 2 })
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
Test('Should Create Record with Boolean Key', () => {
  const T: Type.TObject<{
    true: Type.TString,
    false: Type.TString
  }> = Type.Record(Type.Boolean(), Type.String())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.true))
  Assert.IsTrue(Type.IsString(T.properties.false))
})
Test('Should Create Record with Union Key', () => {
  const T: Type.TObject<{
    x: Type.TString,
    y: Type.TString
  }> = Type.Record(Type.Union([
    Type.Literal('x'),
    Type.Literal('y')
  ]), Type.String())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
})
Test('Should Create Record with Enum Key', () => {
  const T: Type.TObject<{
    x: Type.TString,
    y: Type.TString
  }> = Type.Record(Type.Enum(['x','y']), Type.String())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
})
// ------------------------------------------------------------------
// TemplateLiteral
// ------------------------------------------------------------------
Test('Should Create Record with TemplateLiteral 1', () => {
  const T: Type.TObject<{
    hello: Type.TString
  }> = Type.Record(Type.TemplateLiteral('hello'), Type.String())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.hello))
})
Test('Should Create Record with TemplateLiteral 2', () => {
  const T: Type.TObject<{
    helloA: Type.TString,
    helloB: Type.TString
  }> = Type.Record(Type.TemplateLiteral('hello${`A` | `B`}'), Type.String())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.helloA))
  Assert.IsTrue(Type.IsString(T.properties.helloB))
})
Test('Should Create Record with TemplateLiteral 3', () => {
  const T: Type.TRecord<"^hello.*$", Type.TString> = Type.Record(Type.TemplateLiteral('hello${string}'), Type.String())
  Assert.IsTrue(Type.IsRecord(T))
  const Key = Type.RecordPattern(T)
  const Value = Type.RecordValue(T)
  Assert.IsEqual(Key, '^hello.*$')
  Assert.IsTrue(Type.IsString(Value))
})