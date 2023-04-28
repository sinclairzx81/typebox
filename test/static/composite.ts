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
// Overlapping All Optional (Deferred)
// Note for: https://github.com/sinclairzx81/typebox/issues/419
// Determining if a composite property is optional requires a deep check for all properties gathered during a indexed access
// call. Currently, there isn't a trivial way to perform this check without running into possibly infinite instantiation issues.
// The optional check is only specific to overlapping properties. Singular properties will continue to work as expected. The
// rule is "if all composite properties for a key are optional, then the composite property is optional". Defer this test and
// document as minor breaking change.
{
  // const A = Type.Object({
  //   A: Type.Optional(Type.Number()),
  // })
  // const B = Type.Object({
  //   A: Type.Optional(Type.Number()),
  // })
  // const T = Type.Composite([A, B])
  // Expect(T).ToInfer<{
  //   A: number | undefined
  // }>()
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
