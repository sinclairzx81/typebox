import * as Spec from './spec'
import { Type, Static } from './typebox'

{
  const T = Type.Recursive((Node) =>
    Type.Object({
      id: Type.String(),
      nodes: Type.Array(Node),
    }),
  )
  type T = Static<typeof T>
  Spec.expectType<T>(Spec.infer(T))
}
