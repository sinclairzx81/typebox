import { Memory, Settings } from 'typebox/system'
import { Assert } from 'test'
import Guard from 'typebox/guard'

const Test = Assert.Context('System.Memory.Update')

// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
Test('Should Update 1', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const current = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1 })
    const A = Memory.Update(current, {}, { updated: true })
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A.updated, true)
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsNonFrozen(current)
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Property Enumerability
// ------------------------------------------------------------------
Test('Should Update 2', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const current = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1 })
    const A = Memory.Update(current, {}, { '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine', value: 2 })
    Assert.IsPropertyNonEnumerable(current, '~kind')
    Assert.IsPropertyNonEnumerable(current, '~unsafe')
    Assert.IsPropertyNonEnumerable(current, '~refine')
    Assert.IsPropertyEnumerable(A, '~kind')
    Assert.IsPropertyEnumerable(A, '~unsafe')
    Assert.IsPropertyEnumerable(A, '~refine')
    Assert.HasPropertyKey(A, 'value')
    Assert.IsEqual(A.value, 2)
  } finally {
    Settings.Reset()
  }
})
Test('Should Update 3', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const current = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1 })
    const A = Memory.Update(current, { value: 2 }, {})
    Assert.IsPropertyEnumerable(current, 'value')
    Assert.IsPropertyNonEnumerable(A, 'value')
    Assert.IsEqual(A.value, 2)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Prototype Pollution Guards
// ------------------------------------------------------------------
Test('Should Update 4', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const unsafe: Record<PropertyKey, unknown> = {}
    Object.defineProperty(unsafe, '__proto__', { value: 1, enumerable: true })
    Object.defineProperty(unsafe, 'constructor', { value: 2, enumerable: true })
    Object.defineProperty(unsafe, 'prototype', { value: 3, enumerable: true })
    const hidden = Memory.Update({}, unsafe, {})
    const enumerable = Memory.Update({}, {}, unsafe)
    Assert.IsEqual(Object.getPrototypeOf(hidden), Object.prototype)
    Assert.IsEqual(Object.getPrototypeOf(enumerable), Object.prototype)
    Assert.IsFalse(Guard.HasPropertyKey(hidden, '__proto__'))
    Assert.IsFalse(Guard.HasPropertyKey(hidden, 'constructor'))
    Assert.IsFalse(Guard.HasPropertyKey(hidden, 'prototype'))
    Assert.IsFalse(Guard.HasPropertyKey(enumerable, '__proto__'))
    Assert.IsFalse(Guard.HasPropertyKey(enumerable, 'constructor'))
    Assert.IsFalse(Guard.HasPropertyKey(enumerable, 'prototype'))
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Symbols
// ------------------------------------------------------------------
Test('Should Update 5', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const currentKey = Symbol('current')
    const hiddenKey = Symbol('hidden')
    const enumerableKey = Symbol('enumerable')
    const current = Memory.Create(
      { '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' },
      { [currentKey]: 1 }
    )
    const A = Memory.Update(current, { [hiddenKey]: 2 }, { [enumerableKey]: 3 })
    Assert.IsEqual(A[currentKey], 1)
    Assert.IsEqual(A[hiddenKey], 2)
    Assert.IsEqual(A[enumerableKey], 3)
    Assert.IsPropertyEnumerable(A, currentKey)
    Assert.IsPropertyNonEnumerable(A, hiddenKey)
    Assert.IsPropertyEnumerable(A, enumerableKey)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Property Descriptors
// ------------------------------------------------------------------
Test('Should Update 6', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const current = { value: 1, computed: 2 }
    Object.defineProperty(current, 'value', { configurable: false, enumerable: true, value: 1, writable: false })
    Object.defineProperty(current, 'computed', { configurable: false, enumerable: true, get: () => 2 })
    const A = Memory.Update(current, {}, {})
    Assert.HasPropertyKey(A, 'value')
    Assert.IsEqual(A.value, 1)
    Assert.IsPropertyEnumerable(A, 'value')
    Assert.Throws(() => Object.defineProperty(A, 'value', { value: 2 }))
    Assert.HasPropertyKey(A, 'computed')
    Assert.IsEqual(A.computed, 2)
    Assert.IsPropertyEnumerable(A, 'computed')
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Configuration Matrix
// ------------------------------------------------------------------
Test('Should Update 7', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const key = Symbol('key')
    const current = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1, [key]: 2 })
    const A = Memory.Update(current, {}, { updated: true })
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A.updated, true)
    Assert.IsEqual(A[key], 2)
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsNonFrozen(current)
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Update 8', () => {
  Settings.Set({ enumerableKind: true, immutableTypes: false })
  try {
    const key = Symbol('key')
    const current = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1, [key]: 2 })
    const A = Memory.Update(current, {}, { updated: true })
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A.updated, true)
    Assert.IsEqual(A[key], 2)
    Assert.IsPropertyEnumerable(A, '~kind')
    Assert.IsPropertyEnumerable(A, '~unsafe')
    Assert.IsPropertyEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsNonFrozen(current)
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Update 9', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: true })
  try {
    const key = Symbol('key')
    const current = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1, [key]: 2 })
    const A = Memory.Update(current, {}, { updated: true })
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A.updated, true)
    Assert.IsEqual(A[key], 2)
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsFrozen(current)
    Assert.IsFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Update 10', () => {
  Settings.Set({ enumerableKind: true, immutableTypes: true })
  try {
    const key = Symbol('key')
    const current = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1, [key]: 2 })
    const A = Memory.Update(current, {}, { updated: true })
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A.updated, true)
    Assert.IsEqual(A[key], 2)
    Assert.IsPropertyEnumerable(A, '~kind')
    Assert.IsPropertyEnumerable(A, '~unsafe')
    Assert.IsPropertyEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsFrozen(current)
    Assert.IsFrozen(A)
  } finally {
    Settings.Reset()
  }
})
