import Cbor from 'typebox/cbor'
import { Assert } from 'test'
import { Register, Unregister } from './_additional.ts'
const Test = Assert.Context('Cbor.Additional')

// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
Test('Should Additional 1: Encode Date epoch', () => {
  Register()
  const date = new Date(0)
  const encoded = Cbor.Encode(date)
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsTrue(decoded instanceof Date)
  Assert.IsEqual(decoded.getTime(), 0)
  Unregister()
})
Test('Should Additional 2: Encode Date current time', () => {
  Register()
  const date = new Date('2024-01-15T12:00:00.000Z')
  const encoded = Cbor.Encode(date)
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsTrue(decoded instanceof Date)
  Assert.IsEqual(decoded.getTime(), date.getTime())
  Unregister()
})
Test('Should Additional 3: Encode Date negative timestamp', () => {
  Register()
  const date = new Date(-1000000)
  const encoded = Cbor.Encode(date)
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsTrue(decoded instanceof Date)
  Assert.IsEqual(decoded.getTime(), date.getTime())
  Unregister()
})
// ------------------------------------------------------------------
// URL
// ------------------------------------------------------------------
Test('Should Additional 4: Encode URL', () => {
  Register()
  const url = new URL('https://example.com')
  const encoded = Cbor.Encode(url)
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsTrue(decoded instanceof URL)
  Assert.IsEqual(decoded.href, url.href)
  Unregister()
})
Test('Should Additional 5: Encode URL with path and query', () => {
  Register()
  const url = new URL('https://example.com/path?foo=bar#section')
  const encoded = Cbor.Encode(url)
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsTrue(decoded instanceof URL)
  Assert.IsEqual(decoded.href, url.href)
  Unregister()
})
// ------------------------------------------------------------------
// RegExp
// ------------------------------------------------------------------
Test('Should Additional 6: Encode simple RegExp', () => {
  Register()
  const re = /hello/
  const encoded = Cbor.Encode(re)
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsTrue(decoded instanceof RegExp)
  Assert.IsEqual(decoded.source, re.source)
  Assert.IsEqual(decoded.flags, re.flags)
  Unregister()
})
Test('Should Additional 7: Encode RegExp with flags', () => {
  Register()
  const re = /hello/gi
  const encoded = Cbor.Encode(re)
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsTrue(decoded instanceof RegExp)
  Assert.IsEqual(decoded.source, re.source)
  Assert.IsEqual(decoded.flags, re.flags)
  Unregister()
})
// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
Test('Should Additional 8: Encode empty Set', () => {
  Register()
  const set = new Set()
  const encoded = Cbor.Encode(set)
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsTrue(decoded instanceof Set)
  Assert.IsEqual(decoded.size, 0)
  Unregister()
})
Test('Should Additional 9: Encode Set of numbers', () => {
  Register()
  const set = new Set([1, 2, 3])
  const encoded = Cbor.Encode(set)
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsTrue(decoded instanceof Set)
  Assert.IsEqual(decoded.size, 3)
  Assert.IsTrue(decoded.has(1))
  Assert.IsTrue(decoded.has(2))
  Assert.IsTrue(decoded.has(3))
  Unregister()
})
Test('Should Additional 10: Encode Set of strings', () => {
  Register()
  const set = new Set(['a', 'b', 'c'])
  const encoded = Cbor.Encode(set)
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsTrue(decoded instanceof Set)
  Assert.IsTrue(decoded.has('a'))
  Assert.IsTrue(decoded.has('b'))
  Assert.IsTrue(decoded.has('c'))
  Unregister()
})
// ------------------------------------------------------------------
// Map
// ------------------------------------------------------------------
Test('Should Additional 11: Encode empty Map', () => {
  Register()
  const map = new Map()
  const encoded = Cbor.Encode(map)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, {})
  Unregister()
})
Test('Should Additional 12: Encode Map with string keys', () => {
  Register()
  const map = new Map([['a', 1], ['b', 2]])
  const encoded = Cbor.Encode(map)
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsEqual(decoded.a, 1)
  Assert.IsEqual(decoded.b, 2)
  Unregister()
})
// ------------------------------------------------------------------
// Typed Arrays
// ------------------------------------------------------------------
Test('Should Additional 13: Encode Uint16Array', () => {
  Register()
  const arr = new Uint16Array([1, 2, 3])
  const encoded = Cbor.Encode(arr)
  const decoded = Cbor.Decode(encoded)
  Assert.IsTrue(decoded instanceof Uint16Array)
  Assert.IsEqual(decoded, arr)
  Unregister()
})
Test('Should Additional 14: Encode Uint32Array', () => {
  Register()
  const arr = new Uint32Array([100, 200, 300])
  const encoded = Cbor.Encode(arr)
  const decoded = Cbor.Decode(encoded)
  Assert.IsTrue(decoded instanceof Uint32Array)
  Assert.IsEqual(decoded, arr)
  Unregister()
})
Test('Should Additional 15: Encode Int8Array', () => {
  Register()
  const arr = new Int8Array([-1, 0, 1])
  const encoded = Cbor.Encode(arr)
  const decoded = Cbor.Decode(encoded)
  Assert.IsTrue(decoded instanceof Int8Array)
  Assert.IsEqual(decoded, arr)
  Unregister()
})
Test('Should Additional 16: Encode Int16Array', () => {
  Register()
  const arr = new Int16Array([-1000, 0, 1000])
  const encoded = Cbor.Encode(arr)
  const decoded = Cbor.Decode(encoded)
  Assert.IsTrue(decoded instanceof Int16Array)
  Assert.IsEqual(decoded, arr)
  Unregister()
})
Test('Should Additional 17: Encode Int32Array', () => {
  Register()
  const arr = new Int32Array([-100000, 0, 100000])
  const encoded = Cbor.Encode(arr)
  const decoded = Cbor.Decode(encoded)
  Assert.IsTrue(decoded instanceof Int32Array)
  Assert.IsEqual(decoded, arr)
  Unregister()
})
Test('Should Additional 18: Encode Float32Array', () => {
  Register()
  const arr = new Float32Array([1.5, 2.5, 3.5])
  const encoded = Cbor.Encode(arr)
  const decoded = Cbor.Decode(encoded)
  Assert.IsTrue(decoded instanceof Float32Array)
  Assert.IsEqual(decoded, arr)
  Unregister()
})
Test('Should Additional 19: Encode Float64Array', () => {
  Register()
  const arr = new Float64Array([1.1, 2.2, 3.3])
  const encoded = Cbor.Encode(arr)
  const decoded = Cbor.Decode(encoded)
  Assert.IsTrue(decoded instanceof Float64Array)
  Assert.IsEqual(decoded, arr)
  Unregister()
})
Test('Should Additional 20: Encode Uint8ClampedArray', () => {
  Register()
  const arr = new Uint8ClampedArray([0, 128, 255])
  const encoded = Cbor.Encode(arr)
  const decoded = Cbor.Decode(encoded)
  Assert.IsTrue(decoded instanceof Uint8ClampedArray)
  Assert.IsEqual(decoded, arr)
  Unregister()
})
Test('Should Additional 21: Encode BigInt64Array', () => {
  Register()
  const arr = new BigInt64Array([-1n, 0n, 1n])
  const encoded = Cbor.Encode(arr)
  const decoded = Cbor.Decode(encoded)
  Assert.IsTrue(decoded instanceof BigInt64Array)
  Assert.IsEqual(decoded, arr)
  Unregister()
})
Test('Should Additional 22: Encode BigUint64Array', () => {
  Register()
  const arr = new BigUint64Array([0n, 1n, 2n])
  const encoded = Cbor.Encode(arr)
  const decoded = Cbor.Decode(encoded)
  Assert.IsTrue(decoded instanceof BigUint64Array)
  Assert.IsEqual(decoded, arr)
  Unregister()
})
