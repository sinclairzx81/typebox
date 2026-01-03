import Type, { type Static } from 'typebox'
import { Assert } from 'test'

// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1314
// ------------------------------------------------------------------
const T = Type.Object({
  x: Type.Optional(Type.Unsafe({} as 12345, Type.String())),
  y: Type.Optional(Type.String())
})
Assert.IsExtends<Static<typeof T>, {
  x?: 12345
  y?: string
}>(true)
