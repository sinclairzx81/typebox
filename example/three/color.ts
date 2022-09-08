import { Type, Static, SchemaOptions } from '@sinclair/typebox'

export type Color = Static<ReturnType<typeof Color>>
export const Color = (options: SchemaOptions = {}) => Type.String({ ...options, $id: 'Color' })
