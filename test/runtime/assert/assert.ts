import * as assert from 'assert'

export namespace Assert {
  let port = 9000
  /** Generates a new port used for host binding */
  export function nextPort() {
    const next = port++
    return next
  }

  export function equal(actual: unknown, expect: unknown) {
    return assert.equal(actual, expect)
  }

  export function notEqual(actual: unknown, expect: unknown) {
    return assert.notEqual(actual, expect)
  }

  export function deepEqual(actual: unknown, expect: unknown) {
    if (actual instanceof Uint8Array && expect instanceof Uint8Array) {
      assert.equal(actual.length, expect.length)
      for (let i = 0; i < actual.length; i++) assert.equal(actual[i], expect[i])
    }
    return assert.deepEqual(actual, expect)
  }

  let nextIdOrdinal = 0
  export function nextId() {
    return `nextID${nextIdOrdinal++}`
  }

  export function throws(callback: Function) {
    try {
      callback()
    } catch {
      return
    }
    throw Error('Expected throw')
  }

  export async function throwsAsync(callback: Function) {
    try {
      await callback()
    } catch {
      return
    }
    throw Error('Expected throw')
  }

  export function isTypeOf(value: any, type: any) {
    if (typeof value === type) return
    throw Error(`Value is not typeof ${type}`)
  }

  export function isInstanceOf(value: any, constructor: any) {
    if (value instanceof constructor) return
    throw Error(`Value is not instance of ${constructor}`)
  }
}
