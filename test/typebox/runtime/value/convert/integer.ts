import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Convert.Integer')

Test('Should Convert 1', () => {
  const T = Type.Integer()
  const R = Value.Convert(T, '3.14')
  Assert.IsEqual(R, 3)
})
Test('Should Convert 2', () => {
  const T = Type.Integer()
  const R = Value.Convert(T, '42')
  Assert.IsEqual(R, 42)
})
Test('Should Convert 3', () => {
  const T = Type.Integer()
  const R = Value.Convert(T, true)
  Assert.IsEqual(R, 1)
})
Test('Should Convert 4', () => {
  const T = Type.Integer()
  const R = Value.Convert(T, false)
  Assert.IsEqual(R, 0)
})
Test('Should Convert 5', () => {
  const T = Type.Integer()
  const R = Value.Convert(T, 3.14)
  Assert.IsEqual(R, 3)
})
// ----------------------------------------------------------
// Casts
// ----------------------------------------------------------
Test('Should Convert 6', () => {
  const value = 'hello'
  const result = Value.Convert(Type.Integer(), value)
  Assert.IsEqual(result, 'hello')
})
Test('Should Convert 7', () => {
  const value = '3.14'
  const result = Value.Convert(Type.Integer(), value)
  Assert.IsEqual(result, 3)
})
Test('Should Convert 8', () => {
  const value = '-0'
  const result = Value.Convert(Type.Integer(), value)
  Assert.IsEqual(result, -0)
})
Test('Should Convert 9', () => {
  const value = '-100'
  const result = Value.Convert(Type.Integer(), value)
  Assert.IsEqual(result, -100)
})
Test('Should Convert 10', () => {
  const value = 42
  const result = Value.Convert(Type.Integer(), value)
  Assert.IsEqual(result, 42)
})
Test('Should Convert 11', () => {
  const value = true
  const result = Value.Convert(Type.Integer(), value)
  Assert.IsEqual(result, 1)
})
Test('Should Convert 12', () => {
  const value = false
  const result = Value.Convert(Type.Integer(), value)
  Assert.IsEqual(result, 0)
})
Test('Should Convert 13', () => {
  const value = {}
  const result = Value.Convert(Type.Integer(), value)
  Assert.IsEqual(result, {})
})
Test('Should Convert 14', () => {
  const value = [] as any[]
  const result = Value.Convert(Type.Integer(), value)
  Assert.IsEqual(result, [])
})
// ----------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1147
// ----------------------------------------------------------
Test('Should Convert 15', () => {
  const N = 1738213389080
  const R = Value.Convert(Type.Integer(), N)
  Assert.IsEqual(R, N)
})
Test('Should Convert 16', () => {
  const N = 1738213389080.5555
  const R = Value.Convert(Type.Integer(), N)
  Assert.IsEqual(R, 1738213389080)
})
Test('Should Convert 17', () => {
  const N = '1738213389080'
  const R = Value.Convert(Type.Integer(), N)
  Assert.IsEqual(R, 1738213389080)
})
Test('Should Convert 18', () => {
  const N = '1738213389080.555'
  const R = Value.Convert(Type.Integer(), N)
  Assert.IsEqual(R, 1738213389080)
})
