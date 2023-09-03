import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

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

  Expect(T).ToStatic<
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

  Expect(T).ToStatic<{ A?: string | undefined } & { B: string }>()
}

// https://github.com/sinclairzx81/typebox/issues/113
// https://github.com/sinclairzx81/typebox/issues/187
{
  const A = Type.Object({ A: Type.String() })
  const B = Type.Object({ B: Type.String() })
  const C = Type.Object({ C: Type.String() })
  const T = Type.Intersect([A, Type.Union([B, C])])
  type T = Static<typeof T>
  const _0: T = { A: '', B: '' }
  const _1: T = { A: '', C: '' }
  const _3: T = { A: '', B: '', C: '' }
  // invert equivelence (expect true both cases)
  type T1 = T extends { A: string } & ({ B: string } | { C: string }) ? true : false
  type T2 = { A: string } & ({ B: string } | { C: string }) extends T ? true : false
  Expect(T).ToStatic<{ A: string } & ({ B: string } | { C: string })>() // solved!
}
