import { type Static, Type } from 'typebox'
import { Assert } from 'test'

{
  const T = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  })
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, null>(false)
  Assert.IsExtendsMutual<T, {
    x: number
    y: number
    z: number
  }>(true)
}
{
  const T = Type.Object({
    x: Type.Readonly(Type.Number()),
    y: Type.Number(),
    z: Type.Number()
  })
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, null>(false)
  Assert.IsExtendsMutual<T, {
    readonly x: number
    y: number
    z: number
  }>(true)
}
{
  const T = Type.Object({
    x: Type.Readonly(Type.Number()),
    y: Type.Optional(Type.Number()),
    z: Type.Number()
  })
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, null>(false)
  Assert.IsExtendsMutual<T, {
    readonly x: number
    y?: number
    z: number
  }>(true)
}
// wrapped modifier (Readonly(Optional))
{
  const T = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Readonly(Type.Optional(Type.Number()))
  })
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, null>(false)
  Assert.IsExtendsMutual<T, {
    x: number
    y: number
    readonly z?: number
  }>(true)
}
// wrapped modifier (Optional(Readonly))
{
  const T = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Optional(Type.Readonly(Type.Number()))
  })
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, null>(false)
  Assert.IsExtendsMutual<T, {
    x: number
    y: number
    readonly z?: number
  }>(true)
}
