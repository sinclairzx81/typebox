import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Null()
type T = Static<typeof T>

Assert.IsExtendsMutual<T, null>(true)
Assert.IsExtendsMutual<T, undefined>(false)
