import { type Static, Type } from 'typebox'
import { Assert } from 'test'

{
  const T = Type.Record(Type.String(), Type.Number())
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    [x: string]: number
  }>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// finite keys map as objects
{
  const T = Type.Record(
    Type.Union([
      Type.Literal('x'),
      Type.Literal('y'),
      Type.Literal('z')
    ]),
    Type.Number()
  )
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    x: number
    y: number
    z: number
  }>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ... as do finite template literal keys
{
  const T = Type.Record(Type.TemplateLiteral("${'x' | 'y' | 'z'}"), Type.Number())
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    x: number
    y: number
    z: number
  }>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ... but not infinite template literals
{
  const T = Type.Record(Type.TemplateLiteral("${'x' | 'y' | 'z'}${string}"), Type.Number())
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    [x: string]: number
  }>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
