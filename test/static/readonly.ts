import * as Spec from './spec'
import { Type } from './typebox'

{
  const T = Type.Object({
    A: Type.Readonly(Type.String()),
  })

  Spec.expectType<{
    readonly A: string
  }>(Spec.infer(T))
}
