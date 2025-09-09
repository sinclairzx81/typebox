import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Ref')

Test('Should Ref 1', () => {
  const A = Type.String()
  const R = Type.Ref('A')
  const T: Type.TString = Type.Instantiate({ A }, R)
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Ref 1', () => {
  const A = Type.String()
  const R = Type.Ref('B')
  const T: Type.TRef<'B'> = Type.Instantiate({ A }, R)
  Assert.IsTrue(Type.IsRef(T))
  Assert.IsEqual(T.$ref, 'B')
})
Test('Should Ref 1', () => {
  const A = Type.Ref('B')
  const B = Type.Ref('A')
  const T: Type.TRef<'A'> = Type.Instantiate({ A, B }, B)
  Assert.IsTrue(Type.IsRef(T))
  Assert.IsEqual(T.$ref, 'A')
})
Test('Should Ref 1', () => {
  const A = Type.Ref('B')
  const B = Type.Ref('A')
  const T: Type.TRef<'A'> = Type.Instantiate({ A, B }, B)
  Assert.IsTrue(Type.IsRef(T))
  Assert.IsEqual(T.$ref, 'A')
})
