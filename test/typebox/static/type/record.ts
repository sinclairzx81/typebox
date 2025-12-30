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
    [x: `x${string}`]: number
    [x: `y${string}`]: number
    [x: `z${string}`]: number
  }>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ... with additional inference
{
  const T = Type.Record(Type.TemplateLiteral('A${string}'), Type.Number())
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    [x: `A${string}`]: number
  }>(true)
}
{
  const T = Type.Record(Type.TemplateLiteral('A${number}'), Type.Number())
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    [x: `A${number}`]: number
  }>(true)
}
{
  const T = Type.Record(Type.TemplateLiteral('A${integer}'), Type.Number())
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    [x: `A${number}`]: number
  }>(true)
}
{
  const T = Type.Record(Type.TemplateLiteral('A${boolean}'), Type.Number())
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    Afalse: number
    Atrue: number
  }>(true)
}
{
  const T = Type.Record(Type.TemplateLiteral('A${true}'), Type.Number())
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    Atrue: number
  }>(true)
}
{
  const T = Type.Record(Type.TemplateLiteral('A${false}'), Type.Number())
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    Afalse: number
  }>(true)
}
