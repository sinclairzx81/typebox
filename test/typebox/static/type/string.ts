import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.String()
type T = Static<typeof T>

Assert.IsExtendsMutual<T, string>(true)
Assert.IsExtendsMutual<T, null>(false)
