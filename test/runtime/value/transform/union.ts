import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Type } from '@sinclair/typebox'

describe('value/transform/Union', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  // prettier-ignore
  const T0 = Type.Transform(Type.Union([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ]))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Encoder.Decode(T0, { x: 1 })
    Assert.IsEqual(R, { x: 1 })
  })
  it('Should encode identity', () => {
    const R = Encoder.Encode(T0, { y: 2 })
    Assert.IsEqual(R, { y: 2 })
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Encoder.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  // prettier-ignore
  const T1 = Type.Transform(Type.Union([
    Type.Object({ type: Type.Literal('hello') }),
    Type.Object({ type: Type.Literal('world') })
  ]))
    .Decode((value) => 'test' as const)
    .Encode((value) => ({ type: 'hello' as const }))
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T1, { type: 'hello' })
    Assert.IsEqual(R, 'test')
  })
  it('Should encode mapped', () => {
    const R = Encoder.Encode(T1, 'test')
    Assert.IsEqual(R, { type: 'hello' })
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Encoder.Decode(T1, null))
  })
  // --------------------------------------------------------
  // Mapped ValueType
  // --------------------------------------------------------
  const M21 = Type.Transform(Type.Number())
    .Decode((value) => value + 1)
    .Encode((value) => value - 1)
  const M22 = Type.Transform(M21)
    .Decode((value) => value + 1)
    .Encode((value) => value - 1)
  // prettier-ignore
  const T2 = Type.Transform(Type.Union([Type.String(), M22]))
    .Decode((value) => value)
    .Encode((value) => {
      if (value === 'hello') return 'world'
      return value
    })
  it('Should decode value type 1', () => {
    const R = Encoder.Decode(T2, 0)
    Assert.IsEqual(R, 2)
  })
  it('Should decode value type 2', () => {
    const R = Encoder.Decode(T2, 'hello')
    Assert.IsEqual(R, 'hello')
  })
  it('Should encode value type 1', () => {
    const R = Encoder.Encode(T2, 'hello')
    Assert.IsEqual(R, 'world')
  })
  it('Should encode value type 2', () => {
    const R = Encoder.Encode(T2, 2)
    Assert.IsEqual(R, 0)
  })
  it('Should throw on value type decode', () => {
    Assert.Throws(() => Encoder.Decode(T2, null))
  })
  // --------------------------------------------------------
  // Mapped ObjectType
  // --------------------------------------------------------
  const N31 = Type.Transform(
    Type.Object({
      x: Type.Number(),
    }),
  )
    .Decode((value) => ({ x: value.x + 1 }))
    .Encode((value) => ({ x: value.x - 1 }))
  const N32 = Type.Transform(
    Type.Object({
      x: Type.String(),
    }),
  )
    .Decode((value) => ({ x: value.x.split('').reverse().join('') }))
    .Encode((value) => ({ x: value.x.split('').reverse().join('') }))
  // prettier-ignore
  const T3 = Type.Transform(Type.Union([N31, N32]))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode object types 1', () => {
    const R = Encoder.Decode(T3, { x: 0 })
    Assert.IsEqual(R, { x: 1 })
  })
  it('Should decode object types 2', () => {
    const R = Encoder.Decode(T3, { x: 'abc' })
    Assert.IsEqual(R, { x: 'cba' })
  })
  it('Should encode object types 1', () => {
    const R = Encoder.Encode(T3, { x: 1 })
    Assert.IsEqual(R, { x: 0 })
  })
  it('Should encode object types 2', () => {
    const R = Encoder.Encode(T3, { x: 'cba' })
    Assert.IsEqual(R, { x: 'abc' })
  })
  it('Should throw on object types decode', () => {
    Assert.Throws(() => Encoder.Decode(T3, null))
  })
  // --------------------------------------------------------
  // Mapped Mixed Types
  // --------------------------------------------------------
  const N41 = Type.Transform(Type.Number())
    .Decode((value) => value + 1)
    .Encode((value) => value - 1)
  // prettier-ignore
  const N42 = Type.Transform(Type.Object({
    x: Type.Number()
  }))
    .Decode((value) => ({ x: value.x + 1 }))
    .Encode((value) => ({ x: value.x - 1 }))
  const N43 = Type.Transform(Type.Tuple([Type.Number()]))
    .Decode((value) => [value[0] + 1])
    .Encode((value) => [value[0] - 1] as [number])
  // prettier-ignore
  const T4 = Type.Transform(Type.Union([N41, N42, N43]))
    .Decode((value) => typeof value === 'number' ? value + 1 : value)
    .Encode((value) => typeof value === 'number' ? value - 1 : value)
  it('Should decode mixed types 1', () => {
    const R = Encoder.Decode(T4, { x: 0 })
    Assert.IsEqual(R, { x: 1 })
  })
  it('Should decode mixed types 2', () => {
    const R = Encoder.Decode(T4, 0)
    Assert.IsEqual(R, 2)
  })
  it('Should decode mixed types 3', () => {
    const R = Encoder.Decode(T4, [0])
    Assert.IsEqual(R, [1])
  })
  it('Should encode mixed types 1', () => {
    const R = Encoder.Encode(T4, { x: 1 })
    Assert.IsEqual(R, { x: 0 })
  })
  it('Should encode mixed types 2', () => {
    const R = Encoder.Encode(T4, 2)
    Assert.IsEqual(R, 0)
  })
  it('Should encode mixed types 3', () => {
    const R = Encoder.Encode(T4, [1])
    Assert.IsEqual(R, [0])
  })
  it('Should throw on mixed types decode', () => {
    Assert.Throws(() => Encoder.Decode(T4, null))
  })
  // --------------------------------------------------------
  // Interior Union Transform
  //
  // https://github.com/sinclairzx81/typebox/issues/631
  // --------------------------------------------------------
  const T51 = Type.Transform(Type.String())
    .Decode((value) => new Date(value))
    .Encode((value) => value.toISOString())
  const T52 = Type.Union([Type.Null(), T51])
  it('Should decode interior union 1', () => {
    const R = Encoder.Decode(T52, null)
    Assert.IsEqual(R, null)
  })
  it('Should decode interior union 2', () => {
    const R = Encoder.Decode(T52, new Date().toISOString())
    Assert.IsInstanceOf(R, Date)
  })
  it('Should encode interior union 1', () => {
    const R = Encoder.Encode(T52, null)
    Assert.IsEqual(R, null)
  })
  it('Should encode interior union 2', () => {
    const D = new Date()
    const R = Encoder.Encode(T52, D)
    Assert.IsEqual(R, D.toISOString())
  })
  it('Should throw on interior union decode', () => {
    Assert.Throws(() => Encoder.Decode(T52, {}))
  })
  it('Should throw on interior union encode', () => {
    Assert.Throws(() => Encoder.Encode(T52, 1))
  })
  // prettier-ignore
  { // https://github.com/sinclairzx81/typebox/issues/676
    // interior-type
    const S = Type.Transform(Type.String())
    .Decode((value: string) => new globalThis.Date(value))
    .Encode((value: Date) => value.toISOString())
    // union-type
    const U = Type.Union([
      Type.Object({ date: S }), 
      Type.Number()
    ])
    // expect date on decode
    const T1 = Type.Transform(U)
      .Decode((value) => { 
        Assert.IsTypeOf(value, 'object')
        Assert.HasProperty(value, 'date')
        Assert.IsInstanceOf(value.date, globalThis.Date); 
        return value 
      })
      .Encode((value) => value)
    // expect number on decode
    const T2 = Type.Transform(U)
      .Decode((value) => { 
        Assert.IsTypeOf(value, 'number')
        return value 
      })
      .Encode((value) => value)
    
    it('Should decode interior union 1', () => {
      const R = Encoder.Decode(T1, { date: new globalThis.Date().toISOString() })
      Assert.IsTypeOf(R, 'object')
      Assert.HasProperty(R, 'date')
      Assert.IsInstanceOf(R.date, globalThis.Date); 
    })
    it('Should decode interior union 2', () => {
      const R = Encoder.Decode(T2, 123)
      Assert.IsTypeOf(R, 'number')
      Assert.IsEqual(R, 123)
    })
  }
})
