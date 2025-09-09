import { GlobalsGuard } from 'typebox/guard'
import { Assert } from 'test'

const Test = Assert.Context('GlobalsGuard')

Test('Should Guard TypeArray values', () => {
  // Positive cases for IsTypeArray
  Assert.IsTrue(GlobalsGuard.IsTypeArray(new Int8Array()))
  Assert.IsTrue(GlobalsGuard.IsTypeArray(new Uint8Array()))
  Assert.IsTrue(GlobalsGuard.IsTypeArray(new Uint8ClampedArray()))
  Assert.IsTrue(GlobalsGuard.IsTypeArray(new Int16Array()))
  Assert.IsTrue(GlobalsGuard.IsTypeArray(new Uint16Array()))
  Assert.IsTrue(GlobalsGuard.IsTypeArray(new Int32Array()))
  Assert.IsTrue(GlobalsGuard.IsTypeArray(new Uint32Array()))
  Assert.IsTrue(GlobalsGuard.IsTypeArray(new Float32Array()))
  Assert.IsTrue(GlobalsGuard.IsTypeArray(new Float64Array()))
  Assert.IsTrue(GlobalsGuard.IsTypeArray(new BigInt64Array()))
  Assert.IsTrue(GlobalsGuard.IsTypeArray(new BigUint64Array()))

  // Negative cases for IsTypeArray
  Assert.IsFalse(GlobalsGuard.IsTypeArray([]))
  Assert.IsFalse(GlobalsGuard.IsTypeArray({}))
  Assert.IsFalse(GlobalsGuard.IsTypeArray(null))
  Assert.IsFalse(GlobalsGuard.IsTypeArray(undefined))
  Assert.IsFalse(GlobalsGuard.IsTypeArray(123))
  Assert.IsFalse(GlobalsGuard.IsTypeArray('hello'))
  Assert.IsFalse(GlobalsGuard.IsTypeArray(true))
  Assert.IsFalse(GlobalsGuard.IsTypeArray(new ArrayBuffer(8))) // ArrayBuffer itself is not a TypedArray view
})

Test('Should Guard Int8Array values', () => {
  // Positive case
  Assert.IsTrue(GlobalsGuard.IsInt8Array(new Int8Array()))
  Assert.IsTrue(GlobalsGuard.IsInt8Array(new Int8Array([1, -128, 127])))

  // Negative cases (other TypedArrays and non-TypedArrays)
  Assert.IsFalse(GlobalsGuard.IsInt8Array(new Uint8Array()))
  Assert.IsFalse(GlobalsGuard.IsInt8Array(new Float32Array()))
  Assert.IsFalse(GlobalsGuard.IsInt8Array([]))
  Assert.IsFalse(GlobalsGuard.IsInt8Array({}))
  Assert.IsFalse(GlobalsGuard.IsInt8Array(null))
})

Test('Should Guard Uint8Array values', () => {
  // Positive case
  Assert.IsTrue(GlobalsGuard.IsUint8Array(new Uint8Array()))
  Assert.IsTrue(GlobalsGuard.IsUint8Array(new Uint8Array([0, 255])))

  // Negative cases
  Assert.IsFalse(GlobalsGuard.IsUint8Array(new Int8Array()))
  Assert.IsFalse(GlobalsGuard.IsUint8Array(new Uint8ClampedArray()))
  Assert.IsFalse(GlobalsGuard.IsUint8Array([]))
})

Test('Should Guard Uint8ClampedArray values', () => {
  // Positive case
  Assert.IsTrue(GlobalsGuard.IsUint8ClampedArray(new Uint8ClampedArray()))
  Assert.IsTrue(GlobalsGuard.IsUint8ClampedArray(new Uint8ClampedArray([0, 255])))

  // Negative cases
  Assert.IsFalse(GlobalsGuard.IsUint8ClampedArray(new Uint8Array()))
  Assert.IsFalse(GlobalsGuard.IsUint8ClampedArray(new Int8Array()))
  Assert.IsFalse(GlobalsGuard.IsUint8ClampedArray([]))
})

Test('Should Guard Int16Array values', () => {
  // Positive case
  Assert.IsTrue(GlobalsGuard.IsInt16Array(new Int16Array()))
  Assert.IsTrue(GlobalsGuard.IsInt16Array(new Int16Array([-32768, 32767])))

  // Negative cases
  Assert.IsFalse(GlobalsGuard.IsInt16Array(new Uint16Array()))
  Assert.IsFalse(GlobalsGuard.IsInt16Array(new Int8Array()))
  Assert.IsFalse(GlobalsGuard.IsInt16Array([]))
})

Test('Should Guard Uint16Array values', () => {
  // Positive case
  Assert.IsTrue(GlobalsGuard.IsUint16Array(new Uint16Array()))
  Assert.IsTrue(GlobalsGuard.IsUint16Array(new Uint16Array([0, 65535])))

  // Negative cases
  Assert.IsFalse(GlobalsGuard.IsUint16Array(new Int16Array()))
  Assert.IsFalse(GlobalsGuard.IsUint16Array(new Uint8Array()))
  Assert.IsFalse(GlobalsGuard.IsUint16Array([]))
})

Test('Should Guard Int32Array values', () => {
  // Positive case
  Assert.IsTrue(GlobalsGuard.IsInt32Array(new Int32Array()))
  Assert.IsTrue(GlobalsGuard.IsInt32Array(new Int32Array([-2147483648, 2147483647])))

  // Negative cases
  Assert.IsFalse(GlobalsGuard.IsInt32Array(new Uint32Array()))
  Assert.IsFalse(GlobalsGuard.IsInt32Array(new Int16Array()))
  Assert.IsFalse(GlobalsGuard.IsInt32Array([]))
})

Test('Should Guard Uint32Array values', () => {
  // Positive case
  Assert.IsTrue(GlobalsGuard.IsUint32Array(new Uint32Array()))
  Assert.IsTrue(GlobalsGuard.IsUint32Array(new Uint32Array([0, 4294967295])))

  // Negative cases
  Assert.IsFalse(GlobalsGuard.IsUint32Array(new Int32Array()))
  Assert.IsFalse(GlobalsGuard.IsUint32Array(new Uint16Array()))
  Assert.IsFalse(GlobalsGuard.IsUint32Array([]))
})

Test('Should Guard Float32Array values', () => {
  // Positive case
  Assert.IsTrue(GlobalsGuard.IsFloat32Array(new Float32Array()))
  Assert.IsTrue(GlobalsGuard.IsFloat32Array(new Float32Array([0.125, 1.5])))

  // Negative cases
  Assert.IsFalse(GlobalsGuard.IsFloat32Array(new Float64Array()))
  Assert.IsFalse(GlobalsGuard.IsFloat32Array(new Int32Array()))
  Assert.IsFalse(GlobalsGuard.IsFloat32Array([]))
})

Test('Should Guard Float64Array values', () => {
  // Positive case
  Assert.IsTrue(GlobalsGuard.IsFloat64Array(new Float64Array()))
  Assert.IsTrue(GlobalsGuard.IsFloat64Array(new Float64Array([0.123456789, 1.0000000000000001])))

  // Negative cases
  Assert.IsFalse(GlobalsGuard.IsFloat64Array(new Float32Array()))
  Assert.IsFalse(GlobalsGuard.IsFloat64Array(new Int32Array()))
  Assert.IsFalse(GlobalsGuard.IsFloat64Array([]))
})

Test('Should Guard BigInt64Array values', () => {
  // Positive case
  Assert.IsTrue(GlobalsGuard.IsBigInt64Array(new BigInt64Array()))
  Assert.IsTrue(GlobalsGuard.IsBigInt64Array(new BigInt64Array([0n, -9223372036854775808n, 9223372036854775807n])))

  // Negative cases
  Assert.IsFalse(GlobalsGuard.IsBigInt64Array(new BigUint64Array()))
  Assert.IsFalse(GlobalsGuard.IsBigInt64Array(new Int32Array()))
  Assert.IsFalse(GlobalsGuard.IsBigInt64Array([]))
  Assert.IsFalse(GlobalsGuard.IsBigInt64Array(0)) // Number, not BigIntArray
})

Test('Should Guard BigUint64Array values', () => {
  // Positive case
  Assert.IsTrue(GlobalsGuard.IsBigUint64Array(new BigUint64Array()))
  Assert.IsTrue(GlobalsGuard.IsBigUint64Array(new BigUint64Array([0n, 18446744073709551615n])))

  // Negative cases
  Assert.IsFalse(GlobalsGuard.IsBigUint64Array(new BigInt64Array()))
  Assert.IsFalse(GlobalsGuard.IsBigUint64Array(new Uint32Array()))
  Assert.IsFalse(GlobalsGuard.IsBigUint64Array([]))
  Assert.IsFalse(GlobalsGuard.IsBigUint64Array(0)) // Number, not BigIntArray
})

Test('Should Guard Date values', () => {
  // Positive cases
  Assert.IsTrue(GlobalsGuard.IsDate(new Date()))
  Assert.IsTrue(GlobalsGuard.IsDate(new Date('2023-01-01T12:00:00Z')))

  // Negative cases
  Assert.IsFalse(GlobalsGuard.IsDate('2023-01-01'))
  Assert.IsFalse(GlobalsGuard.IsDate(1234567890))
  Assert.IsFalse(GlobalsGuard.IsDate(null))
  Assert.IsFalse(GlobalsGuard.IsDate(undefined))
  Assert.IsFalse(GlobalsGuard.IsDate({}))
})

Test('Should Guard Set values', () => {
  // Positive cases
  Assert.IsTrue(GlobalsGuard.IsSet(new Set()))
  Assert.IsTrue(GlobalsGuard.IsSet(new Set([1, 2, 3])))

  // Negative cases
  Assert.IsFalse(GlobalsGuard.IsSet([]))
  Assert.IsFalse(GlobalsGuard.IsSet({}))
  Assert.IsFalse(GlobalsGuard.IsSet(null))
  Assert.IsFalse(GlobalsGuard.IsSet(undefined))
  Assert.IsFalse(GlobalsGuard.IsSet(new Map()))
})

Test('Should Guard Map values', () => {
  // Positive cases
  Assert.IsTrue(GlobalsGuard.IsMap(new Map()))
  Assert.IsTrue(GlobalsGuard.IsMap(new Map([['a', 1], ['b', 2]])))

  // Negative cases
  Assert.IsFalse(GlobalsGuard.IsMap({}))
  Assert.IsFalse(GlobalsGuard.IsMap([]))
  Assert.IsFalse(GlobalsGuard.IsMap(null))
  Assert.IsFalse(GlobalsGuard.IsMap(undefined))
  Assert.IsFalse(GlobalsGuard.IsMap(new Set()))
})
