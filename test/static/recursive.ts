import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const T = Type.Recursive((Node) =>
    Type.Object({
      id: Type.String(),
      nodes: Type.Array(Node),
    }),
  )

  type T = Static<typeof T>

  Expect(T).ToInfer<T>() // ? how to test....
}
