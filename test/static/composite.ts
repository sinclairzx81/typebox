import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

// Overlapping - Non Varying
{
  const A = Type.Object({
    A: Type.Number(),
  })
  const B = Type.Object({
    A: Type.Number(),
  })
  const T = Type.Composite([A, B])

  Expect(T).ToInfer<{
    A: number
  }>()
}
// Overlapping - Varying
{
  const A = Type.Object({
    A: Type.Number(),
  })
  const B = Type.Object({
    A: Type.String(),
  })
  const T = Type.Composite([A, B])

  Expect(T).ToInfer<{
    A: never
  }>()
}
// Overlapping Single Optional
{
  const A = Type.Object({
    A: Type.Optional(Type.Number()),
  })
  const B = Type.Object({
    A: Type.Number(),
  })
  const T = Type.Composite([A, B])

  Expect(T).ToInfer<{
    A: number
  }>()
}
// Overlapping All Optional
{
  const A = Type.Object({
    A: Type.Optional(Type.Number()),
  })
  const B = Type.Object({
    A: Type.Optional(Type.Number()),
  })
  const T = Type.Composite([A, B])

  Expect(T).ToInfer<{
    A: number | undefined
  }>()
}
// Distinct Properties
{
  const A = Type.Object({
    A: Type.Number(),
  })
  const B = Type.Object({
    B: Type.Number(),
  })
  const T = Type.Composite([A, B])

  Expect(T).ToInfer<{
    A: number
    B: number
  }>()
}
