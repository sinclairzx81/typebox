import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Array(Type.String())).ToInfer<string[]>()

Expect(
  Type.Array(
    Type.Object({
      x: Type.Number(),
      y: Type.Boolean(),
      z: Type.String(),
    }),
  ),
).ToInfer<
  {
    x: number
    y: boolean
    z: string
  }[]
>()

Expect(Type.Array(Type.Array(Type.String()))).ToInfer<string[][]>()

Expect(Type.Array(Type.Tuple([Type.String(), Type.Number()]))).ToInfer<[string, number][]>()
