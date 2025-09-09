import { type Static, Type } from 'typebox'
import { Assert } from 'test'

// This types are objects with references to '#' making them a lot like interfaces
// which reference back to a named symbol. The Node type is the structural target.
{
  interface Node {
    id: string
    nodes: this[]
  }
  const T = Type.Object({
    id: Type.String(),
    nodes: Type.Array(Type.This())
  })
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, Node>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
