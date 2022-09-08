import { Type, Static, TSelf, SchemaOptions } from '@sinclair/typebox'
import * as Camera from './camera'
import * as Light from './light'
import * as Math from './math'
import { Mesh } from './mesh'
import { Object } from './object'

export type NodeArray<T extends TSelf> = Static<ReturnType<typeof NodeArray<T>>>
export function NodeArray<T extends TSelf>(Node: T, options: SchemaOptions = {}) {
  return Type.Array(Node, { ...options, $id: 'NodeArray' })
}

export type NodeTransform = Static<ReturnType<typeof NodeTransform>>
export function NodeTransform(options: SchemaOptions = {}) {
  return Type.Object(
    {
      position: Math.Vector3({ default: [0, 0, 0] }),
      rotation: Math.Vector3({ default: [0, 0, 0] }),
      scale: Math.Vector3({ default: [1, 1, 1] }),
    },
    { ...options, $id: 'NodeTransform' },
  )
}

export type NodeProperties = Static<ReturnType<typeof NodeProperties>>
export function NodeProperties(options: SchemaOptions = {}) {
  return Type.Object(
    {
      id: Type.Number(),
      uuid: Type.String(),
      name: Type.String(),
      visible: Type.Boolean(),
    },
    { ...options, $id: 'NodeProperties' },
  )
}

export type Node = Static<ReturnType<typeof Node>>
export function Node(options: SchemaOptions = {}) {
  return Type.Recursive(
    (Node) =>
      Type.Union([
        Camera.PerspectiveCamera(Node),
        Camera.OrthographicCamera(Node),
        Camera.ArrayCamera(Node),
        Camera.StereoCamera(Node),
        Light.AmbientLightProbe(Node),
        Light.AmbientLight(Node),
        Light.DirectionalLight(Node),
        Light.LightShadow(Node),
        Light.HemisphereLight(Node),
        Object(Node),
        Mesh(Node),
      ]),
    { ...options, $id: 'Node' },
  )
}
