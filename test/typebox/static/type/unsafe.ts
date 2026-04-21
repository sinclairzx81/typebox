import Type, { type Static } from 'typebox'
import { Assert } from 'test'

// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1314
// ------------------------------------------------------------------
{
  const T = Type.Object({
    x: Type.Optional(Type.Unsafe<12345>(Type.String())),
    y: Type.Optional(Type.String())
  })
  Assert.IsExtends<Static<typeof T>, {
    x?: 12345
    y?: string
  }>(true)
}
{
  const T = Type.Unsafe<Date>(Type.Refine({}, (value) => value instanceof Date))
  Assert.IsExtendsMutual<Static<typeof T>, Date>(true)
}
{
  const T = Type.Refine(Type.Unsafe<Date>({}), (value) => value instanceof Date)
  Assert.IsExtendsMutual<Static<typeof T>, Date>(true)
}
