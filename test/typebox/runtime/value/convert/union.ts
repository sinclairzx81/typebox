import { Convert, Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Union')

Test('Should Convert 1', () => {
  const T = Type.Object({
    x: Type.Union([Type.Number(), Type.Null()])
  })
  const R0 = Value.Convert(T, { x: '42' })
  const R1 = Value.Convert(T, { x: 'null' })
  const R2 = Value.Convert(T, { x: 'hello' })
  Assert.IsEqual(R0, { x: 42 })
  Assert.IsEqual(R1, { x: null })
  Assert.IsEqual(R2, { x: 'hello' })
})

Test('Should Convert 2', () => {
  const T = Type.Object({
    x: Type.Union([Type.Boolean(), Type.Number()])
  })
  const R = Value.Convert(T, { x: '1' })
  Assert.IsEqual(R, { x: true })
})

// ----------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/787
// ----------------------------------------------------------------
Test('Should Convert 3', () => {
  const T = Type.Intersect([
    Type.Union([
      Type.Object({ a: Type.Number() }),
      Type.Object({ b: Type.Number() })
    ]),
    Type.Object({ c: Type.Number() })
  ])
  const R0 = Convert(T, { a: '1', c: '2' })
  const R1 = Convert(T, { b: '1', c: '2' })
  const R2 = Convert(T, { a: '1', b: '2', c: '3' })
  Assert.IsEqual(R0, { a: 1, c: 2 })
  Assert.IsEqual(R1, { b: 1, c: 2 })
  Assert.IsEqual(R2, { a: 1, b: '2', c: 3 }) // note: matching on first
})
// ----------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1295
// ----------------------------------------------------------------
Test('Should guard against Array conversion in Object', () => {
  const T = Type.Union([
    Type.Object({
      type: Type.Literal('A'),
      values: Type.Union([Type.String(), Type.Number()])
    }),
    Type.Object({
      type: Type.Literal('B'),
      values: Type.String()
    })
  ])
  const converted = Value.Convert(T, [{ type: 'A', values: 1 }])
  Assert.IsEqual(converted, [{ type: 'A', values: 1 }])
})
Test('Should guard against Array conversion in Record', () => {
  const T = Type.Union([Type.Record(Type.String({ pattern: '^values$' }), Type.Union([Type.String(), Type.Number()])), Type.Record(Type.String({ pattern: '^type$' }), Type.Union([Type.String(), Type.Number()]))])
  const converted = Value.Convert(T, [{ type: 'A', values: 1 }])
  Assert.IsEqual(converted, [{ type: 'A', values: 1 }])
})
