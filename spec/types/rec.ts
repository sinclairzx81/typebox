import * as Spec from './spec'
import { Type } from './typebox'

{
    const T = Type.Rec(Self => Type.Object({
        id:    Type.String(),
        nodes: Type.Array(Self)
    }))

    Spec.expectType<{
        id: string,
        nodes: { id: string, nodes: [] }[]
    }>(Spec.infer(T))
}