import { Assert } from 'test'
import * as Type from 'typebox'
import { Guard } from 'typebox/guard'

const Test = Assert.Context('Type.Engine.Record')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Record 1', () => {
  const T: Type.TRecordDeferred<Type.TRef<'A'>, Type.TString> = Type.Record(Type.Ref('A'), Type.String())
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Record')
  Assert.IsTrue(Type.IsRef(T.parameters[0]))
  Assert.IsTrue(Type.IsString(T.parameters[1]))
  Assert.IsEqual(T.parameters[0].$ref, 'A')
})
Test('Should Record 2', () => {
  const T: Type.TRecord<'^.*$', Type.TRef<'A'>> = Type.Record(Type.String(), Type.Ref('A'))
  const Key = Type.RecordKey(T)
  const Value = Type.RecordPattern(T)
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsEqual(Value, '^.*$')
  Assert.IsTrue(Type.IsString(Key))
})
// ------------------------------------------------------------------
// RecordKey
// ------------------------------------------------------------------
Test('Should Record 3', () => {
  const T: Type.TRecord<'^.*$', Type.TNull> = Type.Record(Type.String(), Type.Null())
  Assert.IsEqual(Type.RecordPattern(T), '^.*$')
  Assert.IsTrue(Type.IsString(Type.RecordKey(T)))
})
Test('Should Record 3', () => {
  const T: Type.TRecord<'^-?(?:0|[1-9][0-9]*)$', Type.TNull> = Type.Record(Type.Integer(), Type.Null())
  Assert.IsEqual(Type.RecordPattern(T), '^-?(?:0|[1-9][0-9]*)$')
  Assert.IsTrue(Type.IsInteger(Type.RecordKey(T)))
})
Test('Should Record 3', () => {
  const T: Type.TRecord<'^-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?$', Type.TNull> = Type.Record(Type.Number(), Type.Null())
  Assert.IsEqual(Type.RecordPattern(T), '^-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?$')
  Assert.IsTrue(Type.IsNumber(Type.RecordKey(T)))
})
Test('Should Record 3', () => {
  const T: Type.TRecord<'^.*$', Type.TNull> = Type.Record(Type.String({ pattern: 'foo' }), Type.Null())
  Assert.IsEqual(Type.RecordPattern(T), 'foo')
  Assert.IsTrue(Type.IsString(Type.RecordKey(T)))
})
// ------------------------------------------------------------------
// RecordValue
// ------------------------------------------------------------------
Test('Should Record 3', () => {
  const T: Type.TRecord<'^.*$', Type.TLiteral<12345>> = Type.Record(Type.String(), Type.Literal(12345))
  Assert.IsEqual(Type.RecordPattern(T), '^.*$')
  Assert.IsEqual(Type.RecordValue(T).const, 12345)
})
// ------------------------------------------------------------------
//  Key: Any
// ------------------------------------------------------------------
Test('Should Record 3', () => {
  const T: Type.TRecord<'^.*$', Type.TNull> = Type.Record(Type.Any(), Type.Null())
  Assert.IsEqual(Type.RecordPattern(T), '^.*$')

  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsString(Type.RecordKey(T)))
  Assert.IsTrue(Type.IsNull(Type.RecordValue(T)))
})
// ------------------------------------------------------------------
//  Key: Boolean
// ------------------------------------------------------------------
Test('Should Record 4', () => {
  const T: Type.TObject<{
    true: Type.TNull
    false: Type.TNull
  }> = Type.Record(Type.Boolean(), Type.Null())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNull(T.properties.true))
  Assert.IsTrue(Type.IsNull(T.properties.false))
})
// ------------------------------------------------------------------
//  Key: Enum
// ------------------------------------------------------------------
Test('Should Record 5', () => {
  const T: Type.TObject<{
    A: Type.TNull
    B: Type.TNull
  }> = Type.Record(Type.Enum(['A', 'B']), Type.Null())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNull(T.properties.A))
  Assert.IsTrue(Type.IsNull(T.properties.B))
})
// ------------------------------------------------------------------
//  Key: Intersect
// ------------------------------------------------------------------
Test('Should Record 6', () => {
  const T: Type.TObject<{
    A: Type.TNull
  }> = Type.Record(Type.Intersect([Type.Literal('A')]), Type.Null())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNull(T.properties.A))
})
Test('Should Record 7', () => {
  const T: Type.TObject<{}> = Type.Record(
    Type.Intersect([
      Type.Union([Type.Literal('A'), Type.Literal('B')]),
      Type.Union([Type.Literal('C'), Type.Literal('D')])
    ]),
    Type.Null()
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(Guard.Keys(T.properties).length, 0)
})
Test('Should Record 8', () => {
  const T: Type.TObject<{
    A: Type.TNull
    B: Type.TNull
  }> = Type.Record(
    Type.Intersect([
      Type.Union([Type.Literal('A'), Type.Literal('B')]),
      Type.Union([Type.Literal('A'), Type.Literal('B')])
    ]),
    Type.Null()
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNull(T.properties.A))
  Assert.IsTrue(Type.IsNull(T.properties.B))
})
Test('Should Record 9', () => {
  const T: Type.TObject<{
    A: Type.TNull
  }> = Type.Record(
    Type.Intersect([
      Type.Union([Type.Literal('A'), Type.Literal('B')]),
      Type.Union([Type.Literal('A'), Type.Literal('X')])
    ]),
    Type.Null()
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNull(T.properties.A))
})
// ------------------------------------------------------------------
//  Key: Literal
// ------------------------------------------------------------------
Test('Should Record 9', () => {
  const T: Type.TObject<{
    A: Type.TNull
  }> = Type.Record(Type.Literal('A'), Type.Null())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNull(T.properties.A))
})
Test('Should Record 10', () => {
  const T: Type.TObject<{
    1: Type.TNull
  }> = Type.Record(Type.Literal(1), Type.Null())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNull(T.properties[1]))
})
Test('Should Record 11', () => {
  const T: Type.TObject<{
    true: Type.TNull
  }> = Type.Record(Type.Literal(true), Type.Null())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNull(T.properties.true))
})
Test('Should Record 12', () => {
  const T: Type.TObject<{
    false: Type.TNull
  }> = Type.Record(Type.Literal(false), Type.Null())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNull(T.properties.false))
})
Test('Should Record 13', () => {
  const T: Type.TObject<{}> = Type.Record(Type.Literal(100n), Type.Null())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(Guard.Keys(T.properties).length, 0)
})
// ------------------------------------------------------------------
//  Key: String
// ------------------------------------------------------------------
Test('Should Record 14', () => {
  const T: Type.TRecord<'^.*$', Type.TNull> = Type.Record(Type.String(), Type.Null())
  Assert.IsEqual(Type.RecordPattern(T), '^.*$')

  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsString(Type.RecordKey(T)))
  Assert.IsTrue(Type.IsNull(Type.RecordValue(T)))
})
// ------------------------------------------------------------------
//  Key: Number
// ------------------------------------------------------------------
Test('Should Record 15', () => {
  const T: Type.TRecord<'^-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?$', Type.TNull> = Type.Record(Type.Number(), Type.Null())
  Assert.IsEqual(Type.RecordPattern(T), '^-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?$')

  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsNumber(Type.RecordKey(T)))
  Assert.IsTrue(Type.IsNull(Type.RecordValue(T)))
})
// ------------------------------------------------------------------
//  Key: Integer
// ------------------------------------------------------------------
Test('Should Record 16', () => {
  const T: Type.TRecord<'^-?(?:0|[1-9][0-9]*)$', Type.TNull> = Type.Record(Type.Integer(), Type.Null())
  Assert.IsEqual(Type.RecordPattern(T), '^-?(?:0|[1-9][0-9]*)$')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsInteger(Type.RecordKey(T)))
  Assert.IsTrue(Type.IsNull(Type.RecordValue(T)))
})
// ------------------------------------------------------------------
//  Key: Union
// ------------------------------------------------------------------
Test('Should Record 16', () => {
  const T: Type.TObject<{
    A: Type.TNull
    B: Type.TNull
  }> = Type.Record(
    Type.Union([
      Type.Literal('A'),
      Type.Literal('B')
    ]),
    Type.Null()
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNull(T.properties.A))
  Assert.IsTrue(Type.IsNull(T.properties.B))
})
Test('Should Record 17', () => {
  // The presence of TString causes collapse to TRecord despite TLiteral
  const T: Type.TRecord<'^.*$', Type.TNull> = Type.Record(
    Type.Union([
      Type.Literal('A'),
      Type.String()
    ]),
    Type.Null()
  )
  Assert.IsEqual(Type.RecordPattern(T), '^.*$')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsString(Type.RecordKey(T)))
  Assert.IsTrue(Type.IsNull(Type.RecordValue(T)))
})
Test('Should Record 18', () => {
  // The presence of TNumber causes collapse to TRecord despite TLiteral<string>
  const T: Type.TRecord<'^.*$', Type.TNull> = Type.Record(
    Type.Union([
      Type.Literal('A'),
      Type.Number()
    ]),
    Type.Null()
  )
  Assert.IsEqual(Type.RecordPattern(T), '^.*$')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsString(Type.RecordKey(T)))
  Assert.IsTrue(Type.IsNull(Type.RecordValue(T)))
})
Test('Should Record 19', () => {
  // The presence of TNumber causes collapse to TRecord despite TLiteral<number>
  const T: Type.TRecord<'^.*$', Type.TNull> = Type.Record(
    Type.Union([
      Type.Literal(1),
      Type.Number()
    ]),
    Type.Null()
  )
  Assert.IsEqual(Type.RecordPattern(T), '^.*$')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsString(Type.RecordKey(T)))
  Assert.IsTrue(Type.IsNull(Type.RecordValue(T)))
})
Test('Should Record 18', () => {
  // Reverse: The presence of TNumber causes collapse to TRecord despite TLiteral<string>
  const T: Type.TRecord<'^.*$', Type.TNull> = Type.Record(
    Type.Union([
      Type.Number(),
      Type.Literal('A')
    ]),
    Type.Null()
  )
  Assert.IsEqual(Type.RecordPattern(T), '^.*$')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsString(Type.RecordKey(T)))
  Assert.IsTrue(Type.IsNull(Type.RecordValue(T)))
})
Test('Should Record 19', () => {
  // Reverse: The presence of TNumber causes collapse to TRecord despite TLiteral<number>
  const T: Type.TRecord<'^.*$', Type.TNull> = Type.Record(
    Type.Union([
      Type.Number(),
      Type.Literal(1)
    ]),
    Type.Null()
  )
  Assert.IsEqual(Type.RecordPattern(T), '^.*$')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsString(Type.RecordKey(T)))
  Assert.IsTrue(Type.IsNull(Type.RecordValue(T)))
})
Test('Should Record 20', () => {
  const T: Type.TObject<{
    1: Type.TNull
  }> = Type.Record(
    Type.Union([
      Type.Literal(1)
    ]),
    Type.Null()
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNull(T.properties[1]))
})
Test('Should Record 21', () => {
  // Invalid keys are filtered.
  const T: Type.TObject<{
    A: Type.TString
  }> = Type.Record(
    Type.Union([
      Type.Literal('A'),
      Type.Symbol()
    ]),
    Type.String()
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.A))
})
Test('Should Record 22', () => {
  // Invalid keys filtered. The presence of TString causes collapse to TRecord despite having Literal key.
  const T: Type.TRecord<'^.*$', Type.TNull> = Type.Record(
    Type.Union([
      Type.Literal('A'),
      Type.Symbol(),
      Type.String()
    ]),
    Type.Null()
  )
  Assert.IsEqual(Type.RecordPattern(T), '^.*$')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsString(Type.RecordKey(T)))
  Assert.IsTrue(Type.IsNull(Type.RecordValue(T)))
})
// ------------------------------------------------------------------
//  Key: TemplateLiteral
// ------------------------------------------------------------------
Test('Should Record 23', () => {
  const T: Type.TObject<{
    A: Type.TNull
    B: Type.TNull
  }> = Type.Record(
    Type.TemplateLiteral([Type.Union([
      Type.Literal('A'),
      Type.Literal('B')
    ])]),
    Type.Null()
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNull(T.properties.A))
  Assert.IsTrue(Type.IsNull(T.properties.B))
})
Test('Should Record 24', () => {
  const T: Type.TRecord<'^(A|B).*$', Type.TNull> = Type.Record(
    Type.TemplateLiteral([
      Type.Union([
        Type.Literal('A'),
        Type.Literal('B')
      ]),
      Type.String()
    ]),
    Type.Null()
  )
  Assert.IsEqual(Type.RecordPattern(T), '^(A|B).*$')
  Assert.IsTrue(Type.IsRecord(T))
  Assert.IsTrue(Type.IsString(Type.RecordKey(T))) // observed as string
  Assert.IsTrue(Type.IsNull(Type.RecordValue(T)))
})
// ------------------------------------------------------------------
//  Key: Fall-Through
// ------------------------------------------------------------------
Test('Should Record 25', () => {
  const T: Type.TObject<{}> = Type.Record(Type.BigInt(), Type.Null())
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(Guard.Keys(T.properties).length, 0)
})
