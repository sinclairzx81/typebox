import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const T = Type.Object({
    x: Type.Number(),
    y: Type.String(),
  })
  const R = Type.Index(T, ['x', 'y'])
  type O = Static<typeof R>
  Expect(R).ToStatic<number | string>()
}
{
  const T = Type.Tuple([Type.Number(), Type.String(), Type.Boolean()])
  const R = Type.Index(T, Type.Union([Type.Literal('0'), Type.Literal('1')]))
  type O = Static<typeof R>
  Expect(R).ToStatic<number | string>()
}
{
  const T = Type.Tuple([Type.Number(), Type.String(), Type.Boolean()])
  const R = Type.Index(T, Type.Union([Type.Literal(0), Type.Literal(1)]))
  type O = Static<typeof R>
  Expect(R).ToStatic<number | string>()
}
{
  const T = Type.Object({
    ab: Type.Number(),
    ac: Type.String(),
  })

  const R = Type.Index(T, Type.TemplateLiteral([Type.Literal('a'), Type.Union([Type.Literal('b'), Type.Literal('c')])]))
  type O = Static<typeof R>
  Expect(R).ToStatic<number | string>()
}
{
  const A = Type.Tuple([Type.String(), Type.Boolean()])
  const R = Type.Index(A, Type.Number())
  type O = Static<typeof R>
  Expect(R).ToStatic<string | boolean>()
}
{
  const A = Type.Tuple([Type.String()])
  const R = Type.Index(A, Type.Number())
  type O = Static<typeof R>
  Expect(R).ToStatic<string>()
}
{
  const A = Type.Tuple([])
  const R = Type.Index(A, Type.Number())
  type O = Static<typeof R>
  Expect(R).ToStaticNever()
}
{
  const A = Type.Object({})
  const R = Type.Index(A, Type.BigInt()) // Support Overload
  type O = Static<typeof R>
  Expect(R).ToStatic<unknown>()
}
{
  const A = Type.Array(Type.Number())
  const R = Type.Index(A, Type.BigInt()) // Support Overload
  type O = Static<typeof R>
  Expect(R).ToStatic<unknown>()
}
// ------------------------------------------------------------------
// Intersections
// ------------------------------------------------------------------
{
  type A = { x: string; y: 1 }
  type B = { x: string; y: number }
  type C = A & B
  type R = C['y']

  const A = Type.Object({ x: Type.String(), y: Type.Literal(1) })
  const B = Type.Object({ x: Type.String(), y: Type.Number() })
  const C = Type.Intersect([A, B])
  const R = Type.Index(C, ['y'])
  type O = Static<typeof R>
  Expect(R).ToStatic<1>()
}
{
  type A = { x: string; y: 1 }
  type B = { x: string; y: number }
  type C = A & B
  type R = C['x']

  const A = Type.Object({ x: Type.String(), y: Type.Literal(1) })
  const B = Type.Object({ x: Type.String(), y: Type.Number() })
  const C = Type.Intersect([A, B])
  const R = Type.Index(C, ['x'])
  type O = Static<typeof R>
  Expect(R).ToStatic<string>()
}
{
  type A = { x: string; y: 1 }
  type B = { x: string; y: number }
  type C = A & B
  type R = C['x' | 'y']

  const A = Type.Object({ x: Type.String(), y: Type.Literal(1) })
  const B = Type.Object({ x: Type.String(), y: Type.Number() })
  const C = Type.Intersect([A, B])
  const R = Type.Index(C, ['x', 'y'])
  type O = Static<typeof R>
  Expect(R).ToStatic<string | 1>()
}
{
  type A = { x: string; y: number }
  type B = { x: number; y: number }
  type C = A & B
  type R = C['x']

  const A = Type.Object({ x: Type.String(), y: Type.Number() })
  const B = Type.Object({ x: Type.Number(), y: Type.Number() })
  const C = Type.Intersect([A, B])
  const R = Type.Index(C, ['x'])
  type O = Static<typeof R>
  Expect(R).ToStaticNever()
}
{
  type A = { x: string; y: number }
  type B = { x: number; y: number }
  type C = A & B
  type R = C['y']

  const A = Type.Object({ x: Type.String(), y: Type.Number() })
  const B = Type.Object({ x: Type.Number(), y: Type.Number() })
  const C = Type.Intersect([A, B])
  const R = Type.Index(C, ['y'])
  type O = Static<typeof R>
  Expect(R).ToStatic<number>()
}
{
  type A = { x: string; y: number }
  type B = { x: number; y: number }
  type C = A & B
  type R = C['x' | 'y']

  const A = Type.Object({ x: Type.String(), y: Type.Number() })
  const B = Type.Object({ x: Type.Number(), y: Type.Number() })
  const C = Type.Intersect([A, B])
  const R = Type.Index(C, ['x', 'y'])
  type O = Static<typeof R>
  Expect(R).ToStatic<number>()
}
{
  type A = { x: string; y: 1 }
  type B = { x: string; y: number }
  type C = { x: string; y: number }
  type D = { x: string }
  type I = (A & B) & (C & D)
  type R = I['x' | 'y']

  const A = Type.Object({ x: Type.String(), y: Type.Literal(1) })
  const B = Type.Object({ x: Type.String(), y: Type.Number() })
  const C = Type.Object({ x: Type.String(), y: Type.Number() })
  const D = Type.Object({ x: Type.String() })
  const I = Type.Intersect([Type.Intersect([A, B]), Type.Intersect([C, D])])
  const R = Type.Index(I, ['x', 'y'])
  type O = Static<typeof R>
  Expect(R).ToStatic<string | 1>()
}
{
  type A = { x: string; y: 1 }
  type B = { x: number; y: number }
  type C = { x: string; y: number }
  type D = { x: string }
  type I = (A & B) & (C & D)
  type R = I['x' | 'y']

  const A = Type.Object({ x: Type.String(), y: Type.Literal(1) })
  const B = Type.Object({ x: Type.Number(), y: Type.Number() })
  const C = Type.Object({ x: Type.String(), y: Type.Number() })
  const D = Type.Object({ x: Type.String() })
  const I = Type.Intersect([Type.Intersect([A, B]), Type.Intersect([C, D])])
  const R = Type.Index(I, ['x', 'y'])
  type O = Static<typeof R>
  Expect(R).ToStatic<1>()
}
{
  type A = { x: string; y: 1 }
  type B = { x: number; y: number }
  type C = { x: string; y: number }
  type D = { x: string }
  type I = (A | B) & (C & D)
  type R = I['x' | 'y']

  const A = Type.Object({ x: Type.String(), y: Type.Literal(1) })
  const B = Type.Object({ x: Type.Number(), y: Type.Number() })
  const C = Type.Object({ x: Type.String(), y: Type.Number() })
  const D = Type.Object({ x: Type.String() })
  const I = Type.Intersect([Type.Union([A, B]), Type.Intersect([C, D])])
  const R = Type.Index(I, ['x', 'y'])
  type O = Static<typeof R>
  Expect(R).ToStatic<number | string>()
}
{
  type A = { x: 'A'; y: 1 }
  type B = { x: 'B'; y: number }
  type C = { x: 'C'; y: number }
  type D = { x: 'D' }
  type I = A | B | C | D
  type R = I['x']

  const A = Type.Object({ x: Type.Literal('A'), y: Type.Literal(1) })
  const B = Type.Object({ x: Type.Literal('B'), y: Type.Number() })
  const C = Type.Object({ x: Type.Literal('C'), y: Type.Number() })
  const D = Type.Object({ x: Type.Literal('D') })
  const I = Type.Union([A, B, C, D])
  const R = Type.Index(I, Type.Union([Type.Literal('x')]))
  type O = Static<typeof R>
  Expect(R).ToStatic<'A' | 'B' | 'C' | 'D'>()
}
{
  type I = {
    x: string
    y: number
    z: I
  }
  type R = I['x' | 'y' | 'z']
  const I = Type.Recursive((This) =>
    Type.Object({
      x: Type.String(),
      y: Type.Number(),
      z: This,
    }),
  )
  const R = Type.Index(I, ['x', 'y', 'z']) // z unresolvable
  type O = Static<typeof R>
  Expect(R).ToStatic<string | number>()
}
// ------------------------------------------------
// Numeric | String Variants
// ------------------------------------------------
{
  const T = Type.Object({
    0: Type.Number(),
    '1': Type.String(),
  })
  const R = Type.Index(T, [0, '1'])
  type O = Static<typeof R>
  Expect(R).ToStatic<string | number>()
}
{
  const T = Type.Object({
    0: Type.Number(),
    '1': Type.String(),
  })
  const R = Type.Index(T, Type.KeyOf(T))
  type O = Static<typeof R>
  Expect(R).ToStatic<string | number>()
}
{
  const P = Type.Tuple([Type.Number(), Type.String()])
  const R = Type.Object({
    x: Type.Index(P, [0, 1]),
  })
  Expect(R).ToStatic<{ x: number | string }>()
}
