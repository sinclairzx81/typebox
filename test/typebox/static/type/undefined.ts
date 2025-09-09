import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Undefined()
type T = Static<typeof T>

Assert.IsExtendsMutual<T, undefined>(true)
Assert.IsExtendsMutual<T, null>(false)
