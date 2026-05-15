import { type Static, type TSchema, Type } from 'typebox'
import { Assert } from 'test'

// inline tuple inference
{
  const T = Type.Union([
    Type.Literal(1),
    Type.Literal(2),
    Type.Literal(3)
  ])
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 1 | 2 | 3>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// non-tuple TSchema[] should still resolve to a union (not never)
{
  const Schemas: TSchema[] = [
    Type.Literal(1),
    Type.Literal(2),
    Type.Literal(3)
  ]
  const T = Type.Union(Schemas)
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, unknown>(true)
  Assert.IsExtendsNever<T>(false)
}
// narrowed element type via Array<TLiteral<...>> should resolve to the literal union
{
  const Schemas: Array<ReturnType<typeof Type.Literal<1 | 2 | 3>>> = [
    Type.Literal(1 as const),
    Type.Literal(2 as const),
    Type.Literal(3 as const)
  ]
  const T = Type.Union(Schemas)
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 1 | 2 | 3>(true)
  Assert.IsExtendsNever<T>(false)
}
