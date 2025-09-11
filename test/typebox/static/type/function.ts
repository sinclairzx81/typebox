import { type Static, Type } from 'typebox'
import { Assert } from 'test'

// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
{
  const T = Type.Function([Type.String(), Type.Boolean()], Type.Object({ x: Type.Number() }))
  type T = Static<typeof T>
  Assert.IsExtends<T, (a: string, b: boolean) => { x: number }>(true)
  Assert.IsExtends<T, null>(false)
}
// ------------------------------------------------------------------
// Rest: Apply
// ------------------------------------------------------------------
{
  const P1 = Type.Tuple([Type.Literal(1), Type.Literal(2)])
  const T = Type.Object({
    x: Type.Function([Type.Rest(P1)], Type.Void())
  })
  type T = Static<typeof T>
  Assert.IsExtends<T, { x: (x: 1, y: 2) => void }>(true)
  Assert.IsExtends<T, { x: (x: 1, y: 3) => void }>(false)
}
// ------------------------------------------------------------------
// Rest: Nested
// ------------------------------------------------------------------
{
  const P1 = Type.Tuple([Type.Literal(1), Type.Literal(2)])
  const P2 = Type.Tuple([Type.Literal(3), Type.Literal(4)])
  const T = Type.Object({
    x: Type.Function([Type.Rest(P1), Type.Rest(P2)], Type.Void())
  })
  type T = Static<typeof T>
  Assert.IsExtends<T, { x: (x: 1, y: 2, z: 3, w: 4) => void }>(true)
  Assert.IsExtends<T, { x: (x: 1, y: 2, z: 3, w: 5) => void }>(false)
}
// ------------------------------------------------------------------
// Rest: Leading Type
// ------------------------------------------------------------------
{
  const P1 = Type.Tuple([Type.Literal(1), Type.Literal(2)])
  const T = Type.Object({
    x: Type.Function([Type.String(), Type.Rest(P1)], Type.Void())
  })
  type T = Static<typeof T>
  Assert.IsExtends<T, { x: (x: string, y: 1, z: 2) => void }>(true)
  Assert.IsExtends<T, { x: (x: string, y: 1, z: 3) => void }>(false)
}
// ------------------------------------------------------------------
// Rest: Trailing Type
// ------------------------------------------------------------------
{
  const P1 = Type.Tuple([Type.Literal(1), Type.Literal(2)])
  const T = Type.Object({
    x: Type.Function([Type.Rest(P1), Type.String()], Type.Void())
  })
  type T = Static<typeof T>
  Assert.IsExtends<T, { x: (x: 1, y: 2, z: string) => void }>(true)
  Assert.IsExtends<T, { x: (x: 1, y: 3, z: string) => void }>(false)
}
// ------------------------------------------------------------------
// Syntax: 1
// ------------------------------------------------------------------
{
  const A = Type.Script('[1, 2]')
  const T = Type.Script({ A }, `(...x: A) => void`)
  type T = Static<typeof T>
  Assert.IsExtends<T, (x: 1, y: 2) => void>(true)
  Assert.IsExtends<T, (x: 1, y: 3) => void>(false)
}
// ------------------------------------------------------------------
// Syntax: 2
// ------------------------------------------------------------------
{
  const A = Type.Script('[1, 2]')
  const T = Type.Script({ A }, `(...x: [...A]) => void`)
  type T = Static<typeof T>
  Assert.IsExtends<T, (x: 1, y: 2) => void>(true)
  Assert.IsExtends<T, (x: 1, y: 3) => void>(false)
}
// ------------------------------------------------------------------
// Syntax: 3
// ------------------------------------------------------------------
{
  const A = Type.Script('[1, 2]')
  const B = Type.Script('[3, 4]')
  const T = Type.Script({ A, B }, `(...x: [...A, ...B]) => void`)
  type T = Static<typeof T>
  Assert.IsExtends<T, (x: 1, y: 2, z: 3, w: 4) => void>(true)
  Assert.IsExtends<T, (x: 1, y: 2, z: 3, w: 5) => void>(false)
}
