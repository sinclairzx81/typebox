import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Any()
type T = Static<typeof T>

Assert.IsExtendsMutual<T, any>(true)
