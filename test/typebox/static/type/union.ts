import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Union([
  Type.Literal(1),
  Type.Literal(2),
  Type.Literal(3)
])
type T = Static<typeof T>

Assert.IsExtendsMutual<T, 1 | 2 | 3>(true)
Assert.IsExtendsMutual<T, null>(false)
