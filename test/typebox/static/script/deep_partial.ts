import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const A = Type.Script(`
  type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
  }
  type Result = DeepPartial<{
    x: {
      y: 1
    }
  }>
`).Result

Assert.IsExtendsMutual<Static<typeof A>, {
  x?: {
    y?: 1 | undefined
  } | undefined
}>(true)
