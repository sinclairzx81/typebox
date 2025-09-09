// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Parameter')

Test('Should not guard Parameter', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsParameter(T))
})
Test('Should Create Parameter 1', () => {
  const T: Type.TParameter<'A', Type.TUnknown, Type.TUnknown> = Type.Parameter('A')
  Assert.IsTrue(Type.IsParameter(T))
  Assert.IsTrue(Type.IsUnknown(T.extends))
  Assert.IsTrue(Type.IsUnknown(T.equals))
})
Test('Should Create Parameter 2', () => {
  const T: Type.TParameter<'A', Type.TNumber, Type.TNumber> = Type.Parameter('A', Type.Number())
  Assert.IsTrue(Type.IsParameter(T))
  Assert.IsTrue(Type.IsNumber(T.extends))
  Assert.IsTrue(Type.IsNumber(T.equals))
})
Test('Should Create Parameter 3', () => {
  const T: Type.TParameter<'A', Type.TNumber, Type.TLiteral<1>> = Type.Parameter('A', Type.Number(), Type.Literal(1))
  Assert.IsTrue(Type.IsParameter(T))
  Assert.IsTrue(Type.IsNumber(T.extends))
  Assert.IsTrue(Type.IsLiteral(T.equals))
})
