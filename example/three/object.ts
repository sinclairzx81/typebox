import { Type, Static, TSelf, SchemaOptions } from '@sinclair/typebox'
import { NodeProperties, NodeTransform, NodeArray } from './node'

export type Object<T extends TSelf> = Static<ReturnType<typeof Object<T>>>
export function Object<T extends TSelf>(Node: T, options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('Object'),
      properties: NodeProperties(),
      transform: NodeTransform(),
      nodes: NodeArray(Node),
    },
    { ...options, $id: 'Object' },
  )
}
