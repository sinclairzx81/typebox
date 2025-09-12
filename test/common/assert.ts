import * as assert from 'node:assert'

// ------------------------------------------------------------------
// Runtime
// ------------------------------------------------------------------
export type Test = (name: string, callback: (context: Deno.TestContext) => void) => any

export function Context(context: string): Test {
  return (name: string, callback: (context: Deno.TestContext) => void) => {
    Deno.test(`${context}: ${name}`, callback)
  }
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
export function IsDefined(value: unknown): boolean {
  return value !== undefined
}
export function IsUndefined(value: unknown): boolean {
  return value === undefined
}
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
export function HasPropertyKey<K extends PropertyKey>(value: unknown, key: K): asserts value is Record<K, unknown> {
  if (typeof value === 'object' && value !== null && key in value) return
  throw new Error(`Expected value to have property '${key as string}'`)
}
export function NotHasPropertyKey<K extends PropertyKey>(value: unknown, key: K): asserts value is Record<K, unknown> {
  if (typeof value === 'object' && value !== null && !(key in value)) return
  throw new Error(`Expected value not to have property '${key as string}'`)
}
// ------------------------------------------------------------------
// Logic
// ------------------------------------------------------------------
export function IsTrue(value: boolean): asserts value is true {
  return assert.strictEqual(value, true)
}
export function IsFalse(value: boolean): asserts value is false {
  return assert.strictEqual(value, false)
}
export function IsEqual(actual: unknown, expect: unknown) {
  if (actual instanceof Uint8Array && expect instanceof Uint8Array) {
    assert.equal(actual.length, expect.length)
    for (let i = 0; i < actual.length; i++) assert.equal(actual[i], expect[i])
  }
  return assert.deepStrictEqual(actual, expect)
}
export function NotEqual(actual: unknown, expect: unknown) {
  return assert.notEqual(actual, expect)
}
export function Throws(callback: Function) {
  try {
    callback()
  } catch {
    return
  }
  throw Error('Expected throw')
}

// ------------------------------------------------------------------
// IsNeverExtends
// ------------------------------------------------------------------
/** Special case for left-side `never` as given by `(never extends T ? true : false)` */
export function IsExtendsWhenLeftIsNever<Left extends unknown, Right extends unknown>(_expect: [TExtendsExpect<Left, Right>] extends [true] ? true : false) {}

// ------------------------------------------------------------------
// IsExtends
// ------------------------------------------------------------------
type TExtendsExpect<Left extends unknown, Right extends unknown> = Left extends Right ? true : false

export function IsExtends<Left extends unknown, Right extends unknown>(_expect: TExtendsExpect<Left, Right>) {}

// ------------------------------------------------------------------
// IsExtendsMutual
// ------------------------------------------------------------------
type TExtendsMutualExpect<Left extends unknown, Right extends unknown> = Left extends Right ? Right extends Left ? true : false : false

export function IsExtendsMutual<Left extends unknown, Right extends unknown>(_expect: TExtendsMutualExpect<Left, Right>) {}

// ------------------------------------------------------------------
// IsExtendsNever
// ------------------------------------------------------------------
type TExtendsNever<Type extends unknown> = [Type] extends [never] ? true : false

export function IsExtendsNever<Type extends unknown>(_expect: TExtendsNever<Type>) {}
