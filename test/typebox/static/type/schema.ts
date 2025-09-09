import { type Static, Type } from 'typebox'
import { Assert } from 'test'

// any object is technically a schema, we infer unknown
{
  const T = {}
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, unknown>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ... TypeBox will intercept for any type with a `~kind`, but will fall through
// to XStatic<T> which handles JSON Schema and Standard Schema inference.
{
  const T = { type: 'string' } as const // need const
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, string>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
