import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Generic([Type.Parameter('A')], Type.String())
type T = Static<typeof T>

Assert.IsExtendsMutual<T, unknown>(true)
Assert.IsExtendsMutual<T, null>(false)
