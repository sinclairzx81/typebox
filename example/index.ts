import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'

const T = Type.Recursive(Node => Type.Object({
    id: Type.String(),
    nodes: Type.Array(Node)
}))

const S = Type.Object({
    a: Type.String(),
    node: T
})

type S = Static<typeof S>

const P = Type.Pick(S, ['node'])

type P = Static<typeof P>

