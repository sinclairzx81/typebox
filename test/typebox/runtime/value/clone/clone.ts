import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

// ------------------------------------------------------------------
// Value.Clone tests have been moved to System.Memory.Clone. We
// keep a few superficial tests here to ensure we can call
// System.Memory.Clone via the Value.Clone interface.
// ------------------------------------------------------------------
const Test = Assert.Context('Value.Clone')

Test('Should Clone 1', () => {
  const R = Value.Clone(1)
  Assert.IsEqual(R, 1)
})
Test('Should Clone 2', () => {
  const R = Value.Clone('hello')
  Assert.IsEqual(R, 'hello')
})
Test('Should Clone 3', () => {
  const R = Value.Clone(true)
  Assert.IsEqual(R, true)
})
Test('Should Clone 4', () => {
  const R = Value.Clone(undefined)
  Assert.IsEqual(R, undefined)
})
Test('Should Clone 5', () => {
  const R = Value.Clone(null)
  Assert.IsEqual(R, null)
})
Test('Should Clone 6', () => {
  const R = Value.Clone([1, 2, 3, 4])
  Assert.IsEqual(R, [1, 2, 3, 4])
})
Test('Should Clone 7', () => {
  const R = Value.Clone({ x: 1 })
  Assert.IsEqual(R, { x: 1 })
})
Test('Should Clone 8', () => {
  const R = Value.Clone({ x: { y: 2 } })
  Assert.IsEqual(R, { x: { y: 2 } })
})

Test('Should preserve own prototype-named data properties without prototype pollution', () => {
  const source = {
    ['__proto__']: { pollution: true },
    constructor: { prototype: { pollution: true } },
    prototype: { pollution: true }
  }
  const cloned = Value.Clone(source)
  Assert.IsEqual(cloned, source)
  Assert.NotEqual(cloned, source)
  Assert.IsEqual(Object.getPrototypeOf(cloned), Object.prototype)
  Assert.IsFalse(Object.hasOwn(Object.prototype, 'pollution'))
  for (const key of ['__proto__', 'constructor', 'prototype'] as const) {
    Assert.NotEqual(cloned[key], source[key])
  }
})
Test('Should preserve own prototype-named schema options and hidden metadata', () => {
  const source = Type.String({
    ['__proto__']: { pollution: true },
    constructor: { prototype: { pollution: true } },
    prototype: { pollution: true }
  })
  const cloned = Value.Clone(source)
  Assert.IsEqual(cloned, source)
  Assert.NotEqual(cloned, source)
  Assert.IsEqual(Object.getPrototypeOf(cloned), Object.prototype)
  Assert.IsFalse(Object.hasOwn(Object.prototype, 'pollution'))
  Assert.IsEqual(Object.getOwnPropertyDescriptor(cloned, '~kind'), Object.getOwnPropertyDescriptor(source, '~kind'))
  const clonedDescriptors = Object.getOwnPropertyDescriptors(cloned)
  const sourceDescriptors = Object.getOwnPropertyDescriptors(source)
  for (const key of ['__proto__', 'constructor', 'prototype']) {
    Assert.NotEqual(clonedDescriptors[key].value, sourceDescriptors[key].value)
  }
})
