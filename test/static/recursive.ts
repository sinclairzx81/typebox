import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  // identity
  const R = Type.Recursive((Node) =>
    Type.Object({
      id: Type.String(),
      nodes: Type.Array(Node),
    }),
  )
  type T = Static<typeof R>
  Expect(R).ToInfer<{ id: string; nodes: T[] }>()
}
{
  // keyof
  const R = Type.Recursive((Node) =>
    Type.Object({
      id: Type.String(),
      nodes: Type.Array(Node),
    }),
  )
  const T = Type.KeyOf(R)
  Expect(T).ToInfer<'id' | 'nodes'>()
}
{
  // partial
  const R = Type.Recursive((Node) =>
    Type.Object({
      id: Type.String(),
      nodes: Type.Array(Node),
    }),
  )
  const T = Type.Partial(R)
  Expect(T).ToInfer<{
    id: string | undefined
    nodes: Static<typeof T>[] | undefined
  }>()
}
{
  // required
  const R = Type.Recursive((Node) =>
    Type.Object({
      id: Type.String(),
      nodes: Type.Array(Node),
    }),
  )
  const P = Type.Partial(R)
  const T = Type.Required(P)
  Expect(T).ToInfer<{
    id: string
    nodes: Static<typeof T>[]
  }>()
}
{
  // pick
  const R = Type.Recursive((Node) =>
    Type.Object({
      id: Type.String(),
      nodes: Type.Array(Node),
    }),
  )
  const T = Type.Pick(R, ['id'])
  Expect(T).ToInfer<{
    id: string
  }>()
}
{
  // omit
  const R = Type.Recursive((Node) =>
    Type.Object({
      id: Type.String(),
      nodes: Type.Array(Node),
    }),
  )
  const T = Type.Omit(R, ['id'])
  Expect(T).ToInfer<{
    nodes: Static<typeof T>[]
  }>()
}
