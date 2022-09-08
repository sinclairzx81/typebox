import { Type, Static, SchemaOptions } from '@sinclair/typebox'

export type GLSLVersion = Static<ReturnType<typeof GLSLVersion>>
export function GLSLVersion(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('GLSL1'), Type.Literal('GLSL3')], {
    ...options,
    $id: 'GLSLVersion',
  })
}

export type CullFace = Static<ReturnType<typeof CullFace>>
export function CullFace(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('CullFaceNone'), Type.Literal('CullFaceBack'), Type.Literal('CullFaceFront'), Type.Literal('CullFaceFrontBack')], { ...options, $id: 'CullFace' })
}

export type ShadowMapType = Static<ReturnType<typeof ShadowMapType>>
export function ShadowMapType(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('BasicShadowMap'), Type.Literal('PCFShadowMap'), Type.Literal('PCFSoftShadowMap'), Type.Literal('VSMShadowMap')], {
    ...options,
    $id: 'ShadowMapType',
  })
}

export type PixelFormatGPU = Static<ReturnType<typeof PixelFormatGPU>>
export function PixelFormatGPU(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('ALPHA'),
      Type.Literal('RGB'),
      Type.Literal('RGBA'),
      Type.Literal('LUMINANCE'),
      Type.Literal('LUMINANCE_ALPHA'),
      Type.Literal('RED_INTEGER'),
      Type.Literal('R8'),
      Type.Literal('R8_SNORM'),
      Type.Literal('R8I'),
      Type.Literal('R8UI'),
      Type.Literal('R16I'),
      Type.Literal('R16UI'),
      Type.Literal('R16F'),
      Type.Literal('R32I'),
      Type.Literal('R32UI'),
      Type.Literal('R32F'),
      Type.Literal('RG8'),
      Type.Literal('RG8_SNORM'),
      Type.Literal('RG8I'),
      Type.Literal('RG8UI'),
      Type.Literal('RG16I'),
      Type.Literal('RG16UI'),
      Type.Literal('RG16F'),
      Type.Literal('RG32I'),
      Type.Literal('RG32UI'),
      Type.Literal('RG32F'),
      Type.Literal('RGB565'),
      Type.Literal('RGB8'),
      Type.Literal('RGB8_SNORM'),
      Type.Literal('RGB8I'),
      Type.Literal('RGB8UI'),
      Type.Literal('RGB16I'),
      Type.Literal('RGB16UI'),
      Type.Literal('RGB16F'),
      Type.Literal('RGB32I'),
      Type.Literal('RGB32UI'),
      Type.Literal('RGB32F'),
      Type.Literal('RGB9_E5'),
      Type.Literal('SRGB8'),
      Type.Literal('R11F_G11F_B10F'),
      Type.Literal('RGBA4'),
      Type.Literal('RGBA8'),
      Type.Literal('RGBA8_SNORM'),
      Type.Literal('RGBA8I'),
      Type.Literal('RGBA8UI'),
      Type.Literal('RGBA16I'),
      Type.Literal('RGBA16UI'),
      Type.Literal('RGBA16F'),
      Type.Literal('RGBA32I'),
      Type.Literal('RGBA32UI'),
      Type.Literal('RGBA32F'),
      Type.Literal('RGB5_A1'),
      Type.Literal('RGB10_A2'),
      Type.Literal('RGB10_A2UI'),
      Type.Literal('SRGB8_ALPHA8'),
      Type.Literal('SRGB8'),
      Type.Literal('DEPTH_COMPONENT16'),
      Type.Literal('DEPTH_COMPONENT24'),
      Type.Literal('DEPTH_COMPONENT32F'),
      Type.Literal('DEPTH24_STENCIL8'),
      Type.Literal('DEPTH32F_STENCIL8'),
    ],
    { ...options, $id: 'PixelFormatGPU' },
  )
}

export type CompressedPixelFormat = Static<ReturnType<typeof CompressedPixelFormat>>
export function CompressedPixelFormat(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('RGB_S3TC_DXT1_Format'),
      Type.Literal('RGBA_S3TC_DXT1_Format'),
      Type.Literal('RGBA_S3TC_DXT3_Format'),
      Type.Literal('RGBA_S3TC_DXT5_Format'),
      Type.Literal('RGB_PVRTC_4BPPV1_Format'),
      Type.Literal('RGB_PVRTC_2BPPV1_Format'),
      Type.Literal('RGBA_PVRTC_4BPPV1_Format'),
      Type.Literal('RGBA_PVRTC_2BPPV1_Format'),
      Type.Literal('RGB_ETC1_Format'),
      Type.Literal('RGB_ETC2_Format'),
      Type.Literal('RGBA_ETC2_EAC_Format'),
      Type.Literal('RGBA_ASTC_4x4_Format'),
      Type.Literal('RGBA_ASTC_5x4_Format'),
      Type.Literal('RGBA_ASTC_5x5_Format'),
      Type.Literal('RGBA_ASTC_6x5_Format'),
      Type.Literal('RGBA_ASTC_6x6_Format'),
      Type.Literal('RGBA_ASTC_8x5_Format'),
      Type.Literal('RGBA_ASTC_8x6_Format'),
      Type.Literal('RGBA_ASTC_8x8_Format'),
      Type.Literal('RGBA_ASTC_10x5_Format'),
      Type.Literal('RGBA_ASTC_10x6_Format'),
      Type.Literal('RGBA_ASTC_10x8_Format'),
      Type.Literal('RGBA_ASTC_10x10_Format'),
      Type.Literal('RGBA_ASTC_12x10_Format'),
      Type.Literal('RGBA_ASTC_12x12_Format'),
      Type.Literal('RGBA_BPTC_Format'),
    ],
    { ...options, $id: 'CompressedPixelFormat' },
  )
}

export type PixelFormat = Static<ReturnType<typeof PixelFormat>>
export function PixelFormat(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('AlphaFormat'),
      Type.Literal('RGBFormat'),
      Type.Literal('RGBAFormat'),
      Type.Literal('LuminanceFormat'),
      Type.Literal('LuminanceAlphaFormat'),
      Type.Literal('DepthFormat'),
      Type.Literal('DepthStencilFormat'),
      Type.Literal('RedFormat'),
      Type.Literal('RedIntegerFormat'),
      Type.Literal('RGFormat'),
      Type.Literal('RGIntegerFormat'),
      Type.Literal('RGBAIntegerFormat'),
      Type.Literal('_SRGBFormat'),
      Type.Literal('_SRGBAFormat'),
    ],
    { ...options, $id: 'PixelFormat' },
  )
}

export type AnimationActionLoopStyles = Static<ReturnType<typeof AnimationActionLoopStyles>>
export function AnimationActionLoopStyles(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('LoopOnce'), Type.Literal('LoopRepeat'), Type.Literal('LoopPingPong')], {
    ...options,
    $id: 'AnimationActionLoopStyles',
  })
}

export type InterpolationModes = Static<ReturnType<typeof InterpolationModes>>
export function InterpolationModes(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('InterpolateDiscrete'), Type.Literal('InterpolateLinear'), Type.Literal('InterpolateSmooth')], {
    ...options,
    $id: 'InterpolationModes',
  })
}

export type InterpolationEndingModes = Static<ReturnType<typeof InterpolationEndingModes>>
export function InterpolationEndingModes(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('ZeroCurvatureEnding'), Type.Literal('ZeroSlopeEnding'), Type.Literal('WrapAroundEnding')], {
    ...options,
    $id: 'InterpolationEndingModes',
  })
}

export type AnimationBlendMode = Static<ReturnType<typeof AnimationBlendMode>>
export function AnimationBlendMode(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('NormalAnimationBlendMode'), Type.Literal('AdditiveAnimationBlendMode')], {
    ...options,
    $id: 'AnimationBlendMode',
  })
}

export type Blending = Static<ReturnType<typeof Blending>>
export function Blending(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('NoBlending'),
      Type.Literal('NormalBlending'),
      Type.Literal('AdditiveBlending'),
      Type.Literal('SubtractiveBlending'),
      Type.Literal('MultiplyBlending'),
      Type.Literal('CustomBlending'),
    ],
    {
      ...options,
      $id: 'Blending',
    },
  )
}

export type BlendingEquation = Static<ReturnType<typeof BlendingEquation>>
export function BlendingEquation(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('AddEquation'),
      Type.Literal('SubtractEquation'),
      Type.Literal('ReverseSubtractEquation'),
      Type.Literal('MinEquation'),
      Type.Literal('MaxEquation'),
      Type.Literal('SubtractEquation'),
    ],
    {
      ...options,
      $id: 'BlendingEquation',
    },
  )
}

export type ColorSpace = Static<ReturnType<typeof ColorSpace>>
export function ColorSpace(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('NoColorSpace'), Type.Literal('SRGBColorSpace'), Type.Literal('LinearSRGBColorSpace')], {
    ...options,
    $id: 'ColorSpace',
  })
}

export type Combine = Static<ReturnType<typeof Combine>>
export function Combine(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('MultiplyOperation'), Type.Literal('MixOperation'), Type.Literal('AddOperation')], {
    ...options,
    $id: 'Combine',
  })
}

export type DepthPackingStrategies = Static<ReturnType<typeof DepthPackingStrategies>>
export function DepthPackingStrategies(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('BasicDepthPacking'), Type.Literal('RGBADepthPacking')], {
    ...options,
    $id: 'DepthPackingStrategies',
  })
}

export type StencilFunc = Static<ReturnType<typeof StencilFunc>>
export function StencilFunc(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('NeverStencilFunc'),
      Type.Literal('LessStencilFunc'),
      Type.Literal('EqualStencilFunc'),
      Type.Literal('LessEqualStencilFunc'),
      Type.Literal('GreaterStencilFunc'),
      Type.Literal('NotEqualStencilFunc'),
      Type.Literal('GreaterEqualStencilFunc'),
      Type.Literal('AlwaysStencilFunc'),
    ],
    { ...options, $id: 'StencilFunc' },
  )
}

export type StencilOp = Static<ReturnType<typeof StencilOp>>
export function StencilOp(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('ZeroStencilOp'),
      Type.Literal('KeepStencilOp'),
      Type.Literal('ReplaceStencilOp'),
      Type.Literal('IncrementStencilOp'),
      Type.Literal('DecrementStencilOp'),
      Type.Literal('IncrementWrapStencilOp'),
      Type.Literal('DecrementWrapStencilOp'),
      Type.Literal('InvertStencilOp'),
    ],
    { ...options, $id: 'StencilOp' },
  )
}

export type BlendingSrcFactor = Static<ReturnType<typeof BlendingSrcFactor>>
export function BlendingSrcFactor(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('SrcAlphaSaturateFactor')], {
    ...options,
    $id: 'BlendingSrcFactor',
  })
}

export type BlendingDstFactor = Static<ReturnType<typeof BlendingDstFactor>>
export function BlendingDstFactor(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('ZeroFactor'),
      Type.Literal('OneFactor'),
      Type.Literal('SrcColorFactor'),
      Type.Literal('OneMinusSrcColorFactor'),
      Type.Literal('SrcAlphaFactor'),
      Type.Literal('OneMinusSrcAlphaFactor'),
      Type.Literal('DstAlphaFactor'),
      Type.Literal('OneMinusDstAlphaFactor'),
      Type.Literal('DstColorFactor'),
      Type.Literal('OneMinusDstColorFactor'),
    ],
    { ...options, $id: 'BlendingDstFactor' },
  )
}

export type NormalMapTypes = Static<ReturnType<typeof NormalMapTypes>>
export function NormalMapTypes(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('TangentSpaceNormalMap'), Type.Literal('ObjectSpaceNormalMap')], {
    ...options,
    $id: 'NormalMapTypes',
  })
}

export type BlendingFactor = Static<ReturnType<typeof BlendingFactor>>
export function BlendingFactor(options: SchemaOptions = {}) {
  return Type.Union([...BlendingDstFactor().anyOf, ...BlendingDstFactor().anyOf], {
    ...options,
    $id: 'BlendingFactor',
  })
}

export type DepthModes = Static<ReturnType<typeof DepthModes>>
export function DepthModes(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('NeverDepth'),
      Type.Literal('LessDepth'),
      Type.Literal('LessEqualDepth'),
      Type.Literal('EqualDepth'),
      Type.Literal('GreaterEqualDepth'),
      Type.Literal('GreaterDepth'),
      Type.Literal('NotEqualDepth'),
    ],
    {
      ...options,
      $id: 'DepthModes',
    },
  )
}

export type MaterialPrecision = Static<ReturnType<typeof MaterialPrecision>>
export function MaterialPrecision(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('highp'), Type.Literal('mediump'), Type.Literal('lowp')], {
    ...options,
    $id: 'MaterialPrecision',
  })
}

export type Side = Static<ReturnType<typeof Side>>
export function Side(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('FrontSize'), Type.Literal('BackSide'), Type.Literal('DoubleSide')], {
    ...options,
    $id: 'Side',
  })
}

export type ToneMapping = Static<ReturnType<typeof ToneMapping>>
export function ToneMapping(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('NoToneMapping'),
      Type.Literal('LinearToneMapping'),
      Type.Literal('ReinhardToneMapping'),
      Type.Literal('CineonToneMapping'),
      Type.Literal('ACESFilmicToneMapping'),
      Type.Literal('CustomToneMapping'),
    ],
    { ...options, $id: 'ToneMapping' },
  )
}

export type Mapping = Static<ReturnType<typeof Mapping>>
export function Mapping(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('UVMapping'),
      Type.Literal('CubeReflectionMapping'),
      Type.Literal('CubeRefractionMapping'),
      Type.Literal('EquirectangularReflectionMapping'),
      Type.Literal('EquirectangularRefractionMapping'),
      Type.Literal('CubeUVReflectionMapping'),
    ],
    { ...options, $id: 'Mapping' },
  )
}

export type Wrapping = Static<ReturnType<typeof Wrapping>>
export function Wrapping(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('RepeatWrapping'), Type.Literal('ClampToEdgeWrapping'), Type.Literal('MirroredRepeatWrapping')], { ...options, $id: 'Wrapping' })
}

export type TextureFilter = Static<ReturnType<typeof TextureFilter>>
export function TextureFilter(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('NearestFilter'),
      Type.Literal('NearestMipmapNearestFilter'),
      Type.Literal('NearestMipmapLinearFilter'),
      Type.Literal('LinearFilter'),
      Type.Literal('LinearMipmapNearestFilter'),
      Type.Literal('LinearMipmapLinearFilter'),
    ],
    { ...options, $id: 'TextureFilter' },
  )
}

export type TextureDataType = Static<ReturnType<typeof TextureDataType>>
export function TextureDataType(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('UnsignedByteType'),
      Type.Literal('ByteType'),
      Type.Literal('ShortType'),
      Type.Literal('UnsignedShortType'),
      Type.Literal('IntType'),
      Type.Literal('UnsignedIntType'),
      Type.Literal('FloatType'),
      Type.Literal('HalfFloatType'),
      Type.Literal('UnsignedShort4444Type'),
      Type.Literal('UnsignedShort5551Type'),
      Type.Literal('UnsignedInt248Type'),
    ],
    { ...options, $id: 'TextureDataType' },
  )
}

export type TextureEncoding = Static<ReturnType<typeof TextureEncoding>>
export function TextureEncoding(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('LinearEncoding'), Type.Literal('sRGBEncoding')], { ...options, $id: 'TextureEncoding' })
}

export type TrianglesDrawModes = Static<ReturnType<typeof TrianglesDrawModes>>
export function TrianglesDrawModes(options: SchemaOptions = {}) {
  return Type.Union([Type.Literal('TrianglesDrawMode'), Type.Literal('TriangleStripDrawMode'), Type.Literal('TriangleFanDrawMode')], { ...options, $id: 'TrianglesDrawModes' })
}

export type Usage = Static<ReturnType<typeof Usage>>
export function Usage(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('StaticDrawUsage'),
      Type.Literal('DynamicDrawUsage'),
      Type.Literal('StreamDrawUsage'),
      Type.Literal('StaticReadUsage'),
      Type.Literal('DynamicReadUsage'),
      Type.Literal('StreamReadUsage'),
      Type.Literal('StaticCopyUsage'),
      Type.Literal('DynamicCopyUsage'),
      Type.Literal('StreamCopyUsage'),
    ],
    { ...options, $id: 'Usage' },
  )
}

export type BuiltinShaderAttributeName = Static<ReturnType<typeof BuiltinShaderAttributeName>>
export function BuiltinShaderAttributeName(options: SchemaOptions = {}) {
  return Type.Union(
    [
      Type.Literal('position'),
      Type.Literal('normal'),
      Type.Literal('uv'),
      Type.Literal('color'),
      Type.Literal('skinIndex'),
      Type.Literal('skinWeight'),
      Type.Literal('instanceMatrix'),
      Type.Literal('morphTarget0'),
      Type.Literal('morphTarget1'),
      Type.Literal('morphTarget2'),
      Type.Literal('morphTarget3'),
      Type.Literal('morphTarget4'),
      Type.Literal('morphTarget5'),
      Type.Literal('morphTarget6'),
      Type.Literal('morphTarget7'),
      Type.Literal('morphNormal0'),
      Type.Literal('morphNormal1'),
      Type.Literal('morphNormal2'),
      Type.Literal('morphNormal3'),
    ],
    { ...options, $id: 'BuiltinShaderAttributeName' },
  )
}
