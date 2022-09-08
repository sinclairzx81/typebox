import { Type, Static, SchemaOptions } from '@sinclair/typebox'

export type Matrix4 = Static<ReturnType<typeof Matrix4>>
export function Matrix4(options: SchemaOptions = {}) {
  return Type.Tuple(
    [
      Type.Tuple([Type.Number({ default: 1 }), Type.Number({ default: 0 }), Type.Number({ default: 0 }), Type.Number({ default: 0 })]),
      Type.Tuple([Type.Number({ default: 0 }), Type.Number({ default: 1 }), Type.Number({ default: 0 }), Type.Number({ default: 0 })]),
      Type.Tuple([Type.Number({ default: 0 }), Type.Number({ default: 0 }), Type.Number({ default: 1 }), Type.Number({ default: 0 })]),
      Type.Tuple([Type.Number({ default: 0 }), Type.Number({ default: 0 }), Type.Number({ default: 0 }), Type.Number({ default: 1 })]),
    ],
    { ...options, $id: 'Matrix4' },
  )
}

export type Vector4 = Static<ReturnType<typeof Vector4>>
export function Vector4(options: SchemaOptions = {}) {
  return Type.Tuple([Type.Number({ default: 0 }), Type.Number({ default: 0 }), Type.Number({ default: 0 }), Type.Number({ default: 0 })], { ...options, $id: 'Vector4' })
}

export type Vector3 = Static<ReturnType<typeof Vector3>>
export function Vector3(options: SchemaOptions = {}) {
  return Type.Tuple([Type.Number({ default: 0 }), Type.Number({ default: 0 }), Type.Number({ default: 0 })], { ...options, $id: 'Vector3' })
}

export type Vector2 = Static<ReturnType<typeof Vector2>>
export function Vector2(options: SchemaOptions = {}) {
  return Type.Tuple([Type.Number({ default: 0 }), Type.Number({ default: 0 })], { ...options, $id: 'Vector2' })
}

export type Plane = Static<ReturnType<typeof Plane>>
export function Plane(options: SchemaOptions = {}) {
  return Type.Tuple([Type.Number({ default: 0 }), Type.Number({ default: 1 }), Type.Number({ default: 0 }), Type.Number({ default: 0 })], { ...options, $id: 'Plane' })
}
