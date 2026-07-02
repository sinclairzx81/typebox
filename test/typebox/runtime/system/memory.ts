import { Memory, Settings } from 'typebox/system'
import { Assert } from 'test'
import Type from 'typebox'

const Test = Assert.Context('System.Memory')

// ------------------------------------------------------------------
// Clone
// ------------------------------------------------------------------
Test('Should Clone 1', () => {
  const A = /xyz/
  const B = Memory.Clone(A)
  Assert.IsTrue(B instanceof RegExp)
  Assert.IsTrue(A !== B)
})
Test('Should Clone 2', () => {
  const A = [1, 2, 3]
  const B = Memory.Clone(A)
  Assert.IsEqual(B, A)
  Assert.IsTrue(A !== B)
})
Test('Should Clone 3', () => {
  const A = { x: 1, y: 2, z: 3 }
  const B = Memory.Clone(A)
  Assert.IsEqual(B, A)
  Assert.IsTrue(A !== B)
})
Test('Should Clone 4', () => {
  const A = 1
  const B = Memory.Clone(A)
  Assert.IsEqual(B, A)
  Assert.IsTrue(A === B)
})
// ------------------------------------------------------------------
// Create
// ------------------------------------------------------------------
Test('Should Create 1', () => {
  const A: any = Memory.Create({ x: 1 }, { y: 2 }, { z: 3 })
  Assert.IsEqual(A.x, 1)
  Assert.IsEqual(A.y, 2)
  Assert.IsEqual(A.z, 3)
})
// ------------------------------------------------------------------
// EnumerableKind
// ------------------------------------------------------------------
Test('Should Create 3', () => {
  Settings.Set({ enumerableKind: true })
  const A: any = Memory.Create({ x: 1 }, { y: 2 }, { z: 3 })
  Assert.IsEqual(A.x, 1)
  Assert.IsEqual(A.y, 2)
  Assert.IsEqual(A.z, 3)
  A.x = 123
  Assert.IsEqual(A.x, 123)
  Settings.Reset()
})
// ------------------------------------------------------------------
// ImmutableTypes
// ------------------------------------------------------------------
Test('Should Create 4', () => {
  Settings.Set({ immutableTypes: true })
  const A: any = Memory.Create({ x: 1 }, { y: 2 }, { z: 3 })
  Assert.IsEqual(A.x, 1)
  Assert.IsEqual(A.y, 2)
  Assert.IsEqual(A.z, 3)
  Assert.Throws(() => {
    A.x = 123
  })
  Settings.Reset()
})
// ------------------------------------------------------------------
// UnsafePropertyKey
//
// Note: If these tests fail, ensure you update to Deno to 2.9.0. The
// Deno team has made changes to __proto__ handling that differs to
// earlier versions. The following tests are written for 2.9.0.
// ------------------------------------------------------------------
Test('Should Create 5', () => {
  const A = { '~kind': 'test', '__proto__': 1 }
  const B = Memory.Clone(A)
  Assert.HasPropertyKey(B, '~kind')
  Assert.HasPropertyKey(B, '__proto__')
  Assert.NotEqual(B['__proto__'], 1)
})
Test('Should Create 6', () => {
  const A = { '~kind': 'test', 'constructor': 1 }
  const B = Memory.Clone(A)
  Assert.HasPropertyKey(B, '~kind')
  Assert.HasPropertyKey(B, 'constructor')
  Assert.NotEqual(B['constructor'], 1)
})
Test('Should Create 7', () => {
  const A = { '~kind': 'test', 'prototype': 1 }
  const B = Memory.Clone(A)
  Assert.HasPropertyKey(B, '~kind')
  Assert.NotHasPropertyKey(B, 'prototype')
})
// ------------------------------------------------------------------
// TypedObject (Kind + Unsafe)
// ------------------------------------------------------------------
Test('Should Create 8', () => {
  const A = Type.String()
  const B = Memory.Clone(A)
  Assert.NotPropertyIsEnumerable(B, '~kind')
})
Test('Should Create 9', () => {
  const A = Type.Unsafe({ type: 'Date' })
  const B = Memory.Clone(A)
  Assert.NotPropertyIsEnumerable(B, '~unsafe')
})
Test('Should Create 10', () => {
  Settings.Set({ enumerableKind: true })
  const A = Type.String()
  const B = Memory.Clone(A)
  Assert.PropertyIsEnumerable(B, '~kind')
  Settings.Reset()
})
Test('Should Create 11', () => {
  Settings.Set({ enumerableKind: true })
  const A = Type.Unsafe({ type: 'Date' })
  const B = Memory.Clone(A)
  Assert.PropertyIsEnumerable(B, '~unsafe')
  Settings.Reset()
})
