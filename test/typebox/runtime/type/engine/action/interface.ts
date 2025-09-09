import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Interface')

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Interface 1', () => {
  const A: Type.TRef<'A'> = Type.Ref('A')
  const T: Type.TInterfaceDeferred<[Type.TRef<'A'>], {
    x: Type.TNumber
  }> = Type.Interface([A], { x: Type.Number() })
  Assert.IsTrue(Type.IsDeferred(T))
  Assert.IsEqual(T.action, 'Interface')
  Assert.IsEqual(T.parameters[0][0].$ref, 'A')
})
