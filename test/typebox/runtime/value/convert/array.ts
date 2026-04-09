import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Array')

Test('Should Convert 1', () => {
  const T = Type.Array(Type.Number())
  const R = Value.Convert(T, [1, 3.14, '1', '3.14', true, false, 'true', 'false', 'hello'])
  Assert.IsEqual(R, [1, 3.14, 1, 3.14, 1, 0, 1, 0, 'hello'])
})
Test('Should Convert 2', () => {
  const T = Type.Array(Type.Boolean())
  const R = Value.Convert(T, [1, 3.14, '1', '3.14', true, false, 'true', 'false', 'hello'])
  Assert.IsEqual(R, [true, 3.14, true, '3.14', true, false, true, false, 'hello'])
})
Test('Should Convert 3', () => {
  const T = Type.Array(Type.String())
  const R = Value.Convert(T, [1, 3.14, '1', '3.14', true, false, 'true', 'false', 'hello'])
  Assert.IsEqual(R, ['1', '3.14', '1', '3.14', 'true', 'false', 'true', 'false', 'hello'])
})
// ------------------------------------------------------------------
// Added support for Array coercion
//
// https://github.com/sinclairzx81/typebox/issues/1469
// ------------------------------------------------------------------
Test('Should Convert 4', () => {
  const T = Type.Array(Type.Number())
  const R = Value.Convert(T, '1')
  Assert.IsEqual(R, [1])
})
Test('Should Convert 5', () => {
  const T = Type.Array(Type.Number())
  const R = Value.Convert(T, [])
  Assert.IsEqual(R, [])
})
Test('Should Convert 6', () => {
  const T = Type.Array(Type.Number())
  const R = Value.Convert(T, 42)
  Assert.IsEqual(R, [42])
})
Test('Should Convert 7', () => {
  const T = Type.Array(Type.Boolean())
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, [true])
})
Test('Should Convert 8', () => {
  const T = Type.Array(Type.Null())
  const R = Value.Convert(T, null)
  Assert.IsEqual(R, [null])
})
Test('Should Convert 9', () => {
  const T = Type.Array(Type.Unknown())
  const R = Value.Convert(T, undefined)
  Assert.IsEqual(R, [undefined])
})
Test('Should Convert 10', () => {
  const T = Type.Array(Type.BigInt())
  const R = Value.Convert(T, 1n)
  Assert.IsEqual(R, [1n])
})
Test('Should Convert 11', () => {
  const T = Type.Array(Type.Object({}))
  const R = Value.Convert(T, {})
  Assert.IsEqual(R, [{}])
})
Test('Should Convert 12', () => {
  const T = Type.Array(Type.Object({ x: Type.Number() }))
  const R = Value.Convert(T, { x: 1 })
  Assert.IsEqual(R, [{ x: 1 }])
})
Test('Should Convert 13', () => {
  const T = Type.Array(Type.Number())
  const R = Value.Convert(T, '42')
  Assert.IsEqual(R, [42])
})
Test('Should Convert 14', () => {
  const T = Type.Array(Type.Boolean())
  const R = Value.Convert(T, 'true')
  Assert.IsEqual(R, [true])
})
Test('Should Convert 15', () => {
  const T = Type.Array(Type.Boolean())
  const R = Value.Convert(T, 0)
  Assert.IsEqual(R, [false])
})
Test('Should Convert 16', () => {
  const T = Type.Array(Type.Number())
  const R = Value.Convert(T, 'hello')
  Assert.IsEqual(R, ['hello'])
})
Test('Should Convert 17', () => {
  const T = Type.Array(Type.Number())
  const R = Value.Convert(T, [1])
  Assert.IsEqual(R, [1])
})
Test('Should Convert 18', () => {
  const T = Type.Array(Type.Array(Type.Number()))
  const R = Value.Convert(T, [1, 2, 3])
  Assert.IsTrue(Value.Check(T, R))
})
Test('Should Convert 19', () => {
  const T = Type.Array(Type.Number())
  const R = Value.Convert(T, { 0: 1, length: 1 })
  Assert.IsEqual(R, [{ 0: 1, length: 1 }])
})
Test('Should Convert 20', () => {
  const T = Type.Array(Type.Array(Type.Number()))
  const R = Value.Convert(T, 42)
  Assert.IsTrue(Value.Check(T, R))
})
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
Test('Should Convert 21', () => {
  const T = Type.Array(Type.Union([Type.Number(), Type.String()]))
  const R = Value.Convert(T, 1)
  Assert.IsTrue(Value.Check(T, R))
})
Test('Should Convert 22', () => {
  const T = Type.Array(Type.Union([Type.Number(), Type.String()]))
  const R = Value.Convert(T, 'hello')
  Assert.IsTrue(Value.Check(T, R))
})
Test('Should Convert 23', () => {
  const T = Type.Array(Type.Union([Type.Number(), Type.String()]))
  const R = Value.Convert(T, [1, 'hello', true, '3.14'])
  Assert.IsTrue(Value.Check(T, R))
})
Test('Should Convert 24', () => {
  const T = Type.Union([Type.Array(Type.Number()), Type.String()])
  const R = Value.Convert(T, '1')
  Assert.IsTrue(Value.Check(T, R))
})
Test('Should Convert 25', () => {
  const T = Type.Array(Type.Union([Type.Array(Type.Number()), Type.String()]))
  const R = Value.Convert(T, 42)
  Assert.IsTrue(Value.Check(T, R))
})
// ------------------------------------------------------------------
// Embedded Intersect
// ------------------------------------------------------------------
Test('Should Convert 26', () => {
  const T = Type.Array(Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })]))
  const R = Value.Convert(T, { x: 1, y: 2 })
  Assert.IsTrue(Value.Check(T, R))
})
Test('Should Convert 27', () => {
  const T = Type.Array(Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })]))
  const R = Value.Convert(T, [{ x: '1', y: '2' }, { x: '3', y: '4' }])
  Assert.IsTrue(Value.Check(T, R))
})
Test('Should Convert 28', () => {
  const T = Type.Intersect([Type.Array(Type.Number()), Type.Array(Type.Number())])
  const R = Value.Convert(T, 42)
  Assert.IsTrue(Value.Check(T, R))
})
Test('Should Convert 29', () => {
  const T = Type.Intersect([Type.Array(Type.Number()), Type.Object({ x: Type.Number() })])
  const R = Value.Convert(T, 42)
  Assert.IsFalse(Value.Check(T, R))
})
