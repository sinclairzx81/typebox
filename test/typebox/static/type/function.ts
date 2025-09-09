import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const T = Type.Function([Type.String(), Type.Boolean()], Type.Object({ x: Type.Number() }))
type T = Static<typeof T>

Assert.IsExtends<T, (a: string, b: boolean) => { x: number }>(true)
Assert.IsExtends<T, null>(false)
