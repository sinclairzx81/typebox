import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Dependent')

// ------------------------------------------------------------------
// Dependent
// ------------------------------------------------------------------
Test('Should Dependent 1', () => {
  const T: Type.TDependent<Type.TNumber, Type.TBoolean, Type.TString> = Type.Script('if number then boolean else string')
  Assert.IsTrue(Type.IsDependent(T))
  Assert.IsTrue(Type.IsNumber(T.if))
  Assert.IsTrue(Type.IsBoolean(T.then))
  Assert.IsTrue(Type.IsString(T.else))
})
Test('Should Dependent 2', () => {
  const T: Type.TWith<Type.TDependent<Type.TNumber, Type.TBoolean, Type.TString>, {
    value: 123
  }> = Type.Script('(if number then boolean else string) with { value: 123 }')
  Assert.IsTrue(Type.IsDependent(T))
  Assert.IsTrue(Type.IsNumber(T.if))
  Assert.IsTrue(Type.IsBoolean(T.then))
  Assert.IsTrue(Type.IsString(T.else))
  Assert.HasPropertyKey(T, 'value')
  Assert.IsEqual(T.value, 123)
})
Test('Should Dependent 3', () => {
  const T: Type.TDependent<Type.TNumber, Type.TBoolean, Type.TUnknown> = Type.Script('(if number then boolean)')
  Assert.IsTrue(Type.IsDependent(T))
  Assert.IsTrue(Type.IsNumber(T.if))
  Assert.IsTrue(Type.IsBoolean(T.then))
  Assert.IsTrue(Type.IsUnknown(T.else))
})
Test('Should Dependent 4', () => {
  const T: Type.TWith<Type.TDependent<Type.TNumber, Type.TBoolean, Type.TUnknown>, {
    value: 123
  }> = Type.Script('(if number then boolean) with { value: 123 }')
  Assert.IsTrue(Type.IsDependent(T))
  Assert.IsTrue(Type.IsNumber(T.if))
  Assert.IsTrue(Type.IsBoolean(T.then))
  Assert.IsTrue(Type.IsUnknown(T.else))
  Assert.HasPropertyKey(T, 'value')
  Assert.IsEqual(T.value, 123)
})
// ------------------------------------------------------------------
// Constructive Parens
// ------------------------------------------------------------------
Test('Should Dependent 5', () => {
  const D = Type.Script(`if { x: number } then (
    if { y: string } then (
      { z: boolean }
    ) else never
  ) else never`)
  const T = Type.Script({ D }, `Evaluate<D>`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
  Assert.IsTrue(Type.IsBoolean(T.properties.z))
})
Test('Should Dependent 6', () => {
  const D = Type.Script(`if { x: number } then (
    if { y: string } then (
      { z: boolean }
    ) 
  )`)
  const T = Type.Script({ D }, `Evaluate<D>`)
  Assert.IsTrue(Type.IsUnknown(T))
})
// ------------------------------------------------------------------
// Constructive (No Parens)
// ------------------------------------------------------------------
Test('Should Dependent 5', () => {
  const D = Type.Script(`if { x: number } then 
    if { y: string } then 
      { z: boolean }
     else never
   else never`)
  const T = Type.Script({ D }, `Evaluate<D>`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsString(T.properties.y))
  Assert.IsTrue(Type.IsBoolean(T.properties.z))
})
Test('Should Dependent 6', () => {
  const D = Type.Script(`if { x: number } then 
    if { y: string } then 
      { z: boolean }
  `)
  const T = Type.Script({ D }, `Evaluate<D>`)
  Assert.IsTrue(Type.IsUnknown(T))
})
