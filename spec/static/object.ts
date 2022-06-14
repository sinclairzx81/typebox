import * as Spec from './spec'
import { Type } from './typebox'

{
    const T = Type.Object({
        A: Type.String(),
        B: Type.String(),
        C: Type.String()
    })

    Spec.expectType<{
        A: string,
        B: string,
        C: string
    }>(Spec.infer(T))
}
{
    const T = Type.Object({
        A: Type.Object({
            A: Type.String(),
            B: Type.String(),
            C: Type.String()
        }),
        B: Type.Object({
            A: Type.String(),
            B: Type.String(),
            C: Type.String()
        }),
        C: Type.Object({
            A: Type.String(),
            B: Type.String(),
            C: Type.String()
        })
    })
    Spec.expectType<{
        A: {
            A: string,
            B: string,
            C: string
        },
        B: {
            A: string,
            B: string,
            C: string
        },
        C: {
            A: string,
            B: string,
            C: string
        }
    }>(Spec.infer(T))
}


