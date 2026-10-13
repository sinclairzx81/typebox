import { Memory, Settings } from 'typebox/system'
import { Assert } from 'test'
import Guard from 'typebox/guard'

const Test = Assert.Context('System.Memory.Clone')

// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
Test('Should Clone 1', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const source = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1 })
    const A = Memory.Clone(source)
    Assert.IsTrue(A !== source)
    Assert.IsEqual(A.value, 1)
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsNonFrozen(source)
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Prototype Pollution Guards
// ------------------------------------------------------------------
Test('Should Clone 2', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const source: Record<PropertyKey, unknown> = { value: 1 }
    Object.defineProperty(source, '__proto__', { value: 2, enumerable: true })
    Object.defineProperty(source, 'constructor', { value: 3, enumerable: true })
    Object.defineProperty(source, 'prototype', { value: 4, enumerable: true })
    const A = Memory.Clone(source)
    Assert.IsEqual(Object.getPrototypeOf(A), Object.prototype)
    Assert.IsFalse(Guard.HasPropertyKey(A, '__proto__'))
    Assert.IsFalse(Guard.HasPropertyKey(A, 'constructor'))
    Assert.IsFalse(Guard.HasPropertyKey(A, 'prototype'))
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Symbols
// ------------------------------------------------------------------
Test('Should Clone 3', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const key = Symbol('key')
    const source = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { [key]: 1 })
    const A = Memory.Clone(source)
    Assert.IsTrue(A !== source)
    Assert.IsEqual(A[key], 1)
    Assert.IsPropertyEnumerable(A, key)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Shallow Copy
// ------------------------------------------------------------------
Test('Should Clone 4', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const child = { value: 1 }
    const source = { child }
    const A = Memory.Clone(source)
    Assert.IsTrue(A !== source)
    Assert.IsTrue(A.child === child)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Configuration Matrix
// ------------------------------------------------------------------
Test('Should Clone 5', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const key = Symbol('key')
    const source = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1, [key]: 2 })
    const A = Memory.Clone(source)
    Assert.IsTrue(A !== source)
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A[key], 2)
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsNonFrozen(source)
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Clone 6', () => {
  Settings.Set({ enumerableKind: true, immutableTypes: false })
  try {
    const key = Symbol('key')
    const source = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1, [key]: 2 })
    const A = Memory.Clone(source)
    Assert.IsTrue(A !== source)
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A[key], 2)
    Assert.IsPropertyEnumerable(A, '~kind')
    Assert.IsPropertyEnumerable(A, '~unsafe')
    Assert.IsPropertyEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsNonFrozen(source)
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Clone 7', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: true })
  try {
    const key = Symbol('key')
    const source = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1, [key]: 2 })
    const A = Memory.Clone(source)
    Assert.IsTrue(A !== source)
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A[key], 2)
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsFrozen(source)
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Clone 8', () => {
  Settings.Set({ enumerableKind: true, immutableTypes: true })
  try {
    const key = Symbol('key')
    const source = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1, [key]: 2 })
    const A = Memory.Clone(source)
    Assert.IsTrue(A !== source)
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A[key], 2)
    Assert.IsPropertyEnumerable(A, '~kind')
    Assert.IsPropertyEnumerable(A, '~unsafe')
    Assert.IsPropertyEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsFrozen(source)
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
