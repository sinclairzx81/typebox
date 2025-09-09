import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Record')

// ----------------------------------------------------------------
// Clean
// ----------------------------------------------------------------
Test('Should Clean 1', () => {
  const T = Type.Record(Type.Number(), Type.String())
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 2', () => {
  const T = Type.Record(Type.Number(), Type.String())
  const R = Value.Clean(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Clean 3', () => {
  const T = Type.Record(Type.Number(), Type.String())
  const R = Value.Clean(T, { 0: null })
  Assert.IsEqual(R, { 0: null })
})
// ----------------------------------------------------------------
// Clean Discard
// ----------------------------------------------------------------
Test('Should Clean 4', () => {
  const T = Type.Record(Type.Number(), Type.String())
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 5', () => {
  const T = Type.Record(Type.Number(), Type.String())
  const R = Value.Clean(T, { a: 1 })
  Assert.IsEqual(R, {})
})
Test('Should Clean 6', () => {
  const T = Type.Record(Type.Number(), Type.String())
  const R = Value.Clean(T, { a: 1, 0: null })
  Assert.IsEqual(R, { 0: null })
})
// ----------------------------------------------------------------
// Additional Properties
// ----------------------------------------------------------------
Test('Should Clean 7', () => {
  const T = Type.Record(Type.Number(), Type.String(), {
    additionalProperties: Type.Boolean()
  })
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 8', () => {
  const T = Type.Record(Type.Number(), Type.String(), {
    additionalProperties: Type.Boolean()
  })
  const R = Value.Clean(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Clean 9', () => {
  const T = Type.Record(Type.Number(), Type.String(), {
    additionalProperties: Type.Boolean()
  })
  const R = Value.Clean(T, { 0: null })
  Assert.IsEqual(R, { 0: null })
})
// ----------------------------------------------------------------
// Additional Properties Discard
// ----------------------------------------------------------------
Test('Should Clean 10', () => {
  const T = Type.Record(Type.Number(), Type.String(), {
    additionalProperties: Type.Boolean()
  })
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 11', () => {
  const T = Type.Record(Type.Number(), Type.String(), {
    additionalProperties: Type.Boolean()
  })
  const R = Value.Clean(T, { a: null })
  Assert.IsEqual(R, {})
})
Test('Should Clean 12', () => {
  const T = Type.Record(Type.Number(), Type.String(), {
    additionalProperties: Type.Boolean()
  })
  const R = Value.Clean(T, { a: null, 0: null })
  Assert.IsEqual(R, { 0: null })
})
// ----------------------------------------------------------------
// Additional Properties Keep
// ----------------------------------------------------------------
Test('Should Clean 13', () => {
  const T = Type.Record(Type.Number(), Type.String(), {
    additionalProperties: Type.Boolean()
  })
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 14', () => {
  const T = Type.Record(Type.Number(), Type.String(), {
    additionalProperties: Type.Boolean()
  })
  const R = Value.Clean(T, { a: true })
  Assert.IsEqual(R, { a: true })
})
Test('Should Clean 15', () => {
  const T = Type.Record(Type.Number(), Type.String(), {
    additionalProperties: Type.Boolean()
  })
  const R = Value.Clean(T, { a: true, 0: null })
  Assert.IsEqual(R, { a: true, 0: null })
})
// ----------------------------------------------------------------
// Additional Properties: True
// ----------------------------------------------------------------
Test('Should Clean 16', () => {
  const T = Type.Record(Type.Integer(), Type.Number(), {
    additionalProperties: true
  })
  const R = Value.Clean(T, { x: 1, y: 2, z: 3 })
  Assert.IsEqual(R, { x: 1, y: 2, z: 3 })
})
// ----------------------------------------------------------------
// Additional Properties: Any
// ----------------------------------------------------------------
Test('Should Clean 17', () => {
  const T = Type.Record(Type.Integer(), Type.Number(), {
    additionalProperties: Type.Any()
  })
  const R = Value.Clean(T, { x: 1, y: 2, z: 3 })
  Assert.IsEqual(R, { x: 1, y: 2, z: 3 })
})
// ----------------------------------------------------------------
// Additional Properties: Unknown
// ----------------------------------------------------------------
Test('Should Clean 18', () => {
  const T = Type.Record(Type.Integer(), Type.Number(), {
    additionalProperties: Type.Unknown()
  })
  const R = Value.Clean(T, { x: 1, y: 2, z: 3 })
  Assert.IsEqual(R, { x: 1, y: 2, z: 3 })
})
// ----------------------------------------------------------------
// Additional Properties: Never
// ----------------------------------------------------------------
Test('Should Clean 19', () => {
  const T = Type.Record(Type.Integer(), Type.Number(), {
    additionalProperties: Type.Never()
  })
  const R = Value.Clean(T, { x: 1, y: 2, z: 3 })
  Assert.IsEqual(R, {})
})
