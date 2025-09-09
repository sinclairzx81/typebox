import { Assert } from 'test'
import * as Type from 'typebox'
import Guard from 'typebox/guard'

const Test = Assert.Context('Type.Engine.Rest')

// ------------------------------------------------------------------
// No Rest
// ------------------------------------------------------------------
Test('Should Rest 1', () => {
  const S = Type.Tuple([Type.Ref('A')])
  const T: Type.TTuple<[Type.TRef<'A'>]> = Type.Instantiate({}, S)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].$ref, 'A')
})
// ------------------------------------------------------------------
// TRest<TTuple<[...]>>
// ------------------------------------------------------------------
Test('Should Rest 2', () => {
  const L = Type.Tuple([Type.Literal(1), Type.Literal(2)])
  const R = Type.Tuple([Type.Literal(3), Type.Literal(4)])
  const S = Type.Tuple([Type.Rest(L), Type.Rest(R)])
  const T = Type.Instantiate({}, S)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
  Assert.IsEqual(T.items[2].const, 3)
  Assert.IsEqual(T.items[3].const, 4)
})
// ------------------------------------------------------------------
// TRest<TRef<'A'>>
// ------------------------------------------------------------------
Test('Should Rest 3', () => {
  const S = Type.Tuple([Type.Rest(Type.Ref('A'))])
  const T: Type.TTuple<[Type.TRest<Type.TRef<'A'>>]> = Type.Instantiate({}, S)
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsRest(T.items[0]))
  Assert.IsEqual(T.items[0].items.$ref, 'A')
})
