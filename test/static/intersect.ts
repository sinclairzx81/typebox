import { Expect } from './assert'
import { Type, TOptional, TString } from '@sinclair/typebox'

{
  const A = Type.Object({
    A: Type.String(),
    B: Type.String(),
  })
  const B = Type.Object({
    X: Type.Number(),
    Y: Type.Number(),
  })
  const T = Type.Intersect([A, B])

  Expect(T).ToInfer<
    {
      A: string
      B: string
    } & {
      X: number
      Y: number
    }
  >()
}

{
  const A = Type.Object({
    A: Type.Optional(Type.String()),
  })
  const B = Type.Object({
    B: Type.String(),
  })
  const T = Type.Intersect([A, B])

  Expect(T.properties.A).ToBe<TOptional<TString>>()
  Expect(T.properties.B).ToBe<TString>()
}

// https://github.com/sinclairzx81/typebox/issues/113
// https://github.com/sinclairzx81/typebox/issues/187
// {
//     const A = Type.Object({ A: Type.String() })
//     const B = Type.Object({ B: Type.String() })
//     const C = Type.Object({ C: Type.String() })
//     const T = Type.Intersect([A, Type.Union([B, C])])
//     type T = Static<typeof T>
//     const _0: T = { A: '', B: '' }
//     const _1: T = { A: '', C: '' }
//     const _3: T = { A: '', B: '', C: '' }
//     Expect(T).ToBe<{ A: string } & ({ B: string, } | { C: string })>()
// }
