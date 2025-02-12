import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

const T = Type.Object({
  x: Type.Argument(0),
  y: Type.Argument(1),
  z: Type.Argument(2),
})
const I = Type.Instantiate(T, [Type.Literal(1), Type.Literal(2), Type.Literal(3)])
// Infer as Broadest Type (Pending Generic Constraints)
Expect(T).ToStatic<{
  x: unknown
  y: unknown
  z: unknown
}>()
// Infer as Narrowed Type
Expect(I).ToStatic<{
  x: 1
  y: 2
  z: 3
}>()
