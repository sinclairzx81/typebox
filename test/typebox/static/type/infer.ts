import { type Static, Type } from 'typebox'
import { Assert } from 'test'

// no context means unknown
{
  const T = Type.Infer('A')
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, unknown>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ... but can infer in-context
{
  const T = Type.Conditional(Type.String(), Type.Infer('A'), Type.Ref('A'), Type.Never())
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, string>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
