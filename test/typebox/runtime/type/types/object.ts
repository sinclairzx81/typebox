// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'
import Guard from 'typebox/guard'

const Test = Assert.Context('Type.Object')

Test('Should not guard Object', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsObject(T))
})
Test('Should Create Object 1', () => {
  const T: Type.TObject<{ x: Type.TNull }> 
    = Type.Object({ x: Type.Null() })
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNull(T.properties.x))
  Assert.HasPropertyKey(T, 'required')
  Assert.IsEqual(T.required, ['x'])
})
Test('Should Create Object with Optional', () => {
  const T: Type.TObject<{ x: Type.TOptional<Type.TNull> }> 
    = Type.Object({ x: Type.Optional(Type.Null()) })
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsFalse(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNull(T.properties.x))
  Assert.IsFalse(Guard.HasPropertyKey(T, 'required'))
})
Test('Should Create Object with Readonly', () => {
  const T: Type.TObject<{ x: Type.TReadonly<Type.TNull> }> 
    = Type.Object({ x: Type.Readonly(Type.Null()) })
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsFalse(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNull(T.properties.x))
  Assert.HasPropertyKey(T, 'required')
  Assert.IsEqual(T.required, ['x'])
})
Test('Should Create Object with ReadonlyOptional', () => {
  const T: Type.TObject<{ 
    x: Type.TReadonly<Type.TOptional<Type.TNull>>
  }> = Type.Object({ x: Type.Readonly(Type.Optional(Type.Null())) })
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsReadonly(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))
  Assert.IsTrue(Type.IsNull(T.properties.x))
  Assert.IsFalse(Guard.HasPropertyKey(T, 'required'))
})
Test('Should Create Object with options', () => {
  const T: Type.TObject<{ x: Type.TNull }> = Type.Object({ x: Type.Null() }, { a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Create Object with options then extract', () => {
  const T: Type.TObject<{ x: Type.TNull }> = Type.Object({ x: Type.Null() }, { a: 1, b: 2 })
  const O = Type.ObjectOptions(T)
  Assert.IsFalse(Type.IsObject(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})