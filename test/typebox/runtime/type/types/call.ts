// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Call')

Test('Should not guard Call', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsCall(T))
})

Test('Should Create Call 1', () => {
  const T: Type.TCall<Type.TRef<"A">, [Type.TString, Type.TNumber]>
    = Type.Call(Type.Ref('A'), [Type.String(), Type.Number()])
  Assert.IsTrue(Type.IsCall(T))
  Assert.IsTrue(Type.IsString(T.arguments[0]))
  Assert.IsTrue(Type.IsNumber(T.arguments[1]))
})