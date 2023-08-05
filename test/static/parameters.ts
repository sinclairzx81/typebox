import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

const C = Type.Function(
  [Type.Number(), Type.String()],
  Type.Object({
    method: Type.Function([Type.Number(), Type.String()], Type.Boolean()),
  }),
)

const P = Type.Parameters(C)

Expect(P).ToStatic<[number, string]>()
