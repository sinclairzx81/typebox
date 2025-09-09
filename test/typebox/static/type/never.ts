import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Never()
type T = Static<typeof T>

Assert.IsExtendsNever<T>(true)
