import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.Has')

const Identity = Type.Codec(Type.String())
  .Decode((value) => value)
  .Encode((value) => value)

Test('Should Has 1', () => {
  const T = Type.Array(Identity)
  Assert.IsTrue(Value.HasCodec(T))
})
Test('Should Has 2', () => {
  const T = Type.Cyclic({
    A: Identity,
    B: Type.Array(Type.Ref('A')),
    C: Type.Object({
      x: Type.Ref('B')
    })
  }, 'C')
  Assert.IsTrue(Value.HasCodec(T))
})
Test('Should Has 3', () => {
  const T = Type.Intersect([
    Type.Object({ y: Type.Null() }),
    Type.Object({ x: Identity })
  ])
  Assert.IsTrue(Value.HasCodec(T))
})
Test('Should Has 4', () => {
  const T = Type.Object({ x: Type.Object({ x: Identity }) })
  Assert.IsTrue(Value.HasCodec(T))
})
Test('Should Has 5', () => {
  const T = Type.Record(Type.String(), Type.Object({ x: Identity }))
  Assert.IsTrue(Value.HasCodec(T))
})
Test('Should Has 6', () => {
  const T = Type.Ref('C')
  Assert.IsTrue(Value.HasCodec({ C: Identity }, T))
})
Test('Should Has 7', () => {
  const X = Type.Array(Identity)
  const T = Type.Ref('X')
  Assert.IsTrue(Value.HasCodec({ X }, T))
})
Test('Should Has 8', () => {
  const T = Type.Tuple([Type.Null(), Identity])
  Assert.IsTrue(Value.HasCodec(T))
})
Test('Should Has 9', () => {
  const T = Type.Union([
    Type.Object({ y: Type.Null() }),
    Type.Object({ x: Identity })
  ])
  Assert.IsTrue(Value.HasCodec(T))
})
Test('Should Has 10', () => {
  const T = Type.Codec(Type.Null())
    .Decode((value) => value)
    .Encode((value) => value)
  Assert.IsTrue(Value.HasCodec(T))
})
// ------------------------------------------------------------------
// Cyclics
// ------------------------------------------------------------------
Test('Should Has 11', () => {
  const C = Type.Codec(Type.Null()).Decode((value) => value).Encode((value) => value)
  const T = Type.Cyclic({
    A: Type.Object({
      value: C,
      nodes: Type.Array(Type.Ref('A'))
    })
  }, 'A')
  Assert.IsTrue(Value.HasCodec(T))
})
Test('Should Has 12', () => {
  const C = Type.Codec(Type.Array(Type.Ref('A'))).Decode((value) => value).Encode((value) => value)
  const T = Type.Cyclic({
    A: Type.Object({
      nodes: C
    })
  }, 'A')
  Assert.IsTrue(Value.HasCodec(T))
})
