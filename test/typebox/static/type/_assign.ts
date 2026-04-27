import { type Static, type TSchema, Type } from 'typebox'
import { Value } from 'typebox/value'

// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1548
// ------------------------------------------------------------------
{
  const FooOrBar = Type.Union([
    Type.Object({ foo: Type.String() }),
    Type.Object({ bar: Type.Number() })
  ])
  // @ts-expect-error
  const _bad: { bar: number } = Value.Decode(FooOrBar, { foo: 'hello' })
}
// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1548
// ------------------------------------------------------------------
{
  const T = Type.Union([Type.Literal(1), Type.Literal(2)])

  function testA<Type extends TSchema>(type: Type): Static<Type> {
    return 1 as never
  }

  const A_0: 1 | 2 = testA(T) // ok
  // @ts-expect-error
  const A_1: 1 = testA(T) // error: Type '2 | 1' is not assignable to type '1'.
  // @ts-expect-error
  const A_2: 2 = testA(T) // error: Type '2 | 1' is not assignable to type '2'.
  // @ts-expect-error
  const A_3: 3 = testA(T) // error: Type '2 | 1' is not assignable to type '3'.
}
