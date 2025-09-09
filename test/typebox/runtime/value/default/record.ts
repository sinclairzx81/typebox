import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Default.Record')

Test('Should Default 1', () => {
  const T = Type.Record(Type.String(), Type.Number(), { default: 1 })
  const R = Value.Default(T, undefined)
  Assert.IsEqual(R, 1)
})

Test('Should Default 2', () => {
  const T = Type.Record(Type.String(), Type.Number(), { default: 1 })
  const R = Value.Default(T, null)
  Assert.IsEqual(R, null)
})
// ----------------------------------------------------------------
// Properties
// ----------------------------------------------------------------
Test('Should Default 3', () => {
  const T = Type.Record(Type.Number(), Type.Number({ default: 1 }))
  const R = Value.Default(T, { 0: undefined })
  Assert.IsEqual(R, { 0: 1 })
})
Test('Should Default 4', () => {
  const T = Type.Record(Type.Number(), Type.Number({ default: 1 }))
  const R = Value.Default(T, { 0: null })
  Assert.IsEqual(R, { 0: null })
})
Test('Should Default 5', () => {
  const T = Type.Record(Type.Number(), Type.Number({ default: 1 }))
  const R = Value.Default(T, { a: undefined })
  Assert.IsEqual(R, { a: undefined })
})
Test('Should Default 6', () => {
  const T = Type.Record(Type.Number(), Type.Number({ default: 1 }))
  const R = Value.Default(T, { 0: undefined })
  Assert.IsEqual(R, { 0: 1 })
})
Test('Should Default 7', () => {
  const T = Type.Record(Type.Number(), Type.Number())
  const R = Value.Default(T, { 0: undefined })
  Assert.IsEqual(R, { 0: undefined })
})
Test('Should Default 8', () => {
  const T = Type.Record(Type.Number(), Type.Number({ default: 1 }))
  const R = Value.Default(T, {})
  Assert.IsEqual(R, {})
})
// ----------------------------------------------------------------
// Additional Properties
// ----------------------------------------------------------------
Test('Should Default 9', () => {
  const T = Type.Record(Type.Number(), Type.Number({ default: 1 }), {
    additionalProperties: Type.Number({ default: 3 })
  })
  const R = Value.Default(T, { 0: undefined, a: undefined })
  Assert.IsEqual(R, { 0: 1, a: 3 })
})
Test('Should Default 10', () => {
  const T = Type.Record(Type.Number(), Type.Number({ default: 1 }), {
    additionalProperties: Type.Number()
  })
  const R = Value.Default(T, { 0: undefined, a: undefined })
  Assert.IsEqual(R, { 0: 1, a: undefined })
})
