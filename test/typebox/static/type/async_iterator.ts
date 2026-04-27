import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.AsyncIterator(Type.String())
type T = Static<typeof T>

Assert.IsExtendsMutual<T, AsyncIterableIterator<string>>(true)
Assert.IsExtendsMutual<T, null>(false)
