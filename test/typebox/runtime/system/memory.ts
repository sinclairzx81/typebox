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
Test('Should Create 5', () => {
  const A: any = Memory.Create({ x: 1 }, { y: 2 }, { z: 3 })
  Assert.IsEqual(A.x, 1)
  Assert.IsEqual(A.y, 2)
  Assert.IsEqual(A.z, 3)
})
// ------------------------------------------------------------------
// EnumerableKind
// ------------------------------------------------------------------
Test('Should Create 6', () => {
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
// UnsafePropertyKey
//
// Note: If these tests fail, ensure you update to Deno to 2.9.0. The
// Deno team has made changes to __proto__ handling that differs to
// earlier versions. The following tests are written for 2.9.0.
// ------------------------------------------------------------------
Test('Should Create 7', () => {
  const A = { '~kind': 'test', '__proto__': 1 }
  const B = Memory.Clone(A)
  Assert.HasPropertyKey(B, '~kind')
  Assert.HasPropertyKey(B, '__proto__')
  Assert.NotEqual(B['__proto__'], 1)
})
Test('Should Create 8', () => {
  const A = { '~kind': 'test', 'constructor': 1 }
  const B = Memory.Clone(A)
  Assert.HasPropertyKey(B, '~kind')
  Assert.HasPropertyKey(B, 'constructor')
  Assert.NotEqual(B['constructor'], 1)
})
Test('Should Create 9', () => {
  const A = { '~kind': 'test', 'prototype': 1 }
  const B = Memory.Clone(A)
  Assert.HasPropertyKey(B, '~kind')
  Assert.NotHasPropertyKey(B, 'prototype')
})
// ------------------------------------------------------------------
// TypedObject (Kind + Unsafe)
// ------------------------------------------------------------------
Test('Should Create 10', () => {
  const A = Type.String()
  const B = Memory.Clone(A)
  Assert.NotPropertyIsEnumerable(B, '~kind')
})
Test('Should Create 11', () => {
  const A = Type.Unsafe({ type: 'Date' })
  const B = Memory.Clone(A)
  Assert.NotPropertyIsEnumerable(B, '~unsafe')
})
Test('Should Create 12', () => {
  Settings.Set({ enumerableKind: true })
  const A = Type.String()
  const B = Memory.Clone(A)
  Assert.PropertyIsEnumerable(B, '~kind')
  Settings.Reset()
})
Test('Should Create 13', () => {
  Settings.Set({ enumerableKind: true })
  const A = Type.Unsafe({ type: 'Date' })
  const B = Memory.Clone(A)
  Assert.PropertyIsEnumerable(B, '~unsafe')
  Settings.Reset()
})
// ------------------------------------------------------------------
// ImmutableTypes: Create
// ------------------------------------------------------------------
Test('Should Create 14', () => {
  Settings.Set({ immutableTypes: true })
  const A: any = Memory.Create({ x: 1 }, { y: 2 }, { z: 3 })
  Assert.IsEqual(A.x, 1)
  Assert.IsEqual(A.y, 2)
  Assert.IsEqual(A.z, 3)
  Assert.Throws(() => {
    A.x = 2
  })
  Settings.Reset()
})
// ------------------------------------------------------------------
// ImmutableTypes: Update
// ------------------------------------------------------------------
Test('Should Update 15', () => {
  Settings.Set({ immutableTypes: true })
  const A: any = Memory.Update({ x: 1 }, { y: 2 }, { z: 3 })
  Assert.IsEqual(A.x, 1)
  Assert.IsEqual(A.y, 2)
  Assert.IsEqual(A.z, 3)
  Assert.IsTrue(Object.isFrozen(A))
  Assert.Throws(() => {
    A.x = 2
  })
  Settings.Reset()
})
Test('Should Update 16', () => {
  Settings.Set({ immutableTypes: true })
  const A: any = Memory.Update({ x: 1 }, { x: 2 }, { y: 2 })
  Assert.IsEqual(A.x, 2)
  Assert.IsEqual(A.y, 2)
  Assert.IsTrue(Object.isFrozen(A))
  Assert.Throws(() => {
    A.x = 3
  })
  Settings.Reset()
})
// ------------------------------------------------------------------
// ImmutableTypes: Discard
// ------------------------------------------------------------------
Test('Should Update 17', () => {
  Settings.Set({ immutableTypes: true })
  const A: any = Memory.Create({ x: 1 }, { y: 2 }, { z: 3 })
  Assert.IsEqual(A.x, 1)
  Assert.IsEqual(A.y, 2)
  Assert.IsEqual(A.z, 3)
  Assert.IsTrue(Object.isFrozen(A))
  // Discard
  const B: any = Memory.Discard(A, ['x', 'y'])
  Assert.NotHasPropertyKey(B, 'x')
  Assert.NotHasPropertyKey(B, 'y')
  Assert.IsEqual(A.z, 3)
  Assert.IsTrue(Object.isFrozen(B))
  Assert.Throws(() => {
    B.x = 1
  })
  Settings.Reset()
})
