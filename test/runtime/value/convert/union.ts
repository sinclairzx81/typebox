import { Convert, Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/convert/Union', () => {
  it('Should convert union variant', () => {
    const T = Type.Object({
      x: Type.Union([Type.Number(), Type.Null()]),
    })
    const V1 = Value.Convert(T, { x: '42' })
    const V2 = Value.Convert(T, { x: 'null' })
    const V3 = Value.Convert(T, { x: 'hello' })
    Assert.IsEqual(V1, { x: 42 })
    Assert.IsEqual(V2, { x: null })
    Assert.IsEqual(V3, { x: 'hello' })
  })
  it('Should convert first variant in ambiguous conversion', () => {
    const T = Type.Object({
      x: Type.Union([Type.Boolean(), Type.Number()]),
    })
    const V1 = Value.Convert(T, { x: '1' })
    Assert.IsEqual(V1, { x: true })
  })
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/787
  // ----------------------------------------------------------------
  // prettier-ignore
  it('Should convert Intersect Union', () => {
    const T = Type.Intersect([
      Type.Union([
        Type.Object({ a: Type.Number() }),
        Type.Object({ b: Type.Number() }),
      ]),
      Type.Object({ c: Type.Number() }),
    ])
    const A = Convert(T, { a: '1', c: '2' })
    const B = Convert(T, { b: '1', c: '2' })
    const C = Convert(T, { a: '1', b: '2', c: '3' })
    Assert.IsEqual(A, { a: 1, c: 2 })
    Assert.IsEqual(B, { b: 1, c: 2 })
    Assert.IsEqual(C, { a: 1, b: '2', c: 3 }) // note: matching on first
  })
  it('Should preserve number type in string-first union when value already matches', () => {
    const T = Type.Union([Type.String(), Type.Number()])
    const numValue = 42
    const strValue = 'hello'

    const A = Value.Convert(T, numValue)
    const B = Value.Convert(T, strValue)

    Assert.IsEqual(typeof A, 'number')
    Assert.IsEqual(typeof B, 'string')
    Assert.IsEqual(A, 42)
    Assert.IsEqual(B, 'hello')
  })
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/1281
  // Union conversion should preserve original type if valid
  // ----------------------------------------------------------------
  it('Should preserve original type when value already matches union variant', () => {
    const T1 = Type.Object({
      data: Type.Array(Type.Record(Type.String(), Type.Union([Type.String(), Type.Number(), Type.Null()]))),
    })
    const T2 = Type.Object({
      data: Type.Array(Type.Record(Type.String(), Type.Union([Type.Number(), Type.String(), Type.Null()]))),
    })
    const testData = {
      data: [{ key1: 'hello', key2: 42, key3: null }],
    }

    const A = Value.Convert(T1, testData)
    const B = Value.Convert(T2, testData)

    // Both should preserve the original number type
    Assert.IsEqual(typeof (A as any).data[0].key2, 'number')
    Assert.IsEqual(typeof (B as any).data[0].key2, 'number')
    Assert.IsEqual((A as any).data[0].key2, 42)
    Assert.IsEqual((B as any).data[0].key2, 42)
  })
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/1295
  // ----------------------------------------------------------------
  it('Should guard against Array conversion in Object', () => {
    const T = Type.Union([
      Type.Object({
        type: Type.Literal('A'),
        values: Type.Union([Type.String(), Type.Number()]),
      }),
      Type.Object({
        type: Type.Literal('B'),
        values: Type.String(),
      }),
    ])
    const converted = Value.Convert(T, [{ type: 'A', values: 1 }])
    Assert.IsEqual(converted, [{ type: 'A', values: 1 }])
  })
  it('Should guard against Array conversion in Record', () => {
    const T = Type.Union([Type.Record(Type.String({ pattern: '^values$' }), Type.Union([Type.String(), Type.Number()])), Type.Record(Type.String({ pattern: '^type$' }), Type.Union([Type.String(), Type.Number()]))])
    const converted = Value.Convert(T, [{ type: 'A', values: 1 }])
    Assert.IsEqual(converted, [{ type: 'A', values: 1 }])
  })
})
