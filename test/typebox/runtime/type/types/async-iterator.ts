import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.AsyncIterator')

Test('Should not guard AsyncIterator', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsAsyncIterator(T))
})
Test('Should Create AsyncIterator 1', () => {
  const T: Type.TAsyncIterator<Type.TNull> = Type.AsyncIterator(Type.Null())
  Assert.IsTrue(Type.IsAsyncIterator(T))
  Assert.IsTrue(Type.IsNull(T.iteratorItems))
})
Test('Should Create AsyncIterator with options', () => {
  const T: Type.TAsyncIterator<Type.TNull> = Type.AsyncIterator(Type.Null(), { a: 1, b: 2 })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
Test('Should Create AsyncIterator with options then extract', () => {
  const T: Type.TAsyncIterator<Type.TNull> = Type.AsyncIterator(Type.Null(), { a: 1, b: 2 })
  const O = Type.AsyncIteratorOptions(T)
  Assert.IsFalse(Type.IsAsyncIterator(O))
  Assert.HasPropertyKey(O, 'a')
  Assert.HasPropertyKey(O, 'b')
  Assert.IsEqual(O.a, 1)
  Assert.IsEqual(O.b, 2)
})
