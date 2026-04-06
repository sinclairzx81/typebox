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
  Assert.IsFalse(Format.IsHostname('example.com.'))
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
  // Hostname with trailing dot. invalid per JSON Schema "hostname" format
  // (even though DNS FQDNs may allow it, the spec disallows it).
  const longHostname = 'a'.repeat(60) + '.' + 'b'.repeat(60) + '.' + 'c'.repeat(60) + '.' + 'd'.repeat(60) + '.'
  Assert.IsTrue(longHostname.length === 244) // Confirm generated length
  Assert.IsFalse(Format.IsHostname(longHostname))
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
Test('Should IsHostname 40', () => {
  // Hostname at maximum allowed length (253 characters) without trailing dot.
  // The implementation enforces max total length of 253 (RFC 1034/1123 + JSON Schema).
  const adjustedLabels = ['a'.repeat(63), 'b'.repeat(63), 'c'.repeat(63), 'd'.repeat(61)]
  const maxHostname = adjustedLabels.join('.')
  Assert.IsTrue(maxHostname.length === 253)
  Assert.IsTrue(Format.IsHostname(maxHostname))
})
Test('Should IsHostname 41', () => {
  // Should invalidate labels with hyphens in the 3rd and 4th positions
  // (Reserved for A-labels/Punycode, but missing the 'xn' prefix)
  Assert.IsFalse(Format.IsHostname('aa--bb.com'))
})
Test('Should IsHostname 42', () => {
  // Should invalidate even if it's the only label
  Assert.IsFalse(Format.IsHostname('ab--c'))
})
Test('Should IsHostname 43', () => {
  // Should invalidate if the reserved hyphen pattern is in a sub-label
  Assert.IsFalse(Format.IsHostname('example.hi--there.com'))
})
Test('Should IsHostname 44', () => {
  // Should validate valid Punycode labels (these start with xn-- so they
  // bypass the "Internal Dash" restriction)
  Assert.IsTrue(Format.IsHostname('xn--7ca.com'))
})
// ------------------------------------------------------------------
// PunyCode Coverage
// ------------------------------------------------------------------
Test('Should IsHostname 45', () => {
  // This triggers: if (cp >= 128) throw new Error(...)
  // The 'é' (0xE9) is >= 128.
  // Even though 'xn--' labels usually don't have these, the decoder must catch them if they appear before the '-'
  Assert.IsFalse(Format.IsHostname('xn--abcé-stack.com'))
})
Test('Should IsHostname 46', () => {
  // This triggers: if (ch >= 0x61 && ch <= 0x7a)
  // 'xn--mca' decodes to 'α'
  Assert.IsTrue(Format.IsHostname('xn--mca.com'))
})
Test('Should IsHostname 47', () => {
  // This triggers: else if (ch >= 0x41 && ch <= 0x5a)
  // Punycode is case-insensitive. 'xn--MCA' is the same as 'xn--mca'
  Assert.IsTrue(Format.IsHostname('xn--MCA.com'))
})
Test('Should IsHostname 48', () => {
  // This triggers: else if (ch >= 0x30 && ch <= 0x39)
  // Numbers are used for higher-value transitions in the variable-length integers
  Assert.IsTrue(Format.IsHostname('xn--4ca.com'))
})
Test('Should IsHostname 49', () => {
  // This triggers: else throw new Error('Invalid punycode: bad digit character')
  // Note: IsHostname usually filters out non-alphanumerics,
  // but if a character like '_' or '%' somehow reached the decoder:
  Assert.IsFalse(Format.IsHostname('xn--abc_def.com'))
})
Test('Should IsHostname 50', () => {
  // This triggers: throw new Error('Invalid punycode: unexpected end of input')
  // Truncated punycode where the variable-length integer is incomplete
  Assert.IsFalse(Format.IsHostname('xn--m.com'))
})
