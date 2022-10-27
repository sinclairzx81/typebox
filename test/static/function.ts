import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

const C = Type.Function(
  [Type.Number(), Type.String()],
  Type.Object({
    method: Type.Function([Type.Number(), Type.String()], Type.Boolean()),
  }),
)

Expect(C).ToInfer<(param_0: number, param_1: string) => { method: (param_0: number, param_1: string) => boolean }>()
