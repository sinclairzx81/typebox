import Cbor from 'typebox/cbor'
import { Assert } from 'test'

const Test = Assert.Context('Cbor.Codec')

// ------------------------------------------------------------------
// Integers
// ------------------------------------------------------------------
Test('Should Encode Decode 1: encode 0', () => {
  const encoded = Cbor.Encode(0)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 0)
})
Test('Should Encode Decode 2: encode 1', () => {
  const encoded = Cbor.Encode(1)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 1)
})
Test('Should Encode Decode 3: encode 23 (1-byte boundary)', () => {
  const encoded = Cbor.Encode(23)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 23)
})
Test('Should Encode Decode 4: encode 24 (2-byte boundary)', () => {
  const encoded = Cbor.Encode(24)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 24)
})
Test('Should Encode Decode 5: encode 255 (uint8 max)', () => {
  const encoded = Cbor.Encode(255)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 255)
})
Test('Should Encode Decode 6: encode 256 (uint16 boundary)', () => {
  const encoded = Cbor.Encode(256)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 256)
})
Test('Should Encode Decode 7: encode 65535 (uint16 max)', () => {
  const encoded = Cbor.Encode(65535)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 65535)
})
Test('Should Encode Decode 8: encode 65536 (uint32 boundary)', () => {
  const encoded = Cbor.Encode(65536)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 65536)
})
Test('Should Encode Decode 9: encode 4294967295 (uint32 max)', () => {
  const encoded = Cbor.Encode(4294967295)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 4294967295)
})
Test('Should Encode Decode 10: encode Number.MAX_SAFE_INTEGER', () => {
  const encoded = Cbor.Encode(Number.MAX_SAFE_INTEGER)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, Number.MAX_SAFE_INTEGER)
})
// ------------------------------------------------------------------
// Negative Integers
// ------------------------------------------------------------------
Test('Should Encode Decode 11: encode -1', () => {
  const encoded = Cbor.Encode(-1)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, -1)
})
Test('Should Encode Decode 12: encode -23', () => {
  const encoded = Cbor.Encode(-23)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, -23)
})
Test('Should Encode Decode 13: encode -24 (1-byte neg boundary)', () => {
  const encoded = Cbor.Encode(-24)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, -24)
})
Test('Should Encode Decode 14: encode -100', () => {
  const encoded = Cbor.Encode(-100)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, -100)
})
Test('Should Encode Decode 15: encode -256', () => {
  const encoded = Cbor.Encode(-256)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, -256)
})
Test('Should Encode Decode 16: encode -65536', () => {
  const encoded = Cbor.Encode(-65536)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, -65536)
})
Test('Should Encode Decode 17: encode Number.MIN_SAFE_INTEGER', () => {
  const encoded = Cbor.Encode(Number.MIN_SAFE_INTEGER)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, Number.MIN_SAFE_INTEGER)
})
// ------------------------------------------------------------------
// Floats
// ------------------------------------------------------------------
Test('Should Encode Decode 18: encode 1.5', () => {
  const encoded = Cbor.Encode(1.5)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 1.5)
})
Test('Should Encode Decode 19: encode -1.5', () => {
  const encoded = Cbor.Encode(-1.5)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, -1.5)
})
Test('Should Encode Decode 20: encode 0.1', () => {
  const encoded = Cbor.Encode(0.1)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 0.1)
})
Test('Should Encode Decode 21: encode 3.14159265358979', () => {
  const encoded = Cbor.Encode(3.14159265358979)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 3.14159265358979)
})
Test('Should Encode Decode 22: encode Infinity', () => {
  const encoded = Cbor.Encode(Infinity)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, Infinity)
})
Test('Should Encode Decode 23: encode -Infinity', () => {
  const encoded = Cbor.Encode(-Infinity)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, -Infinity)
})
Test('Should Encode Decode 24: encode NaN', () => {
  const encoded = Cbor.Encode(NaN)
  const decoded = Cbor.Decode(encoded)
  Assert.IsTrue(Number.isNaN(decoded))
})
// ------------------------------------------------------------------
// Booleans
// ------------------------------------------------------------------
Test('Should Encode Decode 25: encode true', () => {
  const encoded = Cbor.Encode(true)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, true)
})
Test('Should Encode Decode 26: encode false', () => {
  const encoded = Cbor.Encode(false)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, false)
})
// ------------------------------------------------------------------
// Null / Undefined
// ------------------------------------------------------------------
Test('Should Encode Decode 27: encode null', () => {
  const encoded = Cbor.Encode(null)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, null)
})
Test('Should Encode Decode 28: encode undefined', () => {
  const encoded = Cbor.Encode(undefined)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, undefined)
})
// ------------------------------------------------------------------
// Strings
// ------------------------------------------------------------------
Test('Should Encode Decode 29: encode empty string', () => {
  const encoded = Cbor.Encode('')
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, '')
})
Test('Should Encode Decode 30: encode ascii string', () => {
  const encoded = Cbor.Encode('hello')
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 'hello')
})
Test('Should Encode Decode 31: encode string with spaces', () => {
  const encoded = Cbor.Encode('hello world')
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 'hello world')
})
Test('Should Encode Decode 32: encode long string (>23 bytes)', () => {
  const str = 'a'.repeat(256)
  const encoded = Cbor.Encode(str)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, str)
})
Test('Should Encode Decode 33: encode unicode string', () => {
  const encoded = Cbor.Encode('héllo wörld')
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 'héllo wörld')
})
Test('Should Encode Decode 34: encode emoji string', () => {
  const encoded = Cbor.Encode('hello 🌍')
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 'hello 🌍')
})
Test('Should Encode Decode 35: encode CJK characters', () => {
  const encoded = Cbor.Encode('日本語テスト')
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, '日本語テスト')
})
Test('Should Encode Decode 36: encode string with special characters', () => {
  const str = '"\\/\n\r\t'
  const encoded = Cbor.Encode(str)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, str)
})
// ------------------------------------------------------------------
// Uint8Array
// ------------------------------------------------------------------
Test('Should Encode Decode 37: encode empty Uint8Array', () => {
  const encoded = Cbor.Encode(new Uint8Array([]))
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsTrue(decoded instanceof Uint8Array)
  Assert.IsEqual(decoded.length, 0)
})
Test('Should Encode Decode 38: encode Uint8Array with data', () => {
  const bytes = new Uint8Array([0x01, 0x02, 0x03, 0xff])
  const encoded = Cbor.Encode(bytes)
  const decoded = Cbor.Decode(encoded)
  Assert.IsTrue(decoded instanceof Uint8Array)
  Assert.IsEqual(decoded, bytes)
})
Test('Should Encode Decode 39: encode Uint8Array of length 256', () => {
  const bytes = new Uint8Array(256).fill(0xab)
  const encoded = Cbor.Encode(bytes)
  const decoded = Cbor.Decode(encoded)
  Assert.IsTrue(decoded instanceof Uint8Array)
  Assert.IsEqual(decoded, bytes)
})
// ------------------------------------------------------------------
// Arrays
// ------------------------------------------------------------------
Test('Should Encode Decode 40: encode empty array', () => {
  const encoded = Cbor.Encode([])
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, [])
})
Test('Should Encode Decode 41: encode array of integers', () => {
  const encoded = Cbor.Encode([1, 2, 3])
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, [1, 2, 3])
})
Test('Should Encode Decode 42: encode array of strings', () => {
  const encoded = Cbor.Encode(['a', 'b', 'c'])
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, ['a', 'b', 'c'])
})
Test('Should Encode Decode 43: encode array of mixed types', () => {
  const encoded = Cbor.Encode([1, 'two', true, null])
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, [1, 'two', true, null])
})
Test('Should Encode Decode 44: encode nested arrays', () => {
  const encoded = Cbor.Encode([[1, 2], [3, 4]])
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, [[1, 2], [3, 4]])
})
Test('Should Encode Decode 45: encode deeply nested array', () => {
  const val = [[[['deep']]]]
  const encoded = Cbor.Encode(val)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, val)
})
Test('Should Encode Decode 46: encode large array (100 elements)', () => {
  const arr = Array.from({ length: 100 }, (_, i) => i)
  const encoded = Cbor.Encode(arr)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, arr)
})
// ------------------------------------------------------------------
// Objects
// ------------------------------------------------------------------
Test('Should Encode Decode 47: encode empty object', () => {
  const encoded = Cbor.Encode({})
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, {})
})
Test('Should Encode Decode 48: encode simple flat object', () => {
  const encoded = Cbor.Encode({ a: 1, b: 2 })
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, { a: 1, b: 2 })
})
Test('Should Encode Decode 49: encode object with mixed value types', () => {
  const obj = { n: 1, s: 'hello', b: true, nil: null }
  const encoded = Cbor.Encode(obj)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, obj)
})
Test('Should Encode Decode 50: encode nested object', () => {
  const obj = { outer: { inner: { value: 42 } } }
  const encoded = Cbor.Encode(obj)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, obj)
})
Test('Should Encode Decode 51: encode object with array values', () => {
  const obj = { items: [1, 2, 3], tags: ['a', 'b'] }
  const encoded = Cbor.Encode(obj)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, obj)
})
Test('Should Encode Decode 52: encode array of objects', () => {
  const val = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
  const encoded = Cbor.Encode(val)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, val)
})
Test('Should Encode Decode 53: encode object with numeric string keys', () => {
  const obj = { '0': 'zero', '1': 'one' }
  const encoded = Cbor.Encode(obj)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, obj)
})
Test('Should Encode Decode 54: encode object with many keys (>23)', () => {
  const obj = Object.fromEntries(Array.from({ length: 30 }, (_, i) => [`key${i}`, i]))
  const encoded = Cbor.Encode(obj)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, obj)
})
// ------------------------------------------------------------------
// Complex
// ------------------------------------------------------------------
Test('Should Encode Decode 55: encode a realistic API response object', () => {
  const obj = {
    id: 'abc-123',
    status: 'ok',
    count: 42,
    items: [
      { id: 1, label: 'first', active: true },
      { id: 2, label: 'second', active: false }
    ],
    meta: { page: 1, total: 2 }
  }
  const encoded = Cbor.Encode(obj)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, obj)
})
Test('Should Encode Decode 56: encode deeply nested mixed structure', () => {
  const obj = {
    level1: {
      level2: {
        level3: {
          arr: [1, 'two', false, null, { key: 'val' }]
        }
      }
    }
  }
  const encoded = Cbor.Encode(obj)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, obj)
})
Test('Should Encode Decode 57: encode object containing Uint8Array', () => {
  const bytes = new Uint8Array([0xde, 0xad, 0xbe, 0xef])
  const obj = { data: bytes, label: 'buffer' }
  const encoded = Cbor.Encode(obj)
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsEqual(decoded.label, 'buffer')
  Assert.IsTrue(decoded.data instanceof Uint8Array)
  Assert.IsEqual(decoded.data, bytes)
})
Test('Should Encode Decode 58: encode array containing Uint8Arrays', () => {
  const arr = [new Uint8Array([1, 2]), new Uint8Array([3, 4])]
  const encoded = Cbor.Encode(arr)
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsTrue(decoded[0] instanceof Uint8Array)
  Assert.IsTrue(decoded[1] instanceof Uint8Array)
  Assert.IsEqual(decoded[0], arr[0])
  Assert.IsEqual(decoded[1], arr[1])
})
// ------------------------------------------------------------------
// Round-trip
// ------------------------------------------------------------------
Test('Should Encode Decode 59: produce a Uint8Array from encode', () => {
  const encoded = Cbor.Encode(42)
  const decoded = Cbor.Decode(encoded)
  Assert.IsTrue(encoded instanceof Uint8Array)
  Assert.IsEqual(decoded, 42)
})
Test('Should Encode Decode 60: produce identical bytes for identical inputs', () => {
  const encodedA = Cbor.Encode({ x: 1 })
  const encodedB = Cbor.Encode({ x: 1 })
  Assert.IsEqual(encodedA, encodedB)
})
// ------------------------------------------------------------------
// Float32 (coverage for readF32)
// ------------------------------------------------------------------
Test('Should Encode Decode 61: decode cbor float32', () => {
  // Manually craft a CBOR float32: 0xfa = MT_FLOAT | 26, followed by IEEE 754 float32 bytes
  // Value: 1.5 as float32 = 0x3fc00000
  const encoded = new Uint8Array([0xfa, 0x3f, 0xc0, 0x00, 0x00])
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsEqual(decoded, 1.5)
})
Test('Should Encode Decode 62: decode cbor float32 negative', () => {
  // Value: -1.5 as float32 = 0xbfc00000
  const encoded = new Uint8Array([0xfa, 0xbf, 0xc0, 0x00, 0x00])
  const decoded = Cbor.Decode(encoded) as any
  Assert.IsEqual(decoded, -1.5)
})
// ------------------------------------------------------------------
// BigInt tag (coverage for bytesToBigInt)
// ------------------------------------------------------------------
Test('Should Encode Decode 63: decode cbor tag 2 positive bignum', () => {
  // Tag 2 + byte string 0x01 0x00 = 256n
  const encoded = new Uint8Array([0xc2, 0x42, 0x01, 0x00])
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 256n)
})
Test('Should Encode Decode 64: decode cbor tag 3 negative bignum', () => {
  // Tag 3 + byte string 0x01 0x00 = -1n - 256n = -257n
  const encoded = new Uint8Array([0xc3, 0x42, 0x01, 0x00])
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, -257n)
})
// ------------------------------------------------------------------
// Buffer Growth (coverage for writeEnsure)
// ------------------------------------------------------------------
Test('Should Encode Decode 65: encode value exceeding 128KB write buffer', () => {
  const large = new Uint8Array(150_000).fill(0xab)
  const encoded = Cbor.Encode(large)
  const decoded = Cbor.Decode(encoded) as Uint8Array
  Assert.IsTrue(decoded instanceof Uint8Array)
  Assert.IsEqual(decoded.length, large.length)
  Assert.IsEqual(decoded[0], 0xab)
  Assert.IsEqual(decoded[149_999], 0xab)
})
// ------------------------------------------------------------------
// BigInt encode (coverage for encodeHead bigint branch)
// ------------------------------------------------------------------
Test('Should Encode Decode 66: encode positive bigint within u64', () => {
  const value = 9007199254740992n // Number.MAX_SAFE_INTEGER + 1
  const encoded = Cbor.Encode(value)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, value)
})
Test('Should Encode Decode 67: encode negative bigint within u64', () => {
  const value = -9007199254740993n // Number.MIN_SAFE_INTEGER - 1
  const encoded = Cbor.Encode(value)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, value)
})
// ------------------------------------------------------------------
// BigInt tag 2/3 (coverage for bigIntToBytes / values exceeding u64)
// ------------------------------------------------------------------
Test('Should Encode Decode 68: encode positive bigint exceeding u64 (tag 2, odd hex)', () => {
  const value = 18446744073709551616n // UINT64_MAX + 1 / odd hex length, hits '0' + hex branch
  const encoded = Cbor.Encode(value)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, value)
})
Test('Should Encode Decode 69: encode positive bigint exceeding u64 (tag 2, even hex)', () => {
  const value = 295147905179352825856n // 2^64 * 16 / even hex length, hits hex branch directly
  const encoded = Cbor.Encode(value)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, value)
})
Test('Should Encode Decode 70: encode negative bigint exceeding u64 (tag 3)', () => {
  const value = -18446744073709551617n // -(UINT64_MAX + 1) - 1
  const encoded = Cbor.Encode(value)
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, value)
})
// ------------------------------------------------------------------
// Unsupported type (coverage for encodeValue default throw)
// ------------------------------------------------------------------
Test('Should Encode Decode 71: throw on unsupported type', () => {
  Assert.Throws(() => Cbor.Encode(Symbol('test')))
})
// ------------------------------------------------------------------
// Float16 paths (coverage for readF16 subnormal and normal branches)
// ------------------------------------------------------------------
Test('Should Encode Decode 72: decode cbor float16 subnormal (exp === 0)', () => {
  // 0xf9 = MT_FLOAT | 25, bits = 0x0001: sign=+1, exp=0, mant=1 → subnormal
  const encoded = new Uint8Array([0xf9, 0x00, 0x01])
  const decoded = Cbor.Decode(encoded) as number
  Assert.IsTrue(typeof decoded === 'number' && decoded > 0 && decoded < 1e-4)
})
Test('Should Encode Decode 73: decode cbor float16 normal', () => {
  // 0xf9 = MT_FLOAT | 25, bits = 0x3c00: sign=+1, exp=15, mant=0 → 1.0
  const encoded = new Uint8Array([0xf9, 0x3c, 0x00])
  const decoded = Cbor.Decode(encoded)
  Assert.IsEqual(decoded, 1.0)
})
// ------------------------------------------------------------------
// Throw conditions
// ------------------------------------------------------------------
Test('Should Encode Decode 74: throw on unsupported additional info', () => {
  // 0x1c = major type 0, info 28 / reserved, invalid in CBOR
  const encoded = new Uint8Array([0x1c])
  Assert.Throws(() => Cbor.Decode(encoded))
})
Test('Should Encode Decode 75: throw on unsupported simple/float info', () => {
  // 0xff = major type 7 (float), info 31 / invalid simple value
  const encoded = new Uint8Array([0xff])
  Assert.Throws(() => Cbor.Decode(encoded))
})
