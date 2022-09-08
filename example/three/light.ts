import { Type, Static, TSelf, SchemaOptions } from '@sinclair/typebox'
import { NodeProperties, NodeTransform, NodeArray } from './node'
import { Color } from './color'
import * as Math from './math'
import * as Enum from './enum'
import * as Texture from './texture'
import * as Camera from './camera'

// ------------------------------------------------------------------------
// WebGLRenderTarget
// ------------------------------------------------------------------------

export type WebGLRenderTargetOptions = Static<ReturnType<typeof WebGLRenderTargetOptions>>
export function WebGLRenderTargetOptions(options: SchemaOptions = {}) {
  return Type.Object(
    {
      wrapS: Enum.Wrapping(),
      wrapT: Enum.Wrapping(),
      magFilter: Enum.TextureFilter(),
      minFilter: Enum.TextureFilter(),
      format: Enum.PixelFormat({ default: 'RGBAFormat' }),
      type: Enum.TextureDataType({ default: 'UnsignedByteType' }),
      anisotropy: Type.Number(),
      depthBuffer: Type.Boolean({ default: true }),
      stencilBuffer: Type.Boolean({ default: false }),
      generateMipmaps: Type.Boolean({ default: true }),
      depthTexture: Texture.DepthTexture(),
      encoding: Enum.TextureEncoding(),
    },
    { ...options, $id: 'WebGLRenderTargetOptions' },
  )
}

export type WebGLRenderTarget = Static<ReturnType<typeof WebGLRenderTarget>>
export function WebGLRenderTarget(options: SchemaOptions = {}) {
  return Type.Object(
    {
      parameters: Type.Object({
        width: Type.Number({ default: 512 }),
        height: Type.Number({ default: 512 }),
      }),
      options: WebGLRenderTargetOptions(),
    },
    { $id: 'WebGLRenderTarget', ...options },
  )
}

// ------------------------------------------------------------------------
// LightShadow
// ------------------------------------------------------------------------

export type LightShadow<T extends TSelf> = Static<ReturnType<typeof LightShadow<T>>>
export function LightShadow<T extends TSelf>(Node: T, options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('LightShadow'),
      parameters: Type.Object({
        camera: Camera.Camera(Node),
      }),
      properties: Type.Object({
        bias: Type.Number({ default: 0 }),
        normalBias: Type.Number({ default: 0 }),
        radius: Type.Number({ default: 1 }),
        blurSamples: Type.Number({ default: 8 }),
        mapSize: Math.Vector2(),
        map: WebGLRenderTarget(),
        mapPass: WebGLRenderTarget(),
        matrix: Math.Matrix4(),
      }),
    },
    { ...options, $id: 'LightShadow' },
  )
}

// ------------------------------------------------------------------------
// LightProperties
// ------------------------------------------------------------------------

export type LightProperties<T extends TSelf> = Static<ReturnType<typeof LightProperties<T>>>
export function LightProperties<T extends TSelf>(Node: T, options: SchemaOptions = {}) {
  return Type.Object(
    {
      color: Color(),
      intensity: Type.Number(),
      shadow: LightShadow(Node),
    },
    { ...options, $id: 'LightProperties' },
  )
}

// ------------------------------------------------------------------------
// AmbientLightProbe
// ------------------------------------------------------------------------

export type AmbientLightProbe<T extends TSelf> = Static<ReturnType<typeof AmbientLightProbe<T>>>
export function AmbientLightProbe<T extends TSelf>(Node: T, options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('AmbientLightProbe'),
      color: Color(),
      intensity: Type.Number(),
      properties: NodeProperties(),
      transform: NodeTransform(),
      nodes: NodeArray(Node),
    },
    { ...options, $id: 'AmbientLightProbe' },
  )
}

// ------------------------------------------------------------------------
// AmbientLight
// ------------------------------------------------------------------------

export type AmbientLight<T extends TSelf> = Static<ReturnType<typeof AmbientLight<T>>>
export function AmbientLight<T extends TSelf>(Node: T, options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('AmbientLight'),
      color: Color(),
      intensity: Type.Number(),
      properties: NodeProperties(),
      transform: NodeTransform(),
      nodes: NodeArray(Node),
    },
    { ...options, $id: 'AmbientLight' },
  )
}

// -----------------------------------------------------------
// DirectionalLightShadow
// -----------------------------------------------------------
export type DirectionalLightShadow<T extends TSelf> = Static<ReturnType<typeof DirectionalLightShadow<T>>>
export function DirectionalLightShadow<T extends TSelf>(Node: T, options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('DirectionalLightShadow'),
      camera: Camera.OrthographicCamera(Node),
    },
    { ...options, $id: 'DirectionalLightShadow' },
  )
}

// ------------------------------------------------------------------------
// DirectionalLight
// ------------------------------------------------------------------------
export type DirectionalLight<T extends TSelf> = Static<ReturnType<typeof DirectionalLight<T>>>
export function DirectionalLight<T extends TSelf>(Node: TSelf, options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('DirectionalLight'),
      color: Color(),
      intensity: Type.Number(),
      position: Math.Vector3(),
      target: Math.Vector3(),
      shadow: DirectionalLightShadow(Node),
      properties: NodeProperties(),
      transform: NodeTransform(),
      nodes: NodeArray(Node),
    },
    { ...options, $id: 'DirectionalLight' },
  )
}

// ------------------------------------------------------------------------
// HemisphereLight
// ------------------------------------------------------------------------

export type HemisphereLight<T extends TSelf> = Static<ReturnType<typeof HemisphereLight<T>>>
export function HemisphereLight<T extends TSelf>(Node: T, options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('HemisphereLight'),
      color: Color(),
      intensity: Type.Number(),
      position: Math.Vector3(),
      target: Math.Vector3(),
      shadow: DirectionalLightShadow(Node),
      properties: NodeProperties(),
      transform: NodeTransform(),
      nodes: NodeArray(Node),
    },
    { ...options, $id: 'HemisphereLight' },
  )
}

// ------------------------------------------------------------------------
// Light
// ------------------------------------------------------------------------

export type Light<T extends TSelf> = Static<ReturnType<typeof Light<T>>>
export function Light<T extends TSelf>(Node: T, options: T) {
  return Type.Union([AmbientLight(Node), AmbientLightProbe(Node), DirectionalLight(Node), LightShadow(Node)], {
    ...options,
    $id: 'Light',
  })
}
