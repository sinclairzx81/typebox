import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Iterator')

Test('Should Iterator 1', () => {
  const T: Type.TNull = Type.Script('null')
  Assert.IsFalse(Type.IsIterator(T))
})
Test('Should Iterator 2', () => {
  const T: Type.TIterator<Type.TNull> = Type.Script('Iterator<null>')
  Assert.IsTrue(Type.IsIterator(T))
  Assert.IsTrue(Type.IsNull(T.iteratorItems))
})
Test('Should Iterator 3', () => {
  const T: Type.TIterator<Type.TNull> = Type.Script('Assign<Iterator<null>, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Iterator 4', () => {
  const T: Type.TIterator<Type.TNull> = Type.Script('Assign<Iterator<null>, { a: 1, b: 2 }>')
  const O = Type.IteratorOptions(T)
  Assert.IsFalse(Type.IsIterator(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
