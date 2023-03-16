import { TypeDef as Type, Static } from './typedef'
import { Value } from '@sinclair/typebox/value'

const A = Type.Object(
  {
    x: Type.Float32(),
    y: Type.Float32(),
    z: Type.Float32(),
  },
  { descriminator: 'T' },
)

const B = Type.Object(
  {
    x: Type.Float32(),
    y: Type.Float32(),
    z: Type.Float32(),
  },
  { descriminator: 'B' },
)

const U = Type.Union([A, B])
