import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.AsyncIterator')

Test('Should AsyncIterator 1', () => {
  const T: Type.TNull = Type.Script('null')
  Assert.IsFalse(Type.IsAsyncIterator(T))
})
Test('Should AsyncIterator 2', () => {
  const T: Type.TAsyncIterator<Type.TNull> = Type.Script('AsyncIterator<null>')
  Assert.IsTrue(Type.IsAsyncIterator(T))
  Assert.IsTrue(Type.IsNull(T.iteratorItems))
})
Test('Should AsyncIterator 3', () => {
  const T: Type.TAsyncIterator<Type.TNull> = Type.Script('Assign<AsyncIterator<null>, { a: 1, b: 2 }>')
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should AsyncIterator 4', () => {
  const T = Type.Script('Assign<AsyncIterator<null>, { a: 1, b: 2 }>')
  const O = Type.AsyncIteratorOptions(T)
  Assert.IsFalse(Type.IsAsyncIterator(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
