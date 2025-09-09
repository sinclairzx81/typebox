import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Symbol()
type T = Static<typeof T>

Assert.IsExtendsMutual<T, symbol>(true)
Assert.IsExtendsMutual<T, null>(false)
