import { Assert } from 'test'
import * as Type from 'typebox'
import Guard from 'typebox/guard'

const Test = Assert.Context('Type.Script.Object')

Test('Should Object 1', () => {
  const T: Type.TNull = Type.Script('null')
  Assert.IsFalse(Type.IsObject(T))
})
Test('Should Object 2', () => {
  const T: Type.TObject<{ x: Type.TNull }> = Type.Script('{ x: null }')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNull(T.properties.x))
  Assert.HasPropertyKey(T, 'required')
  Assert.IsEqual(T.required, ['x'])
})
Test('Should Object 3', () => {
  const T: Type.TObject<{ x: Type.TOptional<Type.TNull> }> = Type.Script('{ x?: null }')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNull(T.properties.x))
  Assert.IsFalse(Guard.HasPropertyKey(T, 'required'))
})
Test('Should Object 4', () => {
  const T: Type.TObject<{ x: Type.TReadonly<Type.TNull> }> = Type.Script('{ readonly x: null }')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNull(T.properties.x))
  Assert.HasPropertyKey(T, 'required')
  Assert.IsEqual(T.required, ['x'])
})
Test('Should Object 5', () => {
  const T: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNull>>
  }> = Type.Script('{ readonly x?: null }')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNull(T.properties.x))
  Assert.IsFalse(Guard.HasPropertyKey(T, 'required'))
})
Test('Should Object 6', () => {
  const T: Type.TObject<{ x: Type.TNull }> = Type.Script('Assign<{ x: null }, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Object 7', () => {
  const T: Type.TObject<{ x: Type.TNull }> = Type.Script('Assign<{ x: null }, { a: 1, b: 2 }>')
  const O = Type.ObjectOptions(T)
  Assert.IsFalse(Type.IsObject(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
Test('Should Object 8', () => {
  const T: Type.TObject<{
    0: Type.TString
    1: Type.TNumber
  }> = Type.Script('{ 0: string, 1: number }')
  Assert.IsTrue(Type.IsObject(T))
})
Test('Should Object 9', () => {
  const T = Type.Script('{ "x": string }')
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.x))
})
Test('Should Object 10', () => {
  const T = Type.Script("{ 'x': string }")
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.x))
})
// ------------------------------------------------------------------
// Index Signature: Single | Empty
// ------------------------------------------------------------------
Test('Should Object 11', () => {
  const T: Type.TObject<{}> = Type.Script(`{ [x: integer]: number }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.HasPropertyKey(T, 'patternProperties')
  Assert.HasPropertyKey(T.patternProperties, Type.IntegerKey)
  Assert.IsTrue(Type.IsNumber(T.patternProperties[Type.IntegerKey]))
})
Test('Should Object 12', () => {
  const T: Type.TObject<{}> = Type.Script(`{ [x: number]: number }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.HasPropertyKey(T, 'patternProperties')
  Assert.HasPropertyKey(T.patternProperties, Type.NumberKey)
  Assert.IsTrue(Type.IsNumber(T.patternProperties[Type.NumberKey]))
})
Test('Should Object 13', () => {
  const T: Type.TObject<{}> = Type.Script(`{ [x: string]: number }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.HasPropertyKey(T, 'patternProperties')
  Assert.HasPropertyKey(T.patternProperties, Type.StringKey)
  Assert.IsTrue(Type.IsNumber(T.patternProperties[Type.StringKey]))
})
Test('Should Object 14', () => {
  const T: Type.TObject<{}> = Type.Script(`{ [x: symbol]: number }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.HasPropertyKey(T, 'patternProperties')
  Assert.HasPropertyKey(T.patternProperties, Type.StringKey)
  Assert.IsTrue(Type.IsNumber(T.patternProperties[Type.StringKey]))
})
// ------------------------------------------------------------------
// Index Signature: Multiple | Empty
// ------------------------------------------------------------------
Test('Should Object 15', () => {
  const T: Type.TObject<{}> = Type.Script(`{ [x: string]: number, [x: number]: boolean }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.HasPropertyKey(T, 'patternProperties')
  Assert.HasPropertyKey(T.patternProperties, Type.StringKey)
  Assert.IsTrue(Type.IsNumber(T.patternProperties[Type.StringKey]))
  Assert.HasPropertyKey(T.patternProperties, Type.NumberKey)
  Assert.IsTrue(Type.IsBoolean(T.patternProperties[Type.NumberKey]))
})
// ------------------------------------------------------------------
// Index Signature: Multiple | NonEmpty
// ------------------------------------------------------------------
Test('Should Object 16', () => {
  const T: Type.TObject<{
    x: Type.TString
  }> = Type.Script(`{ [x: string]: number, [x: number]: boolean, x: string }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.x))
  Assert.HasPropertyKey(T, 'patternProperties')
  Assert.HasPropertyKey(T.patternProperties, Type.StringKey)
  Assert.IsTrue(Type.IsNumber(T.patternProperties[Type.StringKey]))
  Assert.HasPropertyKey(T.patternProperties, Type.NumberKey)
  Assert.IsTrue(Type.IsBoolean(T.patternProperties[Type.NumberKey]))
})
// ------------------------------------------------------------------
// Index Signature: Single | NonEmpty
// ------------------------------------------------------------------
Test('Should Object 17', () => {
  const T: Type.TObject<{
    x: Type.TBoolean
  }> = Type.Script(`{ [x: integer]: number, x: boolean }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsBoolean(T.properties.x))
  Assert.HasPropertyKey(T, 'patternProperties')
  Assert.HasPropertyKey(T.patternProperties, Type.IntegerKey)
  Assert.IsTrue(Type.IsNumber(T.patternProperties[Type.IntegerKey]))
})
Test('Should Object 18', () => {
  const T: Type.TObject<{
    x: Type.TBoolean
  }> = Type.Script(`{ [x: number]: number, x: boolean }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsBoolean(T.properties.x))
  Assert.HasPropertyKey(T, 'patternProperties')
  Assert.HasPropertyKey(T.patternProperties, Type.NumberKey)
  Assert.IsTrue(Type.IsNumber(T.patternProperties[Type.NumberKey]))
})
Test('Should Object 19', () => {
  const T: Type.TObject<{
    x: Type.TBoolean
  }> = Type.Script(`{ [x: string]: number, x: boolean }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsBoolean(T.properties.x))
  Assert.HasPropertyKey(T, 'patternProperties')
  Assert.HasPropertyKey(T.patternProperties, Type.StringKey)
  Assert.IsTrue(Type.IsNumber(T.patternProperties[Type.StringKey]))
})
Test('Should Object 20', () => {
  const T: Type.TObject<{
    x: Type.TBoolean
  }> = Type.Script(`{ [x: symbol]: number, x: boolean }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsBoolean(T.properties.x))
  Assert.HasPropertyKey(T, 'patternProperties')
  Assert.HasPropertyKey(T.patternProperties, Type.StringKey)
  Assert.IsTrue(Type.IsNumber(T.patternProperties[Type.StringKey]))
})
// ------------------------------------------------------------------
// Index Signature: Union
// ------------------------------------------------------------------
Test('Should Object 21', () => {
  // union indexer not supported
  const T: Type.TNever = Type.Script(`{ [x: string | number]: number }`)
  Assert.IsTrue(Type.IsNever(T))
})
