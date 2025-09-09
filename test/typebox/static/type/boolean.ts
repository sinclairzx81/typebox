import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Boolean()
type T = Static<typeof T>

Assert.IsExtendsMutual<T, boolean>(true)
Assert.IsExtendsMutual<T, null>(false)
