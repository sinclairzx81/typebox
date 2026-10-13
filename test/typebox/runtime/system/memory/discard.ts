import { Memory, Settings } from 'typebox/system'
import { Assert } from 'test'
import Guard from 'typebox/guard'

const Test = Assert.Context('System.Memory.Discard')

// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
Test('Should Discard 1', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const source = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { remove: true, value: 1 })
    const A = Memory.Discard(source, ['remove'])
    Assert.IsEqual(A.value, 1)
    Assert.NotHasPropertyKey(A, 'remove')
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Prototype Pollution Guards
// ------------------------------------------------------------------
Test('Should Discard 2', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const source: Record<PropertyKey, unknown> = { value: 1 }
    Object.defineProperty(source, '__proto__', { value: 2, enumerable: true })
    Object.defineProperty(source, 'constructor', { value: 3, enumerable: true })
    Object.defineProperty(source, 'prototype', { value: 4, enumerable: true })
    const A = Memory.Discard(source, [])
    Assert.IsEqual(Object.getPrototypeOf(A), Object.prototype)
    Assert.IsTrue(Guard.HasPropertyKey(A, '__proto__'))
    Assert.IsTrue(Guard.HasPropertyKey(A, 'constructor'))
    Assert.IsTrue(Guard.HasPropertyKey(A, 'prototype'))
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Symbols
// ------------------------------------------------------------------
Test('Should Discard 3', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const keep = Symbol('keep')
    const remove = Symbol('remove')
    const source = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { [keep]: 1, [remove]: 2 })
    const A = Memory.Discard(source, [remove])
    Assert.IsEqual(A[keep], 1)
    Assert.NotHasPropertyKey(A, remove)
    Assert.IsPropertyEnumerable(A, keep)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Shallow Copy
// ------------------------------------------------------------------
Test('Should Discard 4', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const child = { value: 1 }
    const source = { child, remove: true }
    const A = Memory.Discard(source, ['remove'])
    Assert.IsTrue(A !== source)
    Assert.IsTrue(A.child === child)
    Assert.NotHasPropertyKey(A, 'remove')
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Configuration Matrix
// ------------------------------------------------------------------
Test('Should Discard 5', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const key = Symbol('key')
    const source = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { remove: true, value: 1, [key]: 2 })
    const A = Memory.Discard(source, ['remove'])
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A[key], 2)
    Assert.NotHasPropertyKey(A, 'remove')
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Discard 6', () => {
  Settings.Set({ enumerableKind: true, immutableTypes: false })
  try {
    const key = Symbol('key')
    const source = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { remove: true, value: 1, [key]: 2 })
    const A = Memory.Discard(source, ['remove'])
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A[key], 2)
    Assert.NotHasPropertyKey(A, 'remove')
    Assert.IsPropertyEnumerable(A, '~kind')
    Assert.IsPropertyEnumerable(A, '~unsafe')
    Assert.IsPropertyEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Discard 7', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: true })
  try {
    const key = Symbol('key')
    const source = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { remove: true, value: 1, [key]: 2 })
    const A = Memory.Discard(source, ['remove'])
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A[key], 2)
    Assert.NotHasPropertyKey(A, 'remove')
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Discard 8', () => {
  Settings.Set({ enumerableKind: true, immutableTypes: true })
  try {
    const key = Symbol('key')
    const source = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { remove: true, value: 1, [key]: 2 })
    const A = Memory.Discard(source, ['remove'])
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A[key], 2)
    Assert.NotHasPropertyKey(A, 'remove')
    Assert.IsPropertyEnumerable(A, '~kind')
    Assert.IsPropertyEnumerable(A, '~unsafe')
    Assert.IsPropertyEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsFrozen(A)
  } finally {
    Settings.Reset()
  }
})
