import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsIdnHostname')

Test('Should IsIdnHostname 1', () => {
  // Simple ASCII hostname (still valid as an IDN hostname)
  Assert.IsTrue(Format.IsIdnHostname('example.com'))
})

Test('Should IsIdnHostname 2', () => {
  // Hostname with a Punycode label
  Assert.IsTrue(Format.IsIdnHostname('xn--bcher-kva.com')) // Represents bücher.com
})

Test('Should IsIdnHostname 3', () => {
  // Hostname with a Unicode label (assuming validator handles conversion or direct validation)
  Assert.IsTrue(Format.IsIdnHostname('bücher.com'))
})

Test('Should IsIdnHostname 4', () => {
  // Hostname with mixed ASCII and Punycode labels
  Assert.IsTrue(Format.IsIdnHostname('sub.xn--domain-name.com')) // Represents sub.доменное-имя.com
})

Test('Should IsIdnHostname 5', () => {
  // Hostname with multiple Unicode labels
  Assert.IsTrue(Format.IsIdnHostname('北京.cn')) // Represents Beijing.cn
})

Test('Should IsIdnHostname 6', () => {
  // Hostname with hyphens in ASCII and IDN labels (converted to Punycode)
  Assert.IsTrue(Format.IsIdnHostname('my-host.xn--abc-def.info')) // Represents my-host.абв-где.info
})

Test('Should IsIdnHostname 7', () => {
  Assert.IsFalse(Format.IsIdnHostname('xn--test-wq7.com.')) // Represents testü.com.
})

Test('Should IsIdnHostname 8', () => {
  const longPunycodeLabel = 'xn--abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz0123456789a-0d'
  Assert.IsFalse(Format.IsIdnHostname(`${longPunycodeLabel}.com`))
})

Test('Should IsIdnHostname 9', () => {
  // Invalid character in a hostname (space)
  Assert.IsFalse(Format.IsIdnHostname('my host.com'))
})

Test('Should IsIdnHostname 10', () => {
  // IDN label starts with a hyphen (invalid after Punycode conversion)
  Assert.IsFalse(Format.IsIdnHostname('-bücher.com'))
})

Test('Should IsIdnHostname 11', () => {
  // IDN label ends with a hyphen (invalid after Punycode conversion)
  Assert.IsFalse(Format.IsIdnHostname('bücher-.com'))
})

Test('Should IsIdnHostname 12', () => {
  // Malformed Punycode (invalid 'xn--' prefix followed by no data)
  Assert.IsFalse(Format.IsIdnHostname('xn--.com'))
})

Test('Should IsIdnHostname 13', () => {
  const longUnicodeLabel = '我'.repeat(25) + '.com'
  Assert.IsTrue(Format.IsIdnHostname(longUnicodeLabel))
})

Test('Should IsIdnHostname 14', () => {
  // Overall hostname too long after Punycode conversion (exceeds 255 characters total)
  // 4 labels of 63 chars (Punycode assumed) + 3 dots = 255 chars total, which is the limit.
  // The underlying `IsHostname` regex lookahead `(?=.{1,253}\.?)` implies 253 without dot, 254 with.
  // So 255 without a trailing dot should fail.
  const maxLabel = 'a'.repeat(63)
  const hostnameTooLong = `${maxLabel}.${maxLabel}.${maxLabel}.${maxLabel}` // 255 chars
  Assert.IsFalse(Format.IsIdnHostname(hostnameTooLong))
})

Test('Should IsIdnHostname 15', () => {
  Assert.IsFalse(Format.IsIdnHostname('xn--a.com..xn--b.com'))
})

Test('Should IsIdnHostname 16', () => {
  Assert.IsTrue(Format.IsIdnHostname('xn--a--b.com')) // Represents a--b.com
})

// --- Additional coverage tests for IsIdnHostname ---

Test('Should IsIdnHostname Middle Dot valid', () => {
  // U+00B7 flanked by 'l' (valid)
  Assert.IsTrue(Format.IsIdnHostname('ll·l.com'))
})

Test('Should IsIdnHostname Middle Dot invalid', () => {
  // U+00B7 not flanked by 'l' (invalid)
  Assert.IsFalse(Format.IsIdnHostname('l·a.com'))
})

Test('Should IsIdnHostname Katakana Middle Dot valid', () => {
  // U+30FB flanked by Katakana (valid)
  Assert.IsTrue(Format.IsIdnHostname('ア・カ.com'))
})

Test('Should IsIdnHostname Katakana Middle Dot invalid', () => {
  // U+30FB not flanked by valid char (invalid)
  Assert.IsFalse(Format.IsIdnHostname('・a.com'))
})

Test('Should IsIdnHostname Greek Keraia valid', () => {
  // U+0375 followed by Greek (valid)
  Assert.IsTrue(Format.IsIdnHostname('test.͵Α.com'))
})

Test('Should IsIdnHostname Greek Keraia invalid', () => {
  // U+0375 not followed by Greek (invalid)
  Assert.IsFalse(Format.IsIdnHostname('test.͵A.com'))
})

Test('Should IsIdnHostname Hebrew Geresh valid', () => {
  // U+05F3 preceded by Hebrew (valid)
  Assert.IsTrue(Format.IsIdnHostname('test.אב׳.com'))
})

Test('Should IsIdnHostname Hebrew Geresh invalid', () => {
  // U+05F3 not preceded by Hebrew (invalid)
  Assert.IsFalse(Format.IsIdnHostname('test.a׳.com'))
})

Test('Should IsIdnHostname Zero Width Joiner valid', () => {
  // U+200D preceded by U+094D (valid)
  Assert.IsTrue(Format.IsIdnHostname('test.क्‍ष.com'))
})

Test('Should IsIdnHostname Zero Width Joiner invalid', () => {
  // U+200D not preceded by U+094D (invalid)
  Assert.IsFalse(Format.IsIdnHostname('test.a‍b.com'))
})
