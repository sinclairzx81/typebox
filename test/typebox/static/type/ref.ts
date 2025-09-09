import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Ref('A')
type T = Static<typeof T>

Assert.IsExtendsMutual<T, unknown>(true)
Assert.IsExtendsMutual<T, null>(false)
