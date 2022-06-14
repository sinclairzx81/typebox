import * as Spec from './spec'
import { Type, Static } from './typebox'

{
    const T = Type.Required(
        Type.Object({
            A: Type.Optional(Type.String()),
            B: Type.Optional(Type.String()),
            C: Type.Optional(Type.String())
        }),
    )

    Spec.expectType<{
        A: string,
        B: string,
        C: string
    }>(Spec.infer(T))
}