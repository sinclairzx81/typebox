import * as Spec from './spec'
import { Type } from './typebox'

{
    const T = Type.Pick(
        Type.Object({
            A: Type.String(),
            B: Type.String(),
            C: Type.String()
        }),
        ['A', 'B'])

    Spec.expectType<{
        A: string,
        B: string
    }>(Spec.infer(T))
}