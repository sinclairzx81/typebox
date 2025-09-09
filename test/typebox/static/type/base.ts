import { type Static, Type } from 'typebox'
import { Assert } from 'test'

class B extends Type.Base<string> {
}

const T = new B()
type T = Static<typeof T>

Assert.IsExtendsMutual<T, string>(true)
Assert.IsExtendsMutual<T, null>(false)
