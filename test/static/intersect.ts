import * as Spec from './spec'
import { Type, Static } from './typebox'

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
  Spec.expectType<
    {
      A: string
      B: string
    } & {
      X: number
      Y: number
    }
  >(Spec.infer(T))
}

// { // https://github.com/sinclairzx81/typebox/issues/113
//     const A = Type.Object({ A: Type.String() })
//     const B = Type.Object({ B: Type.String() })
//     const C = Type.Object({ C: Type.String() })
//     const T = Type.Intersect([A, Type.Union([B, C])])
//     type T = Static<typeof T>
//     const _0: T = { A: '', B: '' }
//     const _1: T = { A: '', C: '' }
//     const _3: T = { A: '', B: '', C: '' }
//     Spec.expectType<{ A: string } & ({ B: string, } | { C: string })>(Spec.infer(T))
// }
