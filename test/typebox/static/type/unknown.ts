import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Unknown()
type T = Static<typeof T>

Assert.IsExtendsMutual<T, unknown>(true)
Assert.IsExtendsMutual<T, null>(false)
