import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.This')

// ------------------------------------------------------------------
// Open
// ------------------------------------------------------------------
Test('Should This 1', () => {
  const T: Type.TThis = Type.Script('this')
  Assert.IsFalse(Type.IsNull(T))
})
Test('Should This 2', () => {
  const T: Type.TThis = Type.Script('this')
  Assert.IsTrue(Type.IsThis(T))
})
// ------------------------------------------------------------------
// Embdedded
// ------------------------------------------------------------------
Test('Should This 3', () => {
  const T: Type.TObject<{
    x: Type.TThis
  }> = Type.Script(`{
    x: this
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsThis(T.properties.x))
})
Test('Should This 3', () => {
  const T: Type.TObject<{
    x: Type.TArray<Type.TThis>
  }> = Type.Script(`{
    x: this[]
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsArray(T.properties.x))
  Assert.IsTrue(Type.IsThis(T.properties.x.items))
})
