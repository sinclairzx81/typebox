import { Type, Static, TSelf, SchemaOptions } from '@sinclair/typebox'
import { NodeProperties, NodeTransform, NodeArray } from './node'

export type PerspectiveCamera<T extends TSelf> = Static<ReturnType<typeof PerspectiveCamera<T>>>
export function PerspectiveCamera<T extends TSelf>(Node: T, options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('PerspectiveCamera'),
      parameters: Type.Object({
        fov: Type.Number(),
        aspect: Type.Number(),
        near: Type.Number(),
        far: Type.Number(),
      }),
      properties: NodeProperties(),
      transform: NodeTransform(),
      nodes: NodeArray(Node),
    },
    { ...options, $id: 'PerspectiveCamera' },
  )
}

export type OrthographicCamera<T extends TSelf> = Static<ReturnType<typeof OrthographicCamera<T>>>
export function OrthographicCamera<T extends TSelf>(Node: T, options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('OrthographicCamera'),
      parameters: Type.Object({
        left: Type.Number(),
        right: Type.Number(),
        top: Type.Number(),
        bottom: Type.Number(),
        near: Type.Number(),
        far: Type.Number(),
      }),
      properties: NodeProperties(),
      transform: NodeTransform(),
      nodes: NodeArray(Node),
    },
    { ...options, $id: 'OrthographicCamera' },
  )
}

export type ArrayCamera<T extends TSelf> = Static<ReturnType<typeof ArrayCamera<T>>>
export function ArrayCamera<T extends TSelf>(Node: T, options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('ArrayCamera'),
      parameters: Type.Object({
        cameras: Type.Array(PerspectiveCamera(Node)),
      }),
      properties: NodeProperties(),
      transform: NodeTransform(),
      nodes: NodeArray(Node),
    },
    { ...options, $id: 'ArrayCamera' },
  )
}

export type StereoCamera<T extends TSelf> = Static<ReturnType<typeof StereoCamera<T>>>
export function StereoCamera<T extends TSelf>(Node: T, options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('StereoCamera'),
      parameters: Type.Object({
        aspect: Type.Number({ default: 1 }),
        cameraL: PerspectiveCamera(Node),
        cameraR: PerspectiveCamera(Node),
      }),
      properties: NodeProperties(),
      transform: NodeTransform(),
      nodes: NodeArray(Node),
    },
    { ...options, $id: 'StereoCamera' },
  )
}

export type Camera = Static<ReturnType<typeof Camera>>
export function Camera(Node: TSelf, options: SchemaOptions = {}) {
  return Type.Union([OrthographicCamera(Node), PerspectiveCamera(Node), ArrayCamera(Node)], { ...options, $id: 'Camera' })
}
