import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Intersect')

Test('Should Repair 1', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const V = Value.Repair(T, 1)
  Assert.IsEqual(V, { x: 0, y: 0 })
})
Test('Should Repair 2', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ])
  const V = Value.Repair(T, { x: 1 })
  Assert.IsEqual(V, { x: 1, y: 0 })
})
Test('Should Repair 3', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number({ default: 42 }) })
  ])
  const V = Value.Repair(T, { x: 1 })
  Assert.IsEqual(V, { x: 1, y: 42 })
})
Test('Should Repair 4', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.String() })
  ])
  Assert.Throws(() => Value.Repair(T, { x: 1 }))
})
Test('Should Repair 5', () => {
  const T = Type.Intersect([
    Type.Number(),
    Type.String()
  ])
  Assert.Throws(() => Value.Repair(T, { x: 1 }))
})
Test('Should Repair 6', () => {
  const T = Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Number({ default: 1000 }) })
  ])
  const V = Value.Repair(T, null)
  Assert.IsEqual(V, { x: 1000 })
})
Test('Should Repair 7', () => {
  // Should use first intersected default for equivalent sub schemas
  const T = Type.Intersect([
    Type.Number(), // this one is first
    Type.Number({ default: 1000 })
  ])
  const V = Value.Repair(T, null)
  Assert.IsEqual(V, 0)
})
Test('Should Repair 8', () => {
  const T = Type.Intersect([
    Type.Number(),
    Type.Number({ default: 1000 })
  ])
  const V = Value.Repair(T, 2000)
  Assert.IsEqual(V, 2000)
})

// ----------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1264
// ----------------------------------------------------------------
Test('Should Repair 9', () => {
  const T = Type.Intersect([
    Type.Object({}),
    Type.Object({
      name: Type.String(),
      age: Type.Optional(Type.Number()),
      location: Type.Object({
        lat: Type.Number(),
        long: Type.Number()
      }),
      greeting: Type.String()
    })
  ])
  const V0 = Value.Repair(T, { greeting: 'Hello' })
  const V1 = Value.Repair(T, { location: null, greeting: 'Hello' })
  const V2 = Value.Repair(T, { location: { lat: 1 }, greeting: 'Hello' })
  const V3 = Value.Repair(T, { location: { lat: 1, long: 1 }, greeting: 'Hello' })

  Assert.IsEqual(V0, { name: '', location: { lat: 0, long: 0 }, greeting: 'Hello' })
  Assert.IsEqual(V1, { name: '', location: { lat: 0, long: 0 }, greeting: 'Hello' })
  Assert.IsEqual(V2, { name: '', location: { lat: 1, long: 0 }, greeting: 'Hello' })
  Assert.IsEqual(V3, { name: '', location: { lat: 1, long: 1 }, greeting: 'Hello' })
})

// --------------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1269#issuecomment-2993924180
// --------------------------------------------------------------------------
Test('Should Repair 10', () => {
  const T = Type.Intersect([Type.Record(Type.TemplateLiteral('x-${string}'), Type.Unknown()), Type.Object({ name: Type.String() })])
  const R = Value.Repair(T, {})
  Assert.IsEqual(R, { name: '' })
})
