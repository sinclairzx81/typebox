import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Kind, Static, TSchema } from '@sinclair/typebox'

const T = Type.Recursive((Node) =>
  Type.Object({
    id: Type.String(),
    nodes: Type.Array(Node),
  }),
)
const R = Type.Ref(T)

const C = TypeCompiler.Compile(R, [R])

console.log(C.Check({ id: '', nodes: [{ id: '', nodes: [] }] }))

type R = Static<typeof R>

console.log(R)
