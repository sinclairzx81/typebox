import * as Spec from './spec'
import { Type } from './typebox'

{
  const T = Type.Object({
    A: Type.Optional(Type.String()),
  })
  Spec.expectType<{
    A?: string
  }>(Spec.infer(T))
}
