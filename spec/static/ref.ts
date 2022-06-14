import * as Spec from './spec'
import { Type } from './typebox'

{
    const T = Type.String({ $id: 'T' })

    const R = Type.Ref(T)

    Spec.expectType<string>(Spec.infer(R))

}
