import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

// ------------------------------------------------------------------
// Enum 1
// ------------------------------------------------------------------
{
  enum Enum {
    A,
    B,
  }

  const T = Type.Module({
    T: Type.Object({
      value: Type.Enum(Enum),
    }),
  }).Import('T')

  Expect(T).ToStatic<{
    value: Enum
  }>()
}

// ------------------------------------------------------------------
// Enum 2
// ------------------------------------------------------------------
{
  const T = Type.Module({
    T: Type.Object({
      value: Type.Enum({
        x: 1,
        y: 2,
      }),
    }),
  }).Import('T')

  Expect(T).ToStatic<{
    value: 1 | 2
  }>()
}
// ------------------------------------------------------------------
// Record 1
// ------------------------------------------------------------------
// prettier-ignore
{
  const T = Type.Module({
    R: Type.Object({ x: Type.Number(), y: Type.Number() }),
    T: Type.Record(Type.String(), Type.Ref('R')),
  }).Import('T')

  type T = Static<typeof T>
  Expect(T).ToStatic<{ 
    [key: string]: { x: number, y: number } 
  }>()
}
// ------------------------------------------------------------------
// Record 2
// ------------------------------------------------------------------
// prettier-ignore
{
  const T = Type.Module({
    R: Type.Object({ x: Type.Number(), y: Type.Number() }),
    T: Type.Record(Type.String(), Type.Partial(Type.Ref('R'))),
  }).Import('T')

  type T = Static<typeof T>
  Expect(T).ToStatic<{ 
    [key: string]: { x?: number, y?: number } 
  }>()
}
// ------------------------------------------------------------------
// Record 3
// ------------------------------------------------------------------
// prettier-ignore
{
  const T = Type.Module({
    R: Type.Object({ x: Type.Number(), y: Type.Number() }),
    K: Type.Number(),
    T: Type.Record(Type.Ref('K'), Type.Partial(Type.Ref('R'))),
  }).Import('T')

  type T = Static<typeof T>
  Expect(T).ToStatic<{ 
    [key: number]: { x?: number, y?: number } 
  }>()
}
// ------------------------------------------------------------------
// Record 4
// ------------------------------------------------------------------
// prettier-ignore
{
  const T = Type.Module({
    R: Type.Object({ x: Type.Number(), y: Type.Number() }),
    K: Type.TemplateLiteral('${A|B|C}'),
    T: Type.Record(Type.Ref('K'), Type.Partial(Type.Ref('R'))),
  }).Import('T')
  type T = Static<typeof T>
  Expect(T).ToStatic<{ 
    A: { x?: number, y?: number },
    B: { x?: number, y?: number },
    C: { x?: number, y?: number } 
  }>()
}
// ------------------------------------------------------------------
// Object 1
// ------------------------------------------------------------------
// prettier-ignore
{
  const T = Type.Module({
    R: Type.Object({ x: Type.Optional(Type.Number()), a: Type.Optional(Type.Array(Type.Number())) }),
  }).Import('R')
  type T = Static<typeof T>
  Expect(T).ToStatic<{ x?: number, a?: number[] }>()
}
