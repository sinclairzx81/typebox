import * as Spec from './spec'
import { Type } from './typebox'

{
  const T = Type.Omit(
    Type.Object({
      A: Type.String(),
      B: Type.String(),
      C: Type.String(),
    }),
    ['C'],
  )

  Spec.expectType<{
    A: string
    B: string
  }>(Spec.infer(T))
}
