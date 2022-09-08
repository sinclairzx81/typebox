import { Type, Static, TSelf, SchemaOptions } from '@sinclair/typebox'
import { NodeProperties, NodeTransform, NodeArray } from './node'
import { Geometry } from './geometry'
import { Material } from './material'

export type Mesh<T extends TSelf> = Static<ReturnType<typeof Mesh<T>>>
export function Mesh<T extends TSelf>(Node: T, options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('Mesh'),
      parameters: Type.Object({
        geometry: Geometry(),
        material: Material(),
      }),
      properties: NodeProperties(),
      transform: NodeTransform(),
      nodes: NodeArray(Node),
    },
    { ...options, $id: 'Mesh' },
  )
}
