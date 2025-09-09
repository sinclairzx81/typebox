import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsHostname')

Test('Should IsHostname 1', () => {
  // Should validate a simple single-label hostname
  Assert.IsTrue(Format.IsHostname('localhost'))
})

Test('Should IsHostname 2', () => {
  // Should validate a multi-label hostname
  Assert.IsTrue(Format.IsHostname('sub.example.com'))
})

Test('Should IsHostname 3', () => {
  // Should validate a hostname with hyphens in labels
  Assert.IsTrue(Format.IsHostname('my-app.dev-env.domain.co.uk'))
})

Test('Should IsHostname 4', () => {
  // Should validate a hostname with numeric labels
  Assert.IsTrue(Format.IsHostname('123.456.com'))
})

Test('Should IsHostname 5', () => {
  // Should validate a hostname with single-character labels
  Assert.IsTrue(Format.IsHostname('a.b.c'))
})

Test('Should IsHostname 6', () => {
  // Should validate a hostname with mixed case (due to /i flag)
  Assert.IsTrue(Format.IsHostname('MyHost.Example.COM'))
})

Test('Should IsHostname 7', () => {
  // Should validate a fully qualified domain name (FQDN) with a trailing dot
  Assert.IsTrue(Format.IsHostname('example.com.'))
})

Test('Should IsHostname 8', () => {
  Assert.IsTrue(Format.IsHostname('1.domain.net'))
})

Test('Should IsHostname 9', () => {
  Assert.IsTrue(Format.IsHostname('ab-12-cd.host-name.org'))
})

Test('Should IsHostname 10', () => {
  const longLabel = 'a'.repeat(63)
  Assert.IsTrue(Format.IsHostname(`${longLabel}.com`))
})

Test('Should IsHostname 11', () => {
  // Should validate a hostname with total length near max (243 chars, no trailing dot).
  // Max FQDN length is 255. Regex (?=.{1,253}\.?) allows max 253 without dot, 254 with dot.
  const longHostname = 'a'.repeat(60) + '.' + 'b'.repeat(60) + '.' + 'c'.repeat(60) + '.' + 'd'.repeat(60)
  Assert.IsTrue(longHostname.length === 243) // Confirm generated length
  Assert.IsTrue(Format.IsHostname(longHostname))
})

Test('Should IsHostname 12', () => {
  // Should validate a hostname with total length near max (244 chars, with trailing dot).
  // Regex (?=.{1,253}\.?) allows max 254 with dot.
  const longHostname = 'a'.repeat(60) + '.' + 'b'.repeat(60) + '.' + 'c'.repeat(60) + '.' + 'd'.repeat(60) + '.'
  Assert.IsTrue(longHostname.length === 244) // Confirm generated length
  Assert.IsTrue(Format.IsHostname(longHostname))
})

Test('Should IsHostname 13', () => {
  Assert.IsFalse(Format.IsHostname(''))
})

Test('Should IsHostname 14', () => {
  Assert.IsFalse(Format.IsHostname('-host.com'))
})

Test('Should IsHostname 15', () => {
  Assert.IsFalse(Format.IsHostname('host-.com'))
})

Test('Should IsHostname 16', () => {
  Assert.IsFalse(Format.IsHostname('sub.-domain.com'))
})

Test('Should IsHostname 17', () => {
  Assert.IsFalse(Format.IsHostname('sub.domain-.com'))
})

Test('Should IsHostname 18', () => {
  Assert.IsTrue(Format.IsHostname('host--name.com'))
})

Test('Should IsHostname 19', () => {
  // Should invalidate hostname with invalid characters (underscore)
  Assert.IsFalse(Format.IsHostname('my_host.com'))
})

Test('Should IsHostname 20', () => {
  // Should invalidate hostname with spaces
  Assert.IsFalse(Format.IsHostname('my host.com'))
})

Test('Should IsHostname 21', () => {
  // Should invalidate hostname with other special characters (!)
  Assert.IsFalse(Format.IsHostname('my!host.com'))
})

Test('Should IsHostname 22', () => {
  // Should invalidate a hostname label that is too long (64 characters)
  const tooLongLabel = 'a'.repeat(64)
  Assert.IsFalse(Format.IsHostname(`${tooLongLabel}.com`))
})

Test('Should IsHostname 23', () => {
  // Should invalidate a hostname with total length exceeding 253 (no trailing dot)
  // 4 labels of 63 chars each + 3 dots = 255 chars total.
  // This exceeds the 253 limit from the `.{1,253}\.?$` lookahead when there's no trailing dot.
  const host = 'a'.repeat(63) + '.' + 'a'.repeat(63) + '.' + 'a'.repeat(63) + '.' + 'a'.repeat(63)
  Assert.IsFalse(Format.IsHostname(host))
})

Test('Should IsHostname 24', () => {
  // Should invalidate a hostname with total length exceeding 254 (with trailing dot)
  // 4 labels of 63 chars each + 3 dots + 1 trailing dot = 256 chars total.
  // This exceeds the 253 limit from `.{1,253}\.?$`, as .? allows one dot. So max length 254.
  const host = 'a'.repeat(63) + '.' + 'a'.repeat(63) + '.' + 'a'.repeat(63) + '.' + 'a'.repeat(63) + '.'
  Assert.IsFalse(Format.IsHostname(host))
})

Test('Should IsHostname 25', () => {
  // Should invalidate hostname with empty labels (e.g., a..b)
  Assert.IsFalse(Format.IsHostname('a..b.com'))
})

Test('Should IsHostname 26', () => {
  // Should invalidate hostname starting with a dot
  Assert.IsFalse(Format.IsHostname('.example.com'))
})

Test('Should IsHostname 27', () => {
  // Should invalidate a single dot as a hostname
  Assert.IsFalse(Format.IsHostname('.'))
})

Test('Should IsHostname 28', () => {
  // Should invalidate a hostname ending with two dots (invalid FQDN)
  Assert.IsFalse(Format.IsHostname('example.com..'))
})

Test('Should IsHostname 29', () => {
  // Should validate an IP address (not conforming to hostname label rules, even if numeric labels are allowed)
  Assert.IsTrue(Format.IsHostname('192.168.1.1'))
})

Test('Should IsHostname 30', () => {
  // Should validate a hostname that looks like an invalid IP address (due to label value)
  Assert.IsTrue(Format.IsHostname('256.0.0.0'))
})

Test('Should IsHostname 31', () => {
  // Should invalidate a hostname with a label that starts with a number but ends with a hyphen (not allowed by regex)
  Assert.IsFalse(Format.IsHostname('123-.com'))
})

Test('Should IsHostname 32', () => {
  // Should invalidate a hostname with a label that starts with a hyphen but contains a letter (not allowed by regex)
  Assert.IsFalse(Format.IsHostname('-a.com'))
})

Test('Should IsHostname 33', () => {
  // Should invalidate hostname containing a null byte
  Assert.IsFalse(Format.IsHostname('example.com\x00'))
})

Test('Should IsHostname 34', () => {
  // Should invalidate a hostname composed only of hyphens (e.g., ---)
  Assert.IsFalse(Format.IsHostname('---'))
})

Test('Should IsHostname 35', () => {
  // Should invalidate a hostname that is too short (less than 1 character)
  Assert.IsFalse(Format.IsHostname(''))
})

Test('Should IsHostname 36', () => {
  // Should invalidate a hostname with a label composed only of numbers and hyphens where first/last are hyphens
  Assert.IsFalse(Format.IsHostname('1-2-3-.com')) // Ends with hyphen
})

Test('Should IsHostname 37', () => {
  Assert.IsFalse(Format.IsHostname('-1-2-3.com')) // Starts with hyphen
})

Test('Should IsHostname 38', () => {
  // Should validate a single character hostname (edge case)
  Assert.IsTrue(Format.IsHostname('a'))
})

Test('Should IsHostname 39', () => {
  Assert.IsTrue(Format.IsHostname('example.123'))
})
