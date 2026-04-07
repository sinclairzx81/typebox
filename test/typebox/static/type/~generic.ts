import { type Static, type StaticDecode, type StaticEncode, type TSchema, Type } from 'typebox'
import { Assert } from 'test'

// ------------------------------------------------------------------
// Static: Case 1
// ------------------------------------------------------------------
{
  function create<Type extends TSchema>(schema: Type): Static<Type> {
    return {} as any
  }
  const result = create(Type.Object({
    x: Type.Number(),
    y: Type.Number()
  }))
  Assert.IsExtendsMutual<typeof result, {
    x: number
    y: number
  }>(true)
}
// ------------------------------------------------------------------
// Static: Case 2
// ------------------------------------------------------------------
{
  function create<Type extends TSchema>(schema: Type) {
    return (value: Static<Type>): Static<Type> => value
  }
  const test = create(Type.Object({
    x: Type.Number(),
    y: Type.Number()
  }))
  const result = test({ x: 1, y: 2 })
  Assert.IsExtendsMutual<typeof result, {
    x: number
    y: number
  }>(true)
}
// ------------------------------------------------------------------
// Static: Case 3
// ------------------------------------------------------------------
{
  class Test<Type extends TSchema> {
    constructor(type: Type) {}
    test(value: Static<Type>): Static<Type> {
      return value
    }
  }
  const instance = new Test(Type.Object({
    x: Type.Number(),
    y: Type.Number()
  }))
  const result = instance.test({ x: 1, y: 2 })
  Assert.IsExtendsMutual<typeof result, {
    x: number
    y: number
  }>(true)
}
// ------------------------------------------------------------------
// Static: Case 4
// ------------------------------------------------------------------
{
  class Test<Type extends TSchema> {
    constructor(type: Type) {}
    test<Next extends TSchema>(next: Next, value: Static<Type>): [Static<Next>, Static<Type>] {
      return null as never
    }
  }
  const instance = new Test(Type.Object({
    x: Type.Number(),
    y: Type.Number()
  }))
  const result = instance.test(
    Type.Object({
      z: Type.Number(),
      w: Type.Number()
    }),
    { x: 1, y: 2 }
  )
  Assert.IsExtendsMutual<typeof result, [{
    z: number
    w: number
  }, {
    x: number
    y: number
  }]>(true)
}
// ------------------------------------------------------------------
// Static: Case 5
// ------------------------------------------------------------------
{
  class Test<Type extends TSchema> {
    constructor(type: Type) {}
    test<Next extends TSchema>(next: Next, value: Static<Type>): [Static<Type>, Static<Next>] {
      return null as never
    }
  }
  const instance = new Test(Type.Object({
    x: Type.Number(),
    y: Type.Number()
  }))
  const result = instance.test(
    Type.Object({
      z: Type.Number(),
      w: Type.Number()
    }),
    { x: 1, y: 2 }
  )
  Assert.IsExtendsMutual<typeof result, [{
    x: number
    y: number
  }, {
    z: number
    w: number
  }]>(true)
}
// ------------------------------------------------------------------
// CodecGeneric
// ------------------------------------------------------------------
const TypeWithCodec = Type.Object({
  x: Type.Codec(Type.String())
    .Decode((value) => parseFloat(value))
    .Encode((value) => value.toString()),
  y: Type.Codec(Type.String())
    .Decode((value) => parseFloat(value))
    .Encode((value) => value.toString())
})

// ------------------------------------------------------------------
// StaticDecode: Case 1
// ------------------------------------------------------------------
{
  function create<Type extends TSchema>(schema: Type): StaticDecode<Type> {
    return {} as any
  }
  const result = create(TypeWithCodec)
  Assert.IsExtendsMutual<typeof result, {
    x: number
    y: number
  }>(true)
}
// ------------------------------------------------------------------
// StaticDecode: Case 2
// ------------------------------------------------------------------
{
  function create<Type extends TSchema>(schema: Type) {
    return (value: StaticDecode<Type>): StaticDecode<Type> => value
  }
  const test = create(TypeWithCodec)
  const result = test({ x: 1, y: 2 })
  Assert.IsExtendsMutual<typeof result, {
    x: number
    y: number
  }>(true)
}
// ------------------------------------------------------------------
// StaticDecode: Case 3
// ------------------------------------------------------------------
{
  class Test<Type extends TSchema> {
    constructor(type: Type) {}
    test(value: StaticDecode<Type>): StaticDecode<Type> {
      return value
    }
  }
  const instance = new Test(TypeWithCodec)
  const result = instance.test({ x: 1, y: 2 })
  Assert.IsExtendsMutual<typeof result, {
    x: number
    y: number
  }>(true)
}
// ------------------------------------------------------------------
// StaticDecode: Case 4
// ------------------------------------------------------------------
{
  class Test<Type extends TSchema> {
    constructor(type: Type) {}
    test<Next extends TSchema>(next: Next, value: StaticDecode<Type>): [Static<Next>, StaticDecode<Type>] {
      return null as never
    }
  }
  const instance = new Test(TypeWithCodec)
  const result = instance.test(
    Type.Object({
      z: Type.Number(),
      w: Type.Number()
    }),
    { x: 1, y: 2 }
  )
  Assert.IsExtendsMutual<typeof result, [{
    z: number
    w: number
  }, {
    x: number
    y: number
  }]>(true)
}
// ------------------------------------------------------------------
// StaticDecode: Case 5
// ------------------------------------------------------------------
{
  class Test<Type extends TSchema> {
    constructor(type: Type) {}
    test<Next extends TSchema>(next: Next, value: StaticDecode<Type>): [StaticDecode<Type>, StaticDecode<Next>] {
      return null as never
    }
  }
  const instance = new Test(TypeWithCodec)
  const result = instance.test(
    Type.Object({
      z: Type.Number(),
      w: Type.Number()
    }),
    { x: 1, y: 2 }
  )
  Assert.IsExtendsMutual<typeof result, [{
    x: number
    y: number
  }, {
    z: number
    w: number
  }]>(true)
}
// ------------------------------------------------------------------
// StaticEncode: Case 1
// ------------------------------------------------------------------
{
  function create<Type extends TSchema>(schema: Type): StaticEncode<Type> {
    return {} as any
  }
  const result = create(TypeWithCodec)
  Assert.IsExtendsMutual<typeof result, {
    x: string
    y: string
  }>(true)
}
// ------------------------------------------------------------------
// StaticEncode: Case 2
// ------------------------------------------------------------------
{
  function create<Type extends TSchema>(schema: Type) {
    return (value: StaticEncode<Type>): StaticEncode<Type> => value
  }
  const test = create(TypeWithCodec)
  const result = test({ x: '1', y: '2' })
  Assert.IsExtendsMutual<typeof result, {
    x: string
    y: string
  }>(true)
}
// ------------------------------------------------------------------
// StaticEncode: Case 3
// ------------------------------------------------------------------
{
  class Test<Type extends TSchema> {
    constructor(type: Type) {}
    test(value: StaticEncode<Type>): StaticEncode<Type> {
      return value
    }
  }
  const instance = new Test(TypeWithCodec)
  const result = instance.test({ x: '1', y: '2' })
  Assert.IsExtendsMutual<typeof result, {
    x: string
    y: string
  }>(true)
}
// ------------------------------------------------------------------
// StaticEncode: Case 4
// ------------------------------------------------------------------
{
  class Test<Type extends TSchema> {
    constructor(type: Type) {}
    test<Next extends TSchema>(next: Next, value: StaticEncode<Type>): [Static<Next>, StaticEncode<Type>] {
      return null as never
    }
  }
  const instance = new Test(TypeWithCodec)
  const result = instance.test(
    Type.Object({
      z: Type.Number(),
      w: Type.Number()
    }),
    { x: '1', y: '2' }
  )
  Assert.IsExtendsMutual<typeof result, [{
    z: number
    w: number
  }, {
    x: string
    y: string
  }]>(true)
}
// ------------------------------------------------------------------
// StaticEncode: Case 5
// ------------------------------------------------------------------
{
  class Test<Type extends TSchema> {
    constructor(type: Type) {}
    test<Next extends TSchema>(next: Next, value: StaticEncode<Type>): [StaticEncode<Type>, StaticEncode<Next>] {
      return null as never
    }
  }
  const instance = new Test(TypeWithCodec)
  const result = instance.test(
    Type.Object({
      z: Type.Number(),
      w: Type.Number()
    }),
    { x: '1', y: '2' }
  )
  Assert.IsExtendsMutual<typeof result, [{
    x: string
    y: string
  }, {
    z: number
    w: number
  }]>(true)
}
