import { type Static, Type } from 'typebox'
import { Assert } from 'test'

// ------------------------------------------------------------------
// Retain Modifiers
//
// Ref: https://github.com/sinclairzx81/typebox/issues/1718
// ------------------------------------------------------------------
{
  const T = Type.Pick(
    Type.Intersect([
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Object({ a: Type.Number() }))),
        z: Type.Number()
      }),
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Object({ b: Type.Number() }))),
        z: Type.Number()
      })
    ]),
    Type.Literal('x')
  )
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    readonly x?: {
      a: number
      b: number
    }
  }>(true)
}
{
  const T = Type.Pick(
    Type.Intersect([
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Object({ a: Type.Number() }))),
        z: Type.Number()
      }),
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Object({ b: Type.Number() }))),
        z: Type.Number()
      })
    ]),
    Type.Literal('c')
  )
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, object>(true)
}
{
  const T = Type.Pick(
    Type.Intersect([
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Object({ a: Type.Number() }))),
        z: Type.Number()
      }),
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Object({ b: Type.Number() }))),
        z: Type.Number()
      })
    ]),
    Type.Never()
  )
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, object>(true)
}
{
  const T = Type.Pick(
    Type.Union([
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Number())),
        z: Type.Number()
      }),
      Type.Object({
        x: Type.String(),
        z: Type.Number()
      })
    ]),
    Type.Literal('x')
  )
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    readonly x?: number | string
  }>(true)
}
{
  const T = Type.Pick(
    Type.Union([
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Number())),
        z: Type.Number()
      }),
      Type.Object({
        x: Type.String(),
        z: Type.Number()
      })
    ]),
    Type.Literal('c')
  )
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, object>(true)
}
{
  const T = Type.Pick(
    Type.Union([
      Type.Object({
        x: Type.Readonly(Type.Optional(Type.Number())),
        z: Type.Number()
      }),
      Type.Object({
        x: Type.String(),
        z: Type.Number()
      })
    ]),
    Type.Never()
  )
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, object>(true)
}
