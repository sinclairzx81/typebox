import { type Static, Type } from 'typebox'
import { Assert } from 'test'

// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
{
  const T = Type.Immutable(Type.Array(Type.Number()))
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, readonly number[]>(true)
}
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
{
  const T = Type.Immutable(Type.Tuple([Type.Number(), Type.String()]))
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, readonly [number, string]>(true)
}
// ------------------------------------------------------------------
// Embedded 1: Immutable
// ------------------------------------------------------------------
{
  const T = Type.Object({
    x: Type.Immutable(Type.Tuple([Type.Number(), Type.String()]))
  })
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, {
    x: readonly [number, string]
  }>(true)
}
// ------------------------------------------------------------------
// Embedded 2: Readonly/Immutable
// ------------------------------------------------------------------
{
  const T = Type.Object({
    x: Type.Readonly(Type.Immutable(Type.Tuple([Type.Number(), Type.String()])))
  })
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, {
    readonly x: readonly [number, string]
  }>(true)
}
// ------------------------------------------------------------------
// Embedded 3: Immutable/Readonly
// ------------------------------------------------------------------
{
  const T = Type.Object({
    x: Type.Immutable(Type.Readonly(Type.Tuple([Type.Number(), Type.String()])))
  })
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, {
    readonly x: readonly [number, string]
  }>(true)
}
// ------------------------------------------------------------------
// Embedded 4: Readonly
// ------------------------------------------------------------------
{
  const T = Type.Object({
    x: Type.Readonly(Type.Tuple([Type.Number(), Type.String()]))
  })
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, {
    readonly x: [number, string]
  }>(true)
}
