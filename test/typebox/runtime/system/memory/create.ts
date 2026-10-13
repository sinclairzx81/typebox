import { Memory, Settings } from 'typebox/system'
import { Assert } from 'test'

const Test = Assert.Context('System.Memory.Create')

// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
Test('Should Create 1', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const A = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1 })
    Assert.IsEqual(A.value, 1)
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
Test('Should Create 2', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const A = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1 }, { option: 2 })
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A.option, 2)
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Symbols
// ------------------------------------------------------------------
Test('Should Create 3', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const key = Symbol('key')
    const A = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { [key]: 1, value: 2 })
    Assert.IsEqual(A[key], 1)
    Assert.IsPropertyEnumerable(A, key)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Configuration Matrix
// ------------------------------------------------------------------
Test('Should Create 4', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const key = Symbol('key')
    const A = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1, [key]: 3 }, { option: 2 })
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A.option, 2)
    Assert.IsEqual(A[key], 3)
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Create 5', () => {
  Settings.Set({ enumerableKind: true, immutableTypes: false })
  try {
    const key = Symbol('key')
    const A = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1, [key]: 3 }, { option: 2 })
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A.option, 2)
    Assert.IsEqual(A[key], 3)
    Assert.IsPropertyEnumerable(A, '~kind')
    Assert.IsPropertyEnumerable(A, '~unsafe')
    Assert.IsPropertyEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Create 6', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: true })
  try {
    const key = Symbol('key')
    const A = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1, [key]: 3 }, { option: 2 })
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A.option, 2)
    Assert.IsEqual(A[key], 3)
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Create 7', () => {
  Settings.Set({ enumerableKind: true, immutableTypes: true })
  try {
    const key = Symbol('key')
    const A = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe', '~refine': 'refine' }, { value: 1, [key]: 3 }, { option: 2 })
    Assert.IsEqual(A.value, 1)
    Assert.IsEqual(A.option, 2)
    Assert.IsEqual(A[key], 3)
    Assert.IsPropertyEnumerable(A, '~kind')
    Assert.IsPropertyEnumerable(A, '~unsafe')
    Assert.IsPropertyEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, key)
    Assert.IsFrozen(A)
  } finally {
    Settings.Reset()
  }
})
