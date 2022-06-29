import * as Spec from './spec'
import { Type } from './typebox'

// Asserts combinatory modifiers
{
  const T = Type.Object({
    A: Type.ReadonlyOptional(Type.String()),
    B: Type.Readonly(Type.String()),
    C: Type.Optional(Type.String()),
    D: Type.String(),
  })
  Spec.expectType<{
    readonly A?: string
    readonly B: string
    C?: string
    D: string
  }>(Spec.infer(T))
}
