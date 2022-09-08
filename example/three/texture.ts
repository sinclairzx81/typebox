import { Type, Static, SchemaOptions } from '@sinclair/typebox'
import * as Enum from './enum'

export function TextureImageNone(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('TextureImageNone'),
    },
    { ...options, $id: 'TextureImageNone' },
  )
}

export function TextureImageHTMLImageElement(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('HTMLImageElement'),
    },
    { ...options, $id: 'HTMLImageElement' },
  )
}

export function TextureImageHTMLCanvasElement(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('HTMLCanvasElement'),
    },
    { ...options, $id: 'HTMLCanvasElement' },
  )
}

export function TextureImageHTMLVideoElement(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('HTMLVideoElement'),
    },
    { ...options, $id: 'HTMLVideoElement' },
  )
}

export function TextureImage(options: SchemaOptions = {}) {
  return Type.Union([TextureImageNone(), TextureImageHTMLImageElement(), TextureImageHTMLCanvasElement(), TextureImageHTMLVideoElement()], { ...options, $id: 'TextureImage' })
}

export type NoneTexture = Static<ReturnType<typeof NoneTexture>>
export function NoneTexture(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('None'),
    },
    { ...options, $id: 'NoneTexture' },
  )
}

export type Texture = Static<ReturnType<typeof Texture>>
export function Texture(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('Texture'),
      parameters: Type.Object({
        image: TextureImage(),
        mapping: Enum.Mapping({ default: '' }),
        wrapS: Enum.Wrapping({ default: 'ClampToEdgeWrapping' }),
        wrapT: Enum.Wrapping({ default: 'ClampToEdgeWrapping' }),
        magFilter: Enum.TextureFilter({ default: 'NearestFilter' }),
        minFilter: Enum.TextureFilter({ default: 'NearestFilter' }),
        format: Enum.PixelFormat(),
        type: Enum.TextureDataType(),
        anisotropy: Type.Number({ default: 1 }),
        encoding: Enum.TextureEncoding(),
      }),
      properties: Type.Object({
        id: Type.Number(),
        uuid: Type.String(),
        name: Type.String(),
        sourceFile: Type.String(),
      }),
    },
    { ...options, $id: 'Texture' },
  )
}

export type DepthTexture = Static<ReturnType<typeof DepthTexture>>
export function DepthTexture(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('DepthTexture'),
      parameters: Type.Object({
        width: Type.Number(),
        height: Type.Number(),
        type: Enum.TextureDataType(),
        mapping: Enum.Mapping({}),
        wrapS: Enum.Wrapping({ default: 'ClampToEdgeWrapping' }),
        wrapT: Enum.Wrapping({ default: 'ClampToEdgeWrapping' }),
        magFilter: Enum.TextureFilter({ default: 'NearestFilter' }),
        minFilter: Enum.TextureFilter({ default: 'NearestFilter' }),
        anisotropy: Type.Number({ default: 1 }),
      }),
      properties: Type.Object({
        id: Type.Number(),
        uuid: Type.String(),
        name: Type.String(),
        sourceFile: Type.String(),
      }),
    },
    { ...options, $id: 'DepthTexture' },
  )
}

export type TextureAny = Static<ReturnType<typeof TextureAny>>
export function TextureAny(options: SchemaOptions = {}) {
  return Type.Union([NoneTexture(), Texture(), DepthTexture()], { ...options, $id: 'TextureAny' })
}
