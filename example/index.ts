import { CodeGen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Custom } from '@sinclair/typebox/custom'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { TypeArray, TypeMap, TypeSet } from '@sinclair/typebox/collections'
import { Static, Type } from '@sinclair/typebox'

const K = Type.Object({ x: Type.Number(), y: Type.Number() })
const V = Type.String()

const map = new TypeMap(K, V)
map.set({ x: 0, y: 0 }, '')
map.set({ x: 1, y: 0 }, '')
map.set({ x: 1, y: 1 }, '')
map.set({ x: 0, y: 1 }, '')

const set = new TypeSet(
  Type.Object({
    x: Type.Number(),
    y: Type.Number(),
  }),
)

for (let i = 0; i < 233; i++) {
  set.add({ x: 1, y: 2 })
}

for (const [key, value] of map) {
  console.log(key, value)
}
