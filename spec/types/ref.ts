import * as Spec from './spec'
import { Type } from './typebox'

{
    const T = Type.String()

    const R = Type.Ref(T)

    Spec.expectType<string>(Spec.infer(R))

}
{
    const T = Type.Namespace({
        Vector2: Type.Object({
            X: Type.Number(),
            Y: Type.Number(),
        })
    }, { $id: 'Math' })

    const R = Type.Ref(T, 'Vector2')

    Spec.expectType<{
        X: number,
        Y: number
    }>(Spec.infer(R))
}