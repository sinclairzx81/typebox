import * as Spec from './spec'
import { Type } from './typebox'

{
    const T = Type.Strict(Type.Object({
        A: Type.String(),
        B: Type.String(),
        C: Type.String()
    }))
    
    Spec.expectType<{
        A: string,
        B: string,
        C: string
    }>(Spec.infer(T))
}