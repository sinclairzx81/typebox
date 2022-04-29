import * as Spec from './spec'
import { Type } from './typebox'

{
  const A = Type.String()
  const B = Type.Number()
  const T = Type.Union([A, B])
  Spec.expectType<string | number>(Spec.infer(T))
}
{
  const A = Type.Object({
    A: Type.String(),
    B: Type.String(),
  })
  const B = Type.Object({
    X: Type.Number(),
    Y: Type.Number(),
  })
  const T = Type.Union([A, B])
  Spec.expectType<
    | {
        A: string
        B: string
      }
    | {
        X: number
        Y: number
      }
  >(Spec.infer(T))
}
