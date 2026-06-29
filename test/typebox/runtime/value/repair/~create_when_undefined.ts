import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.CreateWhenUndefined')

// ------------------------------------------------------------------
// Any
// ------------------------------------------------------------------
Test('Should CreateWhenUndefined 1', () => {
  const result = Value.Repair(Type.Any({ default: 42 }), undefined)
  Assert.IsEqual(result, 42)
})
// ------------------------------------------------------------------
// Unknown
// ------------------------------------------------------------------
Test('Should CreateWhenUndefined 2', () => {
  const result = Value.Repair(Type.Unknown({ default: 42 }), undefined)
  Assert.IsEqual(result, 42)
})
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
Test('Should CreateWhenUndefined 3', () => {
  const result = Value.Repair(Type.BigInt({ default: 42n }), undefined)
  Assert.IsEqual(result, 42n)
})
Test('Should CreateWhenUndefined 4', () => {
  const result = Value.Repair(Type.BigInt({ default: 42 }), undefined)
  Assert.IsEqual(result, 42n)
})
Test('Should CreateWhenUndefined 5', () => {
  const result = Value.Repair(Type.BigInt({ default: '42' }), undefined)
  Assert.IsEqual(result, 42n)
})
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
Test('Should CreateWhenUndefined 6', () => {
  const result = Value.Repair(Type.Boolean({ default: true }), undefined)
  Assert.IsEqual(result, true)
})
Test('Should CreateWhenUndefined 7', () => {
  const result = Value.Repair(Type.Boolean({ default: false }), undefined)
  Assert.IsEqual(result, false)
})
Test('Should CreateWhenUndefined 8', () => {
  const result = Value.Repair(Type.Boolean({ default: 0 }), undefined)
  Assert.IsEqual(result, false)
})
Test('Should CreateWhenUndefined 9', () => {
  const result = Value.Repair(Type.Boolean({ default: 1 }), undefined)
  Assert.IsEqual(result, true)
})
Test('Should CreateWhenUndefined 10', () => {
  Assert.Throws(() => Value.Repair(Type.Boolean({ default: 2 }), undefined))
})
// ------------------------------------------------------------------
// Integer
// ------------------------------------------------------------------
Test('Should CreateWhenUndefined 11', () => {
  const result = Value.Repair(Type.Integer({ default: 42 }), undefined)
  Assert.IsEqual(result, 42)
})
Test('Should CreateWhenUndefined 12', () => {
  const result = Value.Repair(Type.Integer({ default: '42' }), undefined)
  Assert.IsEqual(result, 42)
})
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
Test('Should CreateWhenUndefined 13', () => {
  const result = Value.Repair(Type.Number({ default: 42 }), undefined)
  Assert.IsEqual(result, 42)
})
Test('Should CreateWhenUndefined 14', () => {
  const result = Value.Repair(Type.Number({ default: '42' }), undefined)
  Assert.IsEqual(result, 42)
})
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
Test('Should CreateWhenUndefined 15', () => {
  const result = Value.Repair(Type.String({ default: 'hello' }), undefined)
  Assert.IsEqual(result, 'hello')
})
Test('Should CreateWhenUndefined 16', () => {
  const result = Value.Repair(Type.String({ default: 12345 }), undefined)
  Assert.IsEqual(result, '12345')
})
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
Test('Should CreateWhenUndefined 17', () => {
  const result = Value.Repair(Type.Null(), undefined)
  Assert.IsEqual(result, null)
})
// ------------------------------------------------------------------
// Undefined (Ignored)
// ------------------------------------------------------------------
Test('Should CreateWhenUndefined 18', () => {
  const result = Value.Repair(Type.Undefined({ default: null }), undefined)
  Assert.IsEqual(result, undefined)
})
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
Test('Should CreateWhenUndefined 19', () => {
  const result = Value.Repair(Type.Object({ x: Type.Number() }, { default: { x: 1 } }), undefined)
  Assert.IsEqual(result, { x: 1 })
})
Test('Should CreateWhenUndefined 20', () => {
  const result = Value.Repair(Type.Object({ x: Type.Number() }, { default: { x: '1' } }), undefined)
  Assert.IsEqual(result, { x: 1 })
})
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
Test('Should CreateWhenUndefined 21', () => {
  const result = Value.Repair(Type.Tuple([Type.Number()], { default: [1] }), undefined)
  Assert.IsEqual(result, [1])
})
Test('Should CreateWhenUndefined 22', () => {
  const result = Value.Repair(Type.Tuple([Type.Number()], { default: ['1'] }), undefined)
  Assert.IsEqual(result, [1])
})
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
Test('Should CreateWhenUndefined 23', () => {
  const result = Value.Repair(Type.Array(Type.Number(), { default: [1] }), undefined)
  Assert.IsEqual(result, [1])
})
Test('Should CreateWhenUndefined 24', () => {
  const result = Value.Repair(Type.Array(Type.Number(), { default: ['1'] }), undefined)
  Assert.IsEqual(result, [1])
})
