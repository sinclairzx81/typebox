import { Type, Static, StaticDecode, TObject, TNumber } from '@sinclair/typebox'
import { Expect } from './assert'
{
  // string > number
  const T = Type.Transform(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  Expect(T).ToStaticDecode<string>()
  Expect(T).ToStaticEncode<number>()
  Expect(T).ToStatic<number>()
}
{
  // boolean > union
  const T = Type.Transform(Type.Boolean())
    .Decode((value) => (value ? (1 as const) : (2 as const)))
    .Encode((value) => true)

  Expect(T).ToStatic<boolean>()
  Expect(T).ToStaticDecode<1 | 2>()
  Expect(T).ToStaticEncode<boolean>()
}
{
  // literal > union
  const T = Type.Transform(Type.Union([Type.Literal(1), Type.Literal(2)]))
    .Decode((value) => true as const)
    .Encode((value) => (value ? (1 as const) : (2 as const)))
  Expect(T).ToStatic<1 | 2>()
  Expect(T).ToStaticDecode<true>()
  Expect(T).ToStaticEncode<1 | 2>()
}
{
  // nested: 1 > 2 > 3
  const T1 = Type.Transform(Type.Literal(1))
    .Decode((value) => 2 as const)
    .Encode((value) => 1 as const)

  const T2 = Type.Transform(T1)
    .Decode((value) => 3 as const)
    .Encode((value) => 2 as const)

  Expect(T1).ToStatic<1>()
  Expect(T1).ToStaticDecode<2>()
  Expect(T1).ToStaticEncode<1>()

  Expect(T2).ToStatic<2>() // resolve to base
  Expect(T2).ToStaticDecode<3>()
  Expect(T2).ToStaticEncode<2>()
}
{
  // nested: 1 > 2 > 3 > 4
  const T1 = Type.Transform(Type.Literal(1))
    .Decode((value) => 2 as const)
    .Encode((value) => 1 as const)

  const T2 = Type.Transform(T1)
    .Decode((value) => 3 as const)
    .Encode((value) => 2 as const)

  const T3 = Type.Transform(T2)
    .Decode((value) => 4 as const)
    .Encode((value) => 3 as const)

  Expect(T1).ToStatic<1>()
  Expect(T1).ToStaticDecode<2>()
  Expect(T1).ToStaticEncode<1>()

  Expect(T2).ToStatic<2>()
  Expect(T2).ToStaticDecode<3>()
  Expect(T2).ToStaticEncode<2>()

  Expect(T3).ToStatic<3>()
  Expect(T3).ToStaticDecode<4>()
  Expect(T3).ToStaticEncode<3>()
}
{
  // recursive > 1
  // prettier-ignore
  const T = Type.Transform(Type.Recursive(This => Type.Object({
    id: Type.String(),
    nodes: Type.Array(This)
  })))
    .Decode((value) => 1 as const)
    .Encode((value) => ({
      id: 'A',
      nodes: [
        { id: 'B', nodes: [] }, 
        { id: 'C', nodes: [] }
      ]
    }))

  interface N {
    id: string
    nodes: this[]
  }
  Expect(T).ToStatic<N>()
  Expect(T).ToStaticDecode<1>()
  Expect(T).ToStaticEncode<N>()
}
{
  // recursive > 1 > 2
  interface N {
    id: string
    nodes: this[]
  }
  // prettier-ignore
  const T1 = Type.Transform(Type.Recursive(This => Type.Object({
    id: Type.String(),
    nodes: Type.Array(This)
  })))
    .Decode((value) => 1 as const)
    .Encode((value) => ({
      id: 'A',
      nodes: [
        { id: 'B', nodes: [] }, 
        { id: 'C', nodes: [] }
      ]
    }))

  const T2 = Type.Transform(T1)
    .Decode((value) => 2 as const)
    .Encode((value) => 1 as const)

  Expect(T1).ToStatic<N>()
  Expect(T1).ToStaticDecode<1>()
  Expect(T1).ToStaticEncode<N>()

  Expect(T2).ToStatic<1>()
  Expect(T2).ToStaticDecode<2>()
  Expect(T2).ToStaticEncode<1>()
}
{
  // deep-nesting
  // prettier-ignore
  const T = Type.Transform(Type.Transform(Type.Transform(Type.Transform(Type.Transform(Type.Transform(Type.Transform(Type.Transform(Type.Transform(Type.Literal(1))
  .Decode((value) => value)
  .Encode((value) => value))
  .Decode((value) => value)
  .Encode((value) => value))
  .Decode((value) => value)
  .Encode((value) => value))
  .Decode((value) => value)
  .Encode((value) => value))
  .Decode((value) => value)
  .Encode((value) => value))
  .Decode((value) => value)
  .Encode((value) => value))
  .Decode((value) => value)
  .Encode((value) => value))
  .Decode((value) => value)
  .Encode((value) => value))
  .Decode((value) => value)
  .Encode((value) => value)

  Expect(T).ToStatic<1>()
  Expect(T).ToStaticDecode<1>()
  Expect(T).ToStaticEncode<1>()
}
{
  // null to typebox type
  // prettier-ignore
  const T = Type.Transform(Type.Null())
    .Decode(value => Type.Object({ 
      x: Type.Number(), 
      y: Type.Number(),
      z: Type.Number()
    }))
    .Encode(value => null)
  Expect(T).ToStatic<null>()
  Expect(T).ToStaticDecode<
    TObject<{
      x: TNumber
      y: TNumber
      z: TNumber
    }>
  >()
  Expect(T).ToStaticEncode<null>()
  type T = StaticDecode<typeof T>
  type S = Static<T> // type S = {
  //   x: number;
  //   y: number;
  //   z: number;
  // } // lol
}
{
  // ensure decode as optional
  // prettier-ignore
  const T = Type.Object({
    x: Type.Optional(Type.Number()),
    y: Type.Optional(Type.Number())
  })
  Expect(T).ToStaticDecode<{ x: undefined; y: undefined }>()
  Expect(T).ToStaticDecode<{ x: 1; y: 1 }>()
}
{
  // ensure decode as readonly
  // prettier-ignore
  const T = Type.Object({
    x: Type.Readonly(Type.Number()),
    y: Type.Readonly(Type.Number())
  })
  Expect(T).ToStaticDecode<{ readonly x: 1; readonly y: 1 }>()
}
{
  // ensure decode as optional union
  // prettier-ignore
  const T = Type.Object({
    x: Type.Optional(Type.Union([
      Type.String(),
      Type.Number()
    ]))
  })
  Expect(T).ToStaticDecode<{ x: 1 }>()
  Expect(T).ToStaticDecode<{ x: '1' }>()
  Expect(T).ToStaticDecode<{ x: undefined }>()
}
