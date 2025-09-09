import { type Static, Type } from 'typebox'
import { Assert } from 'test'

{
  const T = Type.Call(Type.Ref('A'), [])
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, unknown>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// Callable
{
  const G = Type.Generic([Type.Parameter('A')], Type.String())
  const T = Type.Call(G, [Type.Number()])
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, string>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
