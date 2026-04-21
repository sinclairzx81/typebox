import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Refine')

Test('Should guard Refine 0', () => {
  const T: Type.TRefine<Type.TString> = Type.Refine(Type.String(), (_value) => true)
  Assert.IsFalse(Type.IsNull(T))
  Assert.IsTrue(Type.IsRefine(T))
})
Test('Should guard Refine 1', () => {
  const T: Type.TRefine<Type.TString> = Type.Refine(Type.String(), (_value) => true)
  Assert.IsTrue(Type.IsString(T))
  Assert.IsTrue(Type.IsRefine(T))
})
Test('Should guard Refine 2', () => {
  const T: Type.TRefine<Type.TString> = Type.Refine(Type.String(), (_value) => true, (_value) => '')
  Assert.IsTrue(Type.IsString(T))
  Assert.IsTrue(Type.IsRefine(T))
})
Test('Should guard Refine 3', () => {
  const T: Type.TRefine<Type.TString> = Type.Refine(Type.String(), (_value) => true, 'deprecated')
  Assert.IsTrue(Type.IsString(T))
  Assert.IsTrue(Type.IsRefine(T))
})
