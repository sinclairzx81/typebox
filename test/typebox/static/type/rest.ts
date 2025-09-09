import { type Static, Type } from 'typebox'
import { Assert } from 'test'

// rest is a special class of array
{
  const T = Type.Rest(Type.String())
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, string[]>(true)
  Assert.IsExtendsMutual<T, null>(false)
}

// ... but can be used to spread one tuple upon another
{
  const S: Type.TTuple<[Type.TLiteral<1>, Type.TRest<Type.TTuple<[Type.TLiteral<2>, Type.TLiteral<3>]>>]> = Type.Tuple([
    Type.Literal(1),
    Type.Rest(Type.Tuple([Type.Literal(2), Type.Literal(3)]))
  ])
  const T: Type.TTuple<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]> = Type.Instantiate({}, S)
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, [1, 2, 3]>(true)
  Assert.IsExtendsMutual<T, null>(false)
}

// ... but not arguments (rest on parameters needs to be fixed)
{
  const T = Type.Function([
    Type.Literal(1),
    Type.Rest(Type.Tuple([Type.Literal(2), Type.Literal(3)]))
  ], Type.Void())

  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, (args_0: 1, args_1: never) => void>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
