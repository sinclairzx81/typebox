import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const T = Type.String({ $id: 'T' })
  const A = Type.Ref(T, { $id: 'A' })
  const B = Type.Ref(A, { $id: 'B' })
  const C = Type.Ref(B, { $id: 'C' })
  const U = Type.Deref(C)
  Expect(U).ToInfer<string>()
}
