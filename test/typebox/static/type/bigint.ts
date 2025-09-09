import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.BigInt()
type T = Static<typeof T>

Assert.IsExtendsMutual<T, bigint>(true)
Assert.IsExtendsMutual<T, null>(false)
