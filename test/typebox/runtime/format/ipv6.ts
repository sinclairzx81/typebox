import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsIPv6')

Test('Should IsIPv6 1', () => {
  // Full, uncompressed address
  Assert.IsTrue(Format.IsIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334'))
})

Test('Should IsIPv6 2', () => {
  // Full, uncompressed, with leading zeros omitted in segments
  Assert.IsTrue(Format.IsIPv6('2001:db8:85a3:0:0:8a2e:370:7334'))
})

Test('Should IsIPv6 3', () => {
  // Compressed, middle zeros
  Assert.IsTrue(Format.IsIPv6('2001:db8::8a2e:370:7334'))
})

Test('Should IsIPv6 4', () => {
  // Compressed, leading zeros (loopback address)
  Assert.IsTrue(Format.IsIPv6('::1'))
})

Test('Should IsIPv6 5', () => {
  // Compressed, trailing zeros
  Assert.IsTrue(Format.IsIPv6('2001:db8:85a3::'))
})

Test('Should IsIPv6 6', () => {
  // All zeros (fully compressed)
  Assert.IsTrue(Format.IsIPv6('::'))
})

Test('Should IsIPv6 7', () => {
  // IPv4-mapped address (mixed notation)
  Assert.IsTrue(Format.IsIPv6('::ffff:192.168.1.1'))
})

Test('Should IsIPv6 8', () => {
  // Standard IPv6 unique local address example
  Assert.IsTrue(Format.IsIPv6('fc00::1'))
})

// 2. Invalid IPv6 Addresses (8 cases)

Test('Should IsIPv6 9', () => {
  // Too many segments (uncompressed, 9 segments)
  Assert.IsFalse(Format.IsIPv6('2001:db8:85a3:0:0:8a2e:370:7334:1'))
})

Test('Should IsIPv6 10', () => {
  // Too few segments (without '::', 7 segments)
  Assert.IsFalse(Format.IsIPv6('2001:db8:85a3:0:0:8a2e:370'))
})

Test('Should IsIPv6 11', () => {
  // Segment with too many digits (5 hex digits)
  Assert.IsFalse(Format.IsIPv6('2001:0db88:85a3::1'))
})

Test('Should IsIPv6 12', () => {
  // Contains invalid hexadecimal character ('G')
  Assert.IsFalse(Format.IsIPv6('2001:db8:85a3:G::1'))
})

Test('Should IsIPv6 13', () => {
  // Multiple '::' compressions (only one allowed)
  Assert.IsFalse(Format.IsIPv6('2001::db8::1'))
})

Test('Should IsIPv6 14', () => {
  // IPv4-mapped address with an invalid IPv4 part
  Assert.IsFalse(Format.IsIPv6('::ffff:192.168.1.256'))
})

Test('Should IsIPv6 15', () => {
  // Malformed compression (ending with three colons)
  Assert.IsFalse(Format.IsIPv6('2001:db8:::'))
})

Test('Should IsIPv6 16', () => {
  // Segment contains a space
  Assert.IsFalse(Format.IsIPv6('2001:db8:85a3:0: 0:8a2e:0370:7334'))
})
