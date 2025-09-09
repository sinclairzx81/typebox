import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Number()
type T = Static<typeof T>

Assert.IsExtendsMutual<T, number>(true)
Assert.IsExtendsMutual<T, null>(false)
