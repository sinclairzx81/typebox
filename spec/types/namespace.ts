import * as Spec from './spec'
import { Type } from './typebox'

{
    const T = Type.Namespace({
        Vector2: Type.Object({
            X: Type.Number(),
            Y: Type.Number(),
        })
    }, { $id: 'Math' })

    Spec.expectType<{
        X: number,
        Y: number
    }>(Spec.infer(T['definitions']['Vector2']))
}