import * as assert from 'assert'

export namespace Assert {
  export function HasProperty<K extends PropertyKey>(value: unknown, key: K): asserts value is Record<K, unknown> {
    if (typeof value === 'object' && value !== null && key in value) return
    throw new Error(`Expected value to have property '${key as string}'`)
  }
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
  /** Asserts a numeric value is within range of the expected */
  export function InRange(value: number, expect: number, range: number) {
    if (Math.abs(value - expect) <= range) return
    throw Error('Expected value to be in range')
  }
  let nextIdOrdinal = 0
  export function NextId() {
    return `$id-${nextIdOrdinal++}`
  }
  export function Throws(callback: Function) {
    try {
      callback()
    } catch {
      return
    }
    throw Error('Expected throw')
  }
  export async function ThrowsAsync(callback: Function) {
    try {
      await callback()
    } catch {
      return
    }
    throw Error('Expected throw')
  }
  export function IsInstanceOf<T extends new (...args: any[]) => any>(value: any, constructor: T): asserts value is InstanceType<T> {
    if (value instanceof constructor) return
    throw Error(`Value is not instance of ${constructor}`)
  }
  export function IsTypeOf<T extends 'string' | 'boolean' | 'number' | 'bigint' | 'symbol' | 'object' | 'function'>(value: any, type: T) {
    if (typeof value === type) return
    throw Error(`Value is not typeof ${type}`)
  }
}
