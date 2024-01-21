import { Static, Type } from '@sinclair/typebox'
import { Expect } from './assert'

{
  // identity
  const R = Type.Recursive((Node) =>
    Type.Object({
      id: Type.String(),
      nodes: Type.Array(Node),
    }),
  )
  type T = Static<typeof R>
  Expect(R).ToStatic<{ id: string; nodes: T[] }>()
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
  Expect(T).ToStatic<'id' | 'nodes'>()
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
  Expect(T).ToStatic<{
    id?: string | undefined
    nodes?: Static<typeof T>[] | undefined
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
  Expect(T).ToStatic<{
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
  Expect(T).ToStatic<{
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
  Expect(T).ToStatic<{
    nodes: Static<typeof T>[]
  }>()
}
// prettier-ignore
{
  // issue: https://github.com/sinclairzx81/typebox/issues/336
  type JSONValue = 
    | string 
    | number 
    | null 
    | boolean 
    | { [x: string]: JSONValue } 
    | JSONValue[]
  const R = Type.Recursive((Node) => Type.Union([
    Type.Null(), 
    Type.String(), 
    Type.Number(), 
    Type.Boolean(), 
    Type.Record(Type.String(), Node), 
    Type.Array(Node)
  ]))
  Expect(R).ToStatic<JSONValue>()
}
