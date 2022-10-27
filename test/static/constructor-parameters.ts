import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

const C = Type.Constructor(
  [Type.Number(), Type.String()],
  Type.Object({
    method: Type.Function([Type.Number(), Type.String()], Type.Boolean()),
  }),
)

const P = Type.ConstructorParameters(C)

Expect(P).ToInfer<[number, string]>()
