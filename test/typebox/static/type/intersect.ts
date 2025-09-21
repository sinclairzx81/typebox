import { type Static, Type } from 'typebox'
import { Assert } from 'test'

{
  const T = Type.Intersect([])
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, unknown>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
{
  const T = Type.Intersect([
    Type.String()
  ])
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, string>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
{
  const T = Type.Intersect([
    Type.String(),
    Type.Literal('hello')
  ])
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 'hello'>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
{
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, { x: number } & { y: number }>(true)
  Assert.IsExtendsMutual<T, { x: number } & { y: number }>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// overlap
{
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Number() })
  ])
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, { x: number } & { x: number }>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// narrow sub property 1
{
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Literal(1) })
  ])
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, { x: number; } & { x: 1; }>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// narrow sub property 2 (order)
{
  const T = Type.Intersect([
    Type.Object({ x: Type.Literal(1) }),
    Type.Object({ x: Type.Number() })
  ])
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, { x: 1; } & { x: number; }>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
