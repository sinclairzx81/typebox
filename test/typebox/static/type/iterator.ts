import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Iterator(Type.String())
type T = Static<typeof T>

Assert.IsExtendsMutual<T, IterableIterator<string>>(true)
Assert.IsExtendsMutual<T, null>(false)
