import { type Static, Type } from 'typebox'
import { Assert } from 'test'

// note: we need to review whether a deferred can instantiate
// if it's the context is present.
{
  const T = Type.Partial(Type.Ref('A')) // forced deferred
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, unknown>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
