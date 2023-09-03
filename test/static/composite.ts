import { Expect } from './assert'
import { Type, TObject, TIntersect, TNumber, TBoolean } from '@sinclair/typebox'

// ----------------------------------------------------------------------------
// Overlapping - Non Varying
// ----------------------------------------------------------------------------
{
  const A = Type.Object({
    A: Type.Number(),
  })
  const B = Type.Object({
    A: Type.Number(),
  })
  const T = Type.Composite([A, B])

  Expect(T).ToStatic<{
    A: number
  }>()
}
// ----------------------------------------------------------------------------
// Overlapping - Varying
// ----------------------------------------------------------------------------
{
  const A = Type.Object({
    A: Type.Number(),
  })
  const B = Type.Object({
    A: Type.String(),
  })
  const T = Type.Composite([A, B])

  Expect(T).ToStatic<{
    A: never
  }>()
}
// ----------------------------------------------------------------------------
// Overlapping Single Optional
// ----------------------------------------------------------------------------
{
  const A = Type.Object({
    A: Type.Optional(Type.Number()),
  })
  const B = Type.Object({
    A: Type.Number(),
  })
  const T = Type.Composite([A, B])

  Expect(T).ToStatic<{
    A: number
  }>()
}
// ----------------------------------------------------------------------------
// Overlapping All Optional (Deferred)
//
// Note for: https://github.com/sinclairzx81/typebox/issues/419
// ----------------------------------------------------------------------------
{
  const A = Type.Object({
    A: Type.Optional(Type.Number()),
  })
  const B = Type.Object({
    A: Type.Optional(Type.Number()),
  })
  const T = Type.Composite([A, B])
  Expect(T).ToStatic<{
    A?: number | undefined
  }>()
}
{
  const A = Type.Object({
    A: Type.Optional(Type.Number()),
  })
  const B = Type.Object({
    A: Type.Number(),
  })
  const T = Type.Composite([A, B])
  Expect(T).ToStatic<{
    A: number
  }>()
}
{
  const A = Type.Object({
    A: Type.Number(),
  })
  const B = Type.Object({
    A: Type.Number(),
  })
  const T = Type.Composite([A, B])
  Expect(T).ToStatic<{
    A: number
  }>()
}
// ----------------------------------------------------------------------------
// Distinct Properties
// ----------------------------------------------------------------------------
{
  const A = Type.Object({
    A: Type.Number(),
  })
  const B = Type.Object({
    B: Type.Number(),
  })
  const T = Type.Composite([A, B])

  Expect(T).ToStatic<{
    A: number
    B: number
  }>()
}
// ----------------------------------------------------------------------------
// Intersection Quirk
//
// TypeScript has an evaluation quirk for the following case where the first
// type evaluates the sub property as never, but the second evaluates the
// entire type as never. There is probably a reason for this behavior, but
// TypeBox supports the former evaluation.
//
// { x: number } & { x: string }  -> { x: number } & { x: string } => { x: never }
// { x: number } & { x: boolean } ->  never -> ...
// ----------------------------------------------------------------------------
{
  // prettier-ignore
  const T: TObject<{
    x: TIntersect<[TNumber, TBoolean]>
  }> = Type.Composite([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Boolean() })
  ])
}
