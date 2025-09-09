import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Enum([1, 'A', null])
type T = Static<typeof T>

Assert.IsExtendsMutual<T, 1 | 'A' | null>(true)
Assert.IsExtendsMutual<T, null>(false)
