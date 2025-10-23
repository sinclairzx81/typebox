import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Iterator')

Test('Should not guard Iterator', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsIterator(T))
})
Test('Should Create Iterator 1', () => {
  const T: Type.TIterator<Type.TNull> = Type.Iterator(Type.Null())
  Assert.IsTrue(Type.IsIterator(T))
  Assert.IsTrue(Type.IsNull(T.iteratorItems))
})
Test('Should Create Iterator with options', () => {
  const T: Type.TIterator<Type.TNull> = Type.Iterator(Type.Null(), { a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Create Iterator with options then extract', () => {
  const T: Type.TIterator<Type.TNull> = Type.Iterator(Type.Null(), { a: 1, b: 2 })
  const O = Type.IteratorOptions(T)
  Assert.IsFalse(Type.IsIterator(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
