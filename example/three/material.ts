import { Type, Static, SchemaOptions } from '@sinclair/typebox'
import * as Math from './math'
import * as Enum from './enum'
import * as Texture from './texture'
import { Color } from './color'

export type MaterialParameters = Static<ReturnType<typeof MaterialProperties>>
export function MaterialProperties(options: SchemaOptions = {}) {
  return Type.Object(
    {
      alphaTest: Type.Number(),
      alphaToCoverage: Type.Boolean(),
      blendDst: Enum.BlendingDstFactor(),
      blendDstAlpha: Type.Number(),
      blendEquation: Enum.BlendingEquation(),
      blendEquationAlpha: Type.Number(),
      blending: Enum.Blending(),
      blendSrc: Enum.BlendingFactor(),
      blendSrcAlpha: Type.Number(),
      clipIntersection: Type.Boolean(),
      clippingPlanes: Type.Array(Math.Plane()),
      clipShadows: Type.Boolean(),
      colorWrite: Type.Boolean(),
      defines: Type.Any(),
      depthFunc: Enum.DepthModes(),
      depthTest: Type.Boolean(),
      depthWrite: Type.Boolean(),
      name: Type.String(),
      opacity: Type.Number(),
      polygonOffset: Type.Boolean(),
      polygonOffsetFactor: Type.Number(),
      polygonOffsetUnits: Type.Number(),
      precision: Enum.MaterialPrecision(),
      premultipliedAlpha: Type.Boolean(),
      dithering: Type.Boolean(),
      side: Enum.Side(),
      shadowSide: Enum.Side(),
      toneMapped: Type.Boolean(),
      transparent: Type.Boolean(),
      vertexColors: Type.Boolean(),
      visible: Type.Boolean(),
      format: Enum.PixelFormat(),
      stencilWrite: Type.Boolean(),
      stencilFunc: Enum.StencilFunc(),
      stencilRef: Type.Number(),
      stencilWriteMask: Type.Number(),
      stencilFuncMask: Type.Number(),
      stencilFail: Enum.StencilOp(),
      stencilZFail: Enum.StencilOp(),
      stencilZPass: Enum.StencilOp(),
      userData: Type.Any(),
    },
    { ...options, $id: 'MaterialParameters' },
  )
}

// ------------------------------------------------------------------------
// NoneMaterial
// ------------------------------------------------------------------------

export type NoneMaterial = Static<ReturnType<typeof NoneMaterial>>
export function NoneMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('None'),
    },
    { ...options, $id: 'NoneMaterial' },
  )
}

// ------------------------------------------------------------------------
// LineBasicMaterial
// ------------------------------------------------------------------------

export type LineBasicMaterial = Static<ReturnType<typeof LineBasicMaterial>>
export function LineBasicMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('LineBasicMaterial'),
      parameters: Type.Object({
        color: Color(),
        fog: Type.Boolean(),
        lineWidth: Type.Number(),
        lineCap: Type.String(),
        lineJoin: Type.String(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'LineBasicMaterial' },
  )
}

// ------------------------------------------------------------------------
// LineDashedMaterial
// ------------------------------------------------------------------------

export type LineDashedMaterial = Static<ReturnType<typeof LineDashedMaterial>>
export function LineDashedMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('LineDashedMaterial'),
      parameters: Type.Object({
        scale: Type.Number(),
        dashSize: Type.Number(),
        gapSize: Type.Number(),
        color: Color(),
        fog: Type.Boolean(),
        lineWidth: Type.Number(),
        lineCap: Type.String(),
        lineJoin: Type.String(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'LineDashedMaterial' },
  )
}

// ------------------------------------------------------------------------
// MeshBasicMaterial
// ------------------------------------------------------------------------

export type MeshBasicMaterial = Static<ReturnType<typeof MeshBasicMaterial>>
export function MeshBasicMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('MeshBasicMaterial'),
      parameters: Type.Object({
        color: Color(),
        opacity: Type.Number(),
        map: Texture.TextureAny(),
        lightMap: Texture.TextureAny(),
        lightMapIntensity: Type.Number(),
        aoMap: Texture.TextureAny(),
        aoMapIntensity: Type.Number(),
        specularMap: Texture.TextureAny(),
        alphaMap: Texture.TextureAny(),
        fog: Type.Boolean(),
        envMap: Texture.TextureAny(),
        combine: Enum.Combine(),
        reflectivity: Type.Number(),
        refractionRatio: Type.Number(),
        wireframe: Type.Boolean(),
        wireframeLinewidth: Type.Number(),
        wireframeLinecap: Type.String(),
        wireframeLinejoin: Type.String(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'MeshBasicMaterial' },
  )
}
// ------------------------------------------------------------------------
// MeshDepthMaterial
// ------------------------------------------------------------------------

export type MeshDepthMaterial = Static<ReturnType<typeof MeshDepthMaterial>>
export function MeshDepthMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('MeshDepthMaterial'),
      parameters: Type.Object({
        map: Texture.TextureAny(),
        alphaMap: Texture.TextureAny(),
        depthPacking: Enum.DepthPackingStrategies(),
        displacementMap: Texture.TextureAny(),
        displacementScale: Type.Number(),
        displacementBias: Type.Number(),
        wireframe: Type.Boolean(),
        wireframeLinewidth: Type.Number(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'MeshDepthMaterial' },
  )
}

// ------------------------------------------------------------------------
// MeshDistanceMaterial
// ------------------------------------------------------------------------

export type MeshDistanceMaterial = Static<ReturnType<typeof MeshDistanceMaterial>>
export function MeshDistanceMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('MeshDistanceMaterial'),
      parameters: Type.Object({
        map: Texture.TextureAny(),
        alphaMap: Texture.TextureAny(),
        displacementMap: Texture.TextureAny(),
        displacementScale: Type.Number(),
        displacementBias: Type.Number(),
        farDistance: Type.Number(),
        nearDistance: Type.Number(),
        referencePosition: Math.Vector3(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'MeshDistanceMaterial' },
  )
}

// ------------------------------------------------------------------------
// MeshLambertMaterial
// ------------------------------------------------------------------------

export type MeshLambertMaterial = Static<ReturnType<typeof MeshLambertMaterial>>
export function MeshLambertMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('MeshLambertMaterial'),
      parameters: Type.Object({
        bumpMap: Texture.TextureAny(),
        bumpScale: Type.Number(),
        color: Color(),
        displacementMap: Texture.TextureAny(),
        displacementScale: Type.Number(),
        displacementBias: Type.Number(),
        emissive: Color(),
        emissiveIntensity: Type.Number(),
        emissiveMap: Texture.TextureAny(),
        flatShading: Type.Boolean(),
        map: Texture.TextureAny(),
        lightMap: Texture.TextureAny(),
        lightMapIntensity: Type.Number(),
        normalMap: Texture.TextureAny(),
        normalScale: Math.Vector2(),
        aoMap: Texture.TextureAny(),
        aoMapIntensity: Type.Number(),
        specularMap: Texture.TextureAny(),
        alphaMap: Texture.TextureAny(),
        envMap: Texture.TextureAny(),
        combine: Enum.Combine(),
        reflectivity: Type.Number(),
        refractionRatio: Type.Number(),
        wireframe: Type.Boolean(),
        wireframeLinewidth: Type.Number(),
        wireframeLinecap: Type.String(),
        wireframeLinejoin: Type.String(),
        fog: Type.Boolean(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'MeshLambertMaterial' },
  )
}

// ------------------------------------------------------------------------
// MeshMatcapMaterial
// ------------------------------------------------------------------------

export type MeshMatcapMaterial = Static<ReturnType<typeof MeshMatcapMaterial>>
export function MeshMatcapMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('MeshMatcapMaterial'),
      parameters: Type.Object({
        matcap: Texture.TextureAny(),
        map: Texture.TextureAny(),
        bumpMap: Texture.TextureAny(),
        bumpScale: Type.Number(),
        normalMap: Texture.TextureAny(),
        normalMapType: Enum.NormalMapTypes(),
        normalScale: Math.Vector2(),
        displacementMap: Texture.TextureAny(),
        displacementScale: Type.Number(),
        displacementBias: Type.Number(),
        alphaMap: Texture.TextureAny(),
        fog: Type.Boolean(),
        flatShading: Type.Boolean(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'MeshMatcapMaterial' },
  )
}

// ------------------------------------------------------------------------
// MeshNormalMaterial
// ------------------------------------------------------------------------

export type MeshNormalMaterial = Static<ReturnType<typeof MeshNormalMaterial>>
export function MeshNormalMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('MeshNormalMaterial'),
      parameters: Type.Object({
        bumpMap: Texture.TextureAny(),
        bumpScale: Type.Number(),
        normalMap: Texture.TextureAny(),
        normalMapType: Enum.NormalMapTypes(),
        normalScale: Math.Vector2(),
        displacementMap: Texture.TextureAny(),
        displacementScale: Type.Number(),
        displacementBias: Type.Number(),
        wireframe: Type.Boolean(),
        wireframeLinewidth: Type.Number(),
        flatShading: Type.Boolean(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'MeshNormalMaterial' },
  )
}

// ------------------------------------------------------------------------
// MeshPhongMaterial
// ------------------------------------------------------------------------

export type MeshPhongMaterial = Static<ReturnType<typeof MeshPhongMaterial>>
export function MeshPhongMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('MeshPhongMaterial'),
      parameters: Type.Object({
        color: Color(),
        specular: Color(),
        shininess: Type.Number(),
        opacity: Type.Number(),
        map: Texture.TextureAny(),
        lightMap: Texture.TextureAny(),
        lightMapIntensity: Type.Number(),
        aoMap: Texture.TextureAny(),
        aoMapIntensity: Type.Number(),
        emissive: Color(),
        emissiveIntensity: Type.Number(),
        emissiveMap: Texture.TextureAny(),
        bumpMap: Texture.TextureAny(),
        bumpScale: Type.Number(),
        normalMap: Texture.TextureAny(),
        normalMapType: Enum.NormalMapTypes(),
        normalScale: Math.Vector2(),
        displacementMap: Texture.TextureAny(),
        displacementScale: Type.Number(),
        displacementBias: Type.Number(),
        specularMap: Texture.TextureAny(),
        alphaMap: Texture.TextureAny(),
        envMap: Texture.TextureAny(),
        combine: Enum.Combine(),
        reflectivity: Type.Number(),
        refractionRatio: Type.Number(),
        wireframe: Type.Boolean(),
        wireframeLinewidth: Type.Number(),
        wireframeLinecap: Type.String(),
        wireframeLinejoin: Type.String(),
        fog: Type.Boolean(),
        flatShading: Type.Boolean(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'MeshPhongMaterial' },
  )
}

// ------------------------------------------------------------------------
// MeshPhysicalMaterial
// ------------------------------------------------------------------------

export type MeshPhysicalMaterial = Static<ReturnType<typeof MeshPhysicalMaterial>>
export function MeshPhysicalMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('MeshPhysicalMaterial'),
      parameters: Type.Object({
        clearcoat: Type.Number(),
        clearcoatMap: Texture.TextureAny(),
        clearcoatRoughness: Type.Number(),
        clearcoatRoughnessMap: Texture.TextureAny(),
        clearcoatNormalScale: Math.Vector2(),
        clearcoatNormalMap: Texture.TextureAny(),
        reflectivity: Type.Number(),
        ior: Type.Number(),
        sheen: Type.Number(),
        sheenColor: Color(),
        sheenRoughness: Type.Number(),
        transmission: Type.Number(),
        transmissionMap: Texture.TextureAny(),
        attenuationDistance: Type.Number(),
        attenuationColor: Color(),
        specularIntensity: Type.Number(),
        specularColor: Color(),
        specularIntensityMap: Texture.TextureAny(),
        specularColorMap: Texture.TextureAny(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'MeshPhysicalMaterial' },
  )
}

// ------------------------------------------------------------------------
// MeshStandardMaterial
// ------------------------------------------------------------------------

export type MeshStandardMaterial = Static<ReturnType<typeof MeshStandardMaterial>>
export function MeshStandardMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('MeshStandardMaterial'),
      parameters: Type.Object({
        color: Color(),
        roughness: Type.Number(),
        metalness: Type.Number(),
        map: Texture.TextureAny(),
        lightMap: Texture.TextureAny(),
        lightMapIntensity: Type.Number(),
        aoMap: Texture.TextureAny(),
        aoMapIntensity: Type.Number(),
        emissive: Color(),
        emissiveIntensity: Type.Number(),
        emissiveMap: Texture.TextureAny(),
        bumpMap: Texture.TextureAny(),
        bumpScale: Type.Number(),
        normalMap: Texture.TextureAny(),
        normalMapType: Enum.NormalMapTypes(),
        normalScale: Math.Vector2(),
        displacementMap: Texture.TextureAny(),
        displacementScale: Type.Number(),
        displacementBias: Type.Number(),
        roughnessMap: Texture.TextureAny(),
        metalnessMap: Texture.TextureAny(),
        alphaMap: Texture.TextureAny(),
        envMap: Texture.TextureAny(),
        envMapIntensity: Type.Number(),
        wireframe: Type.Boolean(),
        wireframeLinewidth: Type.Number(),
        fog: Type.Boolean(),
        flatShading: Type.Boolean(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'MeshStandardMaterial' },
  )
}

// ------------------------------------------------------------------------
// MeshToonMaterial
// ------------------------------------------------------------------------

export type MeshToonMaterial = Static<ReturnType<typeof MeshToonMaterial>>
export function MeshToonMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('MeshToonMaterial'),
      parameters: Type.Object({
        color: Color(),
        opacity: Type.Number(),
        gradientMap: Texture.TextureAny(),
        map: Texture.TextureAny(),
        lightMap: Texture.TextureAny(),
        lightMapIntensity: Type.Number(),
        aoMap: Texture.TextureAny(),
        aoMapIntensity: Type.Number(),
        emissive: Color(),
        emissiveIntensity: Type.Number(),
        emissiveMap: Texture.TextureAny(),
        bumpMap: Texture.TextureAny(),
        bumpScale: Type.Number(),
        normalMap: Texture.TextureAny(),
        normalMapType: Enum.NormalMapTypes(),
        normalScale: Math.Vector2(),
        displacementMap: Texture.TextureAny(),
        displacementScale: Type.Number(),
        displacementBias: Type.Number(),
        alphaMap: Texture.TextureAny(),
        wireframe: Type.Boolean(),
        wireframeLinewidth: Type.Number(),
        wireframeLinecap: Type.String(),
        wireframeLinejoin: Type.String(),
        fog: Type.Boolean(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'MeshToonMaterial' },
  )
}

// ------------------------------------------------------------------------
// PointsMaterial
// ------------------------------------------------------------------------

export type PointsMaterial = Static<ReturnType<typeof PointsMaterial>>
export function PointsMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('PointsMaterial'),
      parameters: Type.Object({
        color: Color(),
        map: Texture.TextureAny(),
        alphaMap: Texture.TextureAny(),
        size: Type.Number(),
        sizeAttenuation: Type.Boolean(),
        fog: Type.Boolean(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'PointsMaterial' },
  )
}

// ------------------------------------------------------------------------
// ShaderMaterial
// ------------------------------------------------------------------------

export type UniformFloat = Static<ReturnType<typeof UniformFloat>>
export function UniformFloat(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('UniformFloat'),
      value: Type.Number(),
    },
    { ...options, $id: 'UniformFloat' },
  )
}

export type UniformMatrix4 = Static<ReturnType<typeof UniformMatrix4>>
export function UniformMatrix4(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('UniformVector4'),
      value: Math.Matrix4(),
    },
    { ...options, $id: 'UniformMatrix4' },
  )
}

export type UniformVector2 = Static<ReturnType<typeof UniformVector2>>
export function UniformVector2(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('UniformVector2'),
      value: Math.Vector2(),
    },
    { ...options, $id: 'UniformVector2' },
  )
}

export type UniformVector3 = Static<ReturnType<typeof UniformVector3>>
export function UniformVector3(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('UniformVector3'),
      value: Math.Vector3(),
    },
    { ...options, $id: 'UniformVector3' },
  )
}

export type UniformVector4 = Static<ReturnType<typeof UniformVector4>>
export function UniformVector4(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('UniformVector4'),
      value: Math.Vector4(),
    },
    { ...options, $id: 'UniformVector4' },
  )
}

export type Uniform = Static<ReturnType<typeof Uniform>>
export function Uniform(options: SchemaOptions = {}) {
  return Type.Union([UniformFloat(), UniformMatrix4(), UniformVector2(), UniformVector3(), UniformVector4()], {
    ...options,
    $id: 'Uniform',
  })
}

export type ShaderMaterialWithoutExtensions = Static<ReturnType<typeof ShaderMaterialWithoutExtensions>>
export function ShaderMaterialWithoutExtensions(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('WithoutExtensions'),
    },
    { ...options, $id: 'ShaderMaterialWithoutExtensions' },
  )
}

export type ShaderMaterialWithExtensions = Static<ReturnType<typeof ShaderMaterialWithExtensions>>
export function ShaderMaterialWithExtensions(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('Extensions'),
      derivatives: Type.Boolean(),
      fragDepth: Type.Boolean(),
      drawBuffers: Type.Boolean(),
      shaderTextureLOD: Type.Boolean(),
    },
    { ...options, $id: 'ShaderMaterialWithExtensions' },
  )
}

export type ShaderMaterialExtensions = Static<ReturnType<typeof ShaderMaterialExtensions>>
export function ShaderMaterialExtensions(options: SchemaOptions = {}) {
  return Type.Union([ShaderMaterialWithoutExtensions(), ShaderMaterialWithExtensions()], {
    ...options,
    $id: 'ShaderMaterialExtensions',
  })
}

export type ShaderMaterial = Static<ReturnType<typeof ShaderMaterial>>
export function ShaderMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('ShaderMaterial'),
      parameters: Type.Object({
        uniforms: Type.Record(Type.String(), Uniform()),
        vertexShader: Type.String(),
        fragmentShader: Type.String(),
        linewidth: Type.Number(),
        wireframe: Type.Boolean(),
        wireframeLinewidth: Type.Number(),
        lights: Type.Boolean(),
        clipping: Type.Boolean(),
        fog: Type.Boolean(),
        extensions: ShaderMaterialExtensions(),
        glslVersion: Enum.GLSLVersion(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'ShaderMaterial' },
  )
}

// ------------------------------------------------------------------------
// ShadowMaterial
// ------------------------------------------------------------------------

export type ShadowMaterial = Static<ReturnType<typeof ShadowMaterial>>
export function ShadowMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('ShadowMaterial'),
      parameters: Type.Object({
        color: Color(),
        fog: Type.Boolean(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'ShadowMaterial' },
  )
}

// ------------------------------------------------------------------------
// SpriteMaterial
// ------------------------------------------------------------------------

export type SpriteMaterial = Static<ReturnType<typeof SpriteMaterial>>
export function SpriteMaterial(options: SchemaOptions = {}) {
  return Type.Object(
    {
      type: Type.Literal('SpriteMaterial'),
      parameters: Type.Object({
        color: Color(),
        map: Texture.TextureAny(),
        alphaMap: Texture.TextureAny(),
        rotation: Type.Number(),
        sizeAttenuation: Type.Boolean(),
        fog: Type.Boolean(),
      }),
      properties: MaterialProperties(),
    },
    { ...options, $id: 'SpriteMaterial' },
  )
}

// ------------------------------------------------------------------------
// Material
// ------------------------------------------------------------------------

// prettier-ignore
export type Material = Static<ReturnType<typeof Material>>
export function Material(options: SchemaOptions = {}) {
  return Type.Union(
    [
      NoneMaterial(),
      LineBasicMaterial(),
      LineDashedMaterial(),
      MeshBasicMaterial(),
      MeshDepthMaterial(),
      MeshDistanceMaterial(),
      MeshLambertMaterial(),
      MeshMatcapMaterial(),
      MeshNormalMaterial(),
      MeshPhongMaterial(),
      MeshPhysicalMaterial(),
      MeshStandardMaterial(),
      MeshToonMaterial(),
      PointsMaterial(),
      ShaderMaterial(),
      ShadowMaterial(),
      SpriteMaterial(),
    ],
    { ...options, $id: 'Material' },
  )
}
