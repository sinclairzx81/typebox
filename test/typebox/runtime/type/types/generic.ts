import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Generic')

Test('Should not guard Generic', () => {
  const T: Type.TNull = Type.Null()
  Assert.IsFalse(Type.IsGeneric(T))
})
Test('Should Create Generic 1', () => {
  const T: Type.TGeneric<[Type.TParameter<'A', Type.TUnknown, Type.TUnknown>], Type.TTuple<[Type.TRef<'A'>, Type.TNumber]>> = Type.Generic([Type.Parameter('A')], Type.Tuple([Type.Ref('A'), Type.Number()]))
})
Test('Should Create Generic and Guard', () => {
  const T: Type.TGeneric<[Type.TParameter<'A', Type.TUnknown, Type.TUnknown>], Type.TTuple<[Type.TRef<'A'>, Type.TNumber]>> = Type.Generic([Type.Parameter('A')], Type.Tuple([Type.Ref('A'), Type.Number()]))
  Assert.IsTrue(Type.IsGeneric(T))
  Assert.IsTrue(Type.IsParameter(T.parameters[0]))
  Assert.IsTrue(Type.IsRef(T.expression.items[0]))
  Assert.IsTrue(Type.IsNumber(T.expression.items[1]))
})
