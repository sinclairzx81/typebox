import { type Static, Type } from 'typebox'
import { Assert } from 'test'

{
  const T = Type.Literal(true)
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, true>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
{
  const T = Type.Literal(1)
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 1>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
{
  const T = Type.Literal('hello')
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 'hello'>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
{
  const T = Type.Literal(1000n)
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 1000n>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
