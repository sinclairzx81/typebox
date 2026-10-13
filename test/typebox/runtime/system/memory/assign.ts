import { Memory, Settings } from 'typebox/system'
import { Assert } from 'test'
import Guard from 'typebox/guard'

const Test = Assert.Context('System.Memory.Assign')

// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
Test('Should Assign 1', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const left = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe' }, { left: 1 })
    const right = Memory.Create({ '~refine': 'refine' }, { right: 2 })
    const A = Memory.Assign(left, right)
    Assert.IsEqual(A.left, 1)
    Assert.IsEqual(A.right, 2)
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
Test('Should Assign 2', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const left: Record<PropertyKey, unknown> = { value: 1 }
    Object.defineProperty(left, '__proto__', { value: 2, enumerable: true })
    Object.defineProperty(left, 'constructor', { value: 3, enumerable: true })
    Object.defineProperty(left, 'prototype', { value: 4, enumerable: true })
    const A = Memory.Assign(left, { right: 5 })
    Assert.IsEqual(Object.getPrototypeOf(A), Object.prototype)
    Assert.IsTrue(Guard.HasPropertyKey(A, '__proto__'))
    Assert.IsTrue(Guard.HasPropertyKey(A, 'constructor'))
    Assert.IsTrue(Guard.HasPropertyKey(A, 'prototype'))
    Assert.IsEqual(A.right, 5)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Symbols
// ------------------------------------------------------------------
Test('Should Assign 3', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const leftKey = Symbol('left')
    const rightKey = Symbol('right')
    const left = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe' }, { [leftKey]: 1 })
    const right = Memory.Create({ '~refine': 'refine' }, { [rightKey]: 2 })
    const A = Memory.Assign(left, right)
    Assert.IsEqual(A[leftKey], 1)
    Assert.IsEqual(A[rightKey], 2)
    Assert.IsPropertyEnumerable(A, leftKey)
    Assert.IsPropertyEnumerable(A, rightKey)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Property Descriptors
// ------------------------------------------------------------------
Test('Should Assign 4', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const left = { hidden: 1, shared: 1 }
    Object.defineProperty(left, 'hidden', { configurable: false, enumerable: false, value: 1, writable: false })
    Object.defineProperty(left, 'shared', { configurable: false, enumerable: true, value: 1, writable: false })
    const right = { shared: 2 }
    Object.defineProperty(right, 'shared', { configurable: false, enumerable: false, value: 2, writable: false })
    const A = Memory.Assign(left, right)
    Assert.HasPropertyKey(A, 'hidden')
    Assert.IsEqual(A.hidden, 1)
    Assert.IsPropertyNonEnumerable(A, 'hidden')
    Assert.Throws(() => Object.defineProperty(A, 'hidden', { value: 2 }))
    Assert.HasPropertyKey(A, 'shared')
    Assert.IsEqual(A.shared, 2)
    Assert.IsPropertyNonEnumerable(A, 'shared')
    Assert.Throws(() => Object.defineProperty(A, 'shared', { value: 3 }))
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Configuration Matrix
// ------------------------------------------------------------------
Test('Should Assign 5', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: false })
  try {
    const leftKey = Symbol('left')
    const rightKey = Symbol('right')
    const left = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe' }, { left: 1, [leftKey]: 3 })
    const right = Memory.Create({ '~refine': 'refine' }, { right: 2, [rightKey]: 4 })
    const A = Memory.Assign(left, right)
    Assert.IsEqual(A.left, 1)
    Assert.IsEqual(A.right, 2)
    Assert.IsEqual(A[leftKey], 3)
    Assert.IsEqual(A[rightKey], 4)
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, leftKey)
    Assert.IsPropertyEnumerable(A, rightKey)
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Assign 6', () => {
  Settings.Set({ enumerableKind: true, immutableTypes: false })
  try {
    const leftKey = Symbol('left')
    const rightKey = Symbol('right')
    const left = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe' }, { left: 1, [leftKey]: 3 })
    const right = Memory.Create({ '~refine': 'refine' }, { right: 2, [rightKey]: 4 })
    const A = Memory.Assign(left, right)
    Assert.IsEqual(A.left, 1)
    Assert.IsEqual(A.right, 2)
    Assert.IsEqual(A[leftKey], 3)
    Assert.IsEqual(A[rightKey], 4)
    Assert.IsPropertyEnumerable(A, '~kind')
    Assert.IsPropertyEnumerable(A, '~unsafe')
    Assert.IsPropertyEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, leftKey)
    Assert.IsPropertyEnumerable(A, rightKey)
    Assert.IsNonFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Assign 7', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: true })
  try {
    const leftKey = Symbol('left')
    const rightKey = Symbol('right')
    const left = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe' }, { left: 1, [leftKey]: 3 })
    const right = Memory.Create({ '~refine': 'refine' }, { right: 2, [rightKey]: 4 })
    const A = Memory.Assign(left, right)
    Assert.IsEqual(A.left, 1)
    Assert.IsEqual(A.right, 2)
    Assert.IsEqual(A[leftKey], 3)
    Assert.IsEqual(A[rightKey], 4)
    Assert.IsPropertyNonEnumerable(A, '~kind')
    Assert.IsPropertyNonEnumerable(A, '~unsafe')
    Assert.IsPropertyNonEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, leftKey)
    Assert.IsPropertyEnumerable(A, rightKey)
    Assert.IsFrozen(A)
  } finally {
    Settings.Reset()
  }
})
Test('Should Assign 8', () => {
  Settings.Set({ enumerableKind: true, immutableTypes: true })
  try {
    const leftKey = Symbol('left')
    const rightKey = Symbol('right')
    const left = Memory.Create({ '~kind': 'kind', '~unsafe': 'unsafe' }, { left: 1, [leftKey]: 3 })
    const right = Memory.Create({ '~refine': 'refine' }, { right: 2, [rightKey]: 4 })
    const A = Memory.Assign(left, right)
    Assert.IsEqual(A.left, 1)
    Assert.IsEqual(A.right, 2)
    Assert.IsEqual(A[leftKey], 3)
    Assert.IsEqual(A[rightKey], 4)
    Assert.IsPropertyEnumerable(A, '~kind')
    Assert.IsPropertyEnumerable(A, '~unsafe')
    Assert.IsPropertyEnumerable(A, '~refine')
    Assert.IsPropertyEnumerable(A, leftKey)
    Assert.IsPropertyEnumerable(A, rightKey)
    Assert.IsFrozen(A)
  } finally {
    Settings.Reset()
  }
})
