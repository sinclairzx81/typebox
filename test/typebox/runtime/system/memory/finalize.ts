import { Memory, Settings } from 'typebox/system'
import { Assert } from 'test'

const Test = Assert.Context('System.Memory.Finalize')

// ------------------------------------------------------------------
// Cyclic References
// ------------------------------------------------------------------
Test('Should Finalize 1', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: true })
  try {
    const cyclic: Record<string, unknown> = {}
    cyclic.self = cyclic
    const A = Memory.Create({}, { cyclic })
    Assert.IsFrozen(A)
    Assert.IsFrozen(cyclic)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Accessor Properties
// ------------------------------------------------------------------
Test('Should Finalize 2', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: true })
  try {
    const child = { value: 1 }
    const current: Record<PropertyKey, unknown> = {}
    Object.defineProperty(current, 'child', { enumerable: true, get: () => child })
    const A = Memory.Update(current, {}, {})
    Assert.IsTrue(A.child === child)
    Assert.IsFrozen(A)
    Assert.IsNonFrozen(child)
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Recursive Freeze
// ------------------------------------------------------------------
Test('Should Finalize 3', () => {
  Settings.Set({ enumerableKind: false, immutableTypes: true })
  try {
    const hidden = { value: 1 }
    const symbol = Symbol()
    const symbolValue = { value: 2 }
    const nested = { deep: { value: 3 } }
    Object.defineProperty(nested, 'hidden', { value: hidden })
    Object.defineProperty(nested, symbol, { value: symbolValue })
    const A = Memory.Create({}, { nested })
    Assert.IsFrozen(A)
    Assert.IsFrozen(nested)
    Assert.IsFrozen(nested.deep)
    Assert.IsFrozen(hidden)
    Assert.IsFrozen(symbolValue)
  } finally {
    Settings.Reset()
  }
})
