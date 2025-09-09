import { type Static, Type } from 'typebox'
import { Assert } from 'test'

const A = Type.Script(`
  type Reverse<T, A extends unknown[] = []> = (
    T extends [infer L, ...infer R extends unknown[]]
      ? Reverse<R, [L, ...A]>
      : A
  )
  type Result = Reverse<[1, 2, 3, 4]>
`).Result

Assert.IsExtendsMutual<Static<typeof A>, [4, 3, 2, 1]>(true)
