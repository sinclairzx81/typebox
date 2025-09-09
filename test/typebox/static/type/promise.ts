import { type Static, Type } from 'typebox'
import { Assert } from 'test'

{
  const T = Type.Promise(Type.String())
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, Promise<string>>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// no-auto-unwrap
{
  const T = Type.Promise(Type.Promise(Type.String()))
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, Promise<Promise<string>>>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
