import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Void()
type T = Static<typeof T>

Assert.IsExtendsMutual<T, void>(true)
Assert.IsExtendsMutual<T, null>(false)
