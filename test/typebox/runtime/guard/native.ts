import { NativeGuard } from 'typebox/guard'
import { Assert } from 'test'

const Test = Assert.Context('NativeGuard')

Test('Should Guard F32 values', () => {
  // Test cases for IsF32
  Assert.IsTrue(NativeGuard.IsF32(0.125)) // 0.125 is precisely representable as F32
  Assert.IsFalse(NativeGuard.IsF32(NaN)) // NaN === Math.fround(NaN) is false
  Assert.IsFalse(NativeGuard.IsF32(Infinity)) // REMOVED: Infinity === Math.fround(Infinity) is true
  Assert.IsFalse(NativeGuard.IsF32(-Infinity)) // REMOVED: -Infinity === Math.fround(-Infinity) is true

  Assert.IsFalse(NativeGuard.IsF32(null))
  Assert.IsFalse(NativeGuard.IsF32(undefined))
  Assert.IsFalse(NativeGuard.IsF32('123'))
  Assert.IsFalse(NativeGuard.IsF32({}))

  // Should these tests pass?
  // Assert.IsTrue(NativeGuard.IsF32(1 / 3)) // 1/3 loses precision as F32
  // Assert.IsFalse(NativeGuard.IsF32(Number.MAX_VALUE)) // Max F64 is too large for F32 (becomes Infinity)
  // Assert.IsFalse(NativeGuard.IsF32(1.0000000000000001)) // This F64 loses precision as F32 (becomes 1.0)
})

Test('Should Guard F64 values', () => {
  // Test cases for IsF64
  Assert.IsTrue(NativeGuard.IsF64(0.125))
  Assert.IsTrue(NativeGuard.IsF64(1.23456789))
  Assert.IsTrue(NativeGuard.IsF64(Number.MAX_VALUE))
  Assert.IsTrue(NativeGuard.IsF64(0))
  Assert.IsTrue(NativeGuard.IsF64(-123.45))
  Assert.IsFalse(NativeGuard.IsF64(NaN))
  Assert.IsFalse(NativeGuard.IsF64(Infinity))
  Assert.IsFalse(NativeGuard.IsF64(-Infinity))
  Assert.IsFalse(NativeGuard.IsF64(null))
  Assert.IsFalse(NativeGuard.IsF64(undefined))
  Assert.IsFalse(NativeGuard.IsF64('123'))
  Assert.IsFalse(NativeGuard.IsF64({}))
})

Test('Should Guard U8 values', () => {
  // Test cases for IsU8
  Assert.IsTrue(NativeGuard.IsU8(0))
  Assert.IsTrue(NativeGuard.IsU8(127))
  Assert.IsTrue(NativeGuard.IsU8(255))
  Assert.IsFalse(NativeGuard.IsU8(-1))
  Assert.IsFalse(NativeGuard.IsU8(256))
  Assert.IsFalse(NativeGuard.IsU8(1.5))
  Assert.IsFalse(NativeGuard.IsU8(NaN))
})

Test('Should Guard U16 values', () => {
  // Test cases for IsU16
  Assert.IsTrue(NativeGuard.IsU16(0))
  Assert.IsTrue(NativeGuard.IsU16(32767))
  Assert.IsTrue(NativeGuard.IsU16(65535))
  Assert.IsFalse(NativeGuard.IsU16(-1))
  Assert.IsFalse(NativeGuard.IsU16(65536))
  Assert.IsFalse(NativeGuard.IsU16(1.5))
  Assert.IsFalse(NativeGuard.IsU16(NaN))
})

Test('Should Guard U32 values', () => {
  // Test cases for IsU32
  Assert.IsTrue(NativeGuard.IsU32(0))
  Assert.IsTrue(NativeGuard.IsU32(2147483647))
  Assert.IsTrue(NativeGuard.IsU32(4294967295))
  Assert.IsFalse(NativeGuard.IsU32(-1))
  Assert.IsFalse(NativeGuard.IsU32(4294967296))
  Assert.IsFalse(NativeGuard.IsU32(1.5))
  Assert.IsFalse(NativeGuard.IsU32(NaN))
})

Test('Should Guard U64 values', () => {
  // Test cases for IsU64
  Assert.IsTrue(NativeGuard.IsU64(0))
  Assert.IsTrue(NativeGuard.IsU64(1))
  Assert.IsTrue(NativeGuard.IsU64(Number.MAX_SAFE_INTEGER))
  Assert.IsFalse(NativeGuard.IsU64(-1))
  Assert.IsFalse(NativeGuard.IsU64(Number.MIN_SAFE_INTEGER)) // Negative value
  Assert.IsFalse(NativeGuard.IsU64(1.5))
  Assert.IsFalse(NativeGuard.IsU64(NaN))
})

Test('Should Guard I8 values', () => {
  // Test cases for IsI8
  Assert.IsTrue(NativeGuard.IsI8(0))
  Assert.IsTrue(NativeGuard.IsI8(-128))
  Assert.IsTrue(NativeGuard.IsI8(127))
  Assert.IsFalse(NativeGuard.IsI8(-129))
  Assert.IsFalse(NativeGuard.IsI8(128))
  Assert.IsFalse(NativeGuard.IsI8(1.5))
  Assert.IsFalse(NativeGuard.IsI8(NaN))
})

Test('Should Guard I16 values', () => {
  // Test cases for IsI16
  Assert.IsTrue(NativeGuard.IsI16(0))
  Assert.IsTrue(NativeGuard.IsI16(-32768))
  Assert.IsTrue(NativeGuard.IsI16(32767))
  Assert.IsFalse(NativeGuard.IsI16(-32769))
  Assert.IsFalse(NativeGuard.IsI16(32768))
  Assert.IsFalse(NativeGuard.IsI16(1.5))
  Assert.IsFalse(NativeGuard.IsI16(NaN))
})

Test('Should Guard I32 values', () => {
  // Test cases for IsI32
  Assert.IsTrue(NativeGuard.IsI32(0))
  Assert.IsTrue(NativeGuard.IsI32(-2147483648))
  Assert.IsTrue(NativeGuard.IsI32(2147483647))
  Assert.IsFalse(NativeGuard.IsI32(-2147483649))
  Assert.IsFalse(NativeGuard.IsI32(2147483648))
  Assert.IsFalse(NativeGuard.IsI32(1.5))
  Assert.IsFalse(NativeGuard.IsI32(NaN))
})

Test('Should Guard I64 values', () => {
  // All I64 values should be BigInts for this guard
  Assert.IsTrue(NativeGuard.IsI64(0n))
  Assert.IsTrue(NativeGuard.IsI64(-9007199254740991n)) // Safely representable within JS number, but tested as BigInt
  Assert.IsTrue(NativeGuard.IsI64(9007199254740991n)) // Safely representable within JS number, but tested as BigInt
  Assert.IsTrue(NativeGuard.IsI64(-9223372036854775808n)) // Min I64 value (using BigInt literal)
  Assert.IsTrue(NativeGuard.IsI64(9223372036854775807n)) // Max I64 value (using BigInt literal)

  // These should be false because the input is a Number, not a BigInt
  Assert.IsFalse(NativeGuard.IsI64(0))
  Assert.IsFalse(NativeGuard.IsI64(-9007199254740991))
  Assert.IsFalse(NativeGuard.IsI64(9007199254740991))
  Assert.IsFalse(NativeGuard.IsI64(-9223372036854775808))
  Assert.IsFalse(NativeGuard.IsI64(9223372036854775807))

  // These are BigInts but outside the I64 range
  Assert.IsFalse(NativeGuard.IsI64(BigInt('-9223372036854775809'))) // Less than min I64
  Assert.IsFalse(NativeGuard.IsI64(BigInt('9223372036854775808'))) // Greater than max I64

  // Non-numeric types
  Assert.IsFalse(NativeGuard.IsI64(1.5)) // Still a number, not BigInt
  Assert.IsFalse(NativeGuard.IsI64(NaN)) // Still a number, not BigInt
  Assert.IsFalse(NativeGuard.IsI64(null))
  Assert.IsFalse(NativeGuard.IsI64(undefined))
  Assert.IsFalse(NativeGuard.IsI64('123')) // String, not BigInt
  Assert.IsFalse(NativeGuard.IsI64({}))
})
