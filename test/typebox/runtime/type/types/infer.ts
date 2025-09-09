// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Infer')

Test('Should not guard Infer', () => {
  const T = Type.Null()
  Assert.IsFalse(Type.IsInfer(T))
})
Test('Should Create Infer 1', () => {
  const T: Type.TInfer<'A', Type.TUnknown> = Type.Infer('A')
  Assert.IsEqual(T.name, 'A')
  Assert.IsTrue(Type.IsUnknown(T.extends))
})
Test('Should Create Infer 2', () => {
  const T: Type.TInfer<'A', Type.TNull> = Type.Infer('A', Type.Null())
  Assert.IsTrue(Type.IsInfer(T))
  Assert.IsEqual(T.name, 'A')
  Assert.IsTrue(Type.IsNull(T.extends))
})
