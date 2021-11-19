import * as Spec from './spec'
import { Type } from './typebox'

{
    const K = Type.KeyOf(
        Type.Object({
            A: Type.Null(),
            B: Type.Null(),
            C: Type.Null(),
        })
    )

    Spec.expectType<'A' | 'B' | 'C'>(Spec.infer(K))
}

{
    const K = Type.KeyOf(
        Type.Pick(
            Type.Object({
                A: Type.Null(),
                B: Type.Null(),
                C: Type.Null(),
            }), ['A', 'B']
        )
    )
    Spec.expectType<'A' | 'B'>(Spec.infer(K))
}

{
    const K = Type.KeyOf(
        Type.Omit(
            Type.Object({
                A: Type.Null(),
                B: Type.Null(),
                C: Type.Null(),
            }), ['A', 'B']
        )
    )
    Spec.expectType<'C'>(Spec.infer(K))
}