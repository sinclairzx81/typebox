import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsIdnEmail')

Test('Should IsIdnEmail 1', () => {
  // Simple, standard ASCII email address
  Assert.IsTrue(Format.IsIdnEmail('test@example.com'))
})

Test('Should IsIdnEmail 2', () => {
  // Local part with common allowed special characters
  Assert.IsTrue(Format.IsIdnEmail('firstname.lastname+tag@sub.domain.co.uk'))
})

Test('Should IsIdnEmail 3', () => {
  // Local part with numbers and hyphens
  Assert.IsTrue(Format.IsIdnEmail('user-123@example-mail.net'))
})

Test('Should IsIdnEmail 4', () => {
  // Domain with multiple subdomains
  Assert.IsTrue(Format.IsIdnEmail('info@mail.sub.example.org'))
})

Test('Should IsIdnEmail 5', () => {
  // Valid IDN domain in Punycode format
  Assert.IsTrue(Format.IsIdnEmail('user@xn--bcher-kva.com')) // Represents user@bücher.com
})

Test('Should IsIdnEmail 6', () => {
  // Valid IDN domain in Unicode (assuming the validator handles conversion or direct Unicode)
  Assert.IsTrue(Format.IsIdnEmail('user@bücher.com'))
})

Test('Should IsIdnEmail 7', () => {
  // Email address with a long local part (within typical 64-char limit)
  Assert.IsTrue(Format.IsIdnEmail('really.long.local.part.with.many.segments.and.numbers.1234567890@domain.com'))
})

Test('Should IsIdnEmail 8', () => {
  // Email address with a long IDN domain part (within total 255-char limit for FQDN)
  const longIdnDomain = 'user@' + 'a'.repeat(60) + '.' + 'b'.repeat(60) + '.' + 'c'.repeat(60) + '.' + 'd'.repeat(60) + '.xn--tst'
  Assert.IsTrue(Format.IsIdnEmail(longIdnDomain))
})

Test('Should IsIdnEmail 9', () => {
  // Missing '@' symbol
  Assert.IsFalse(Format.IsIdnEmail('testexample.com'))
})

Test('Should IsIdnEmail 10', () => {
  // Local part starts with a dot
  Assert.IsFalse(Format.IsIdnEmail('.test@example.com'))
})

Test('Should IsIdnEmail 11', () => {
  // Local part ends with a dot
  Assert.IsFalse(Format.IsIdnEmail('test.@example.com'))
})

Test('Should IsIdnEmail 12', () => {
  // Local part with consecutive dots
  Assert.IsFalse(Format.IsIdnEmail('test..user@example.com'))
})

Test('Should IsIdnEmail 13', () => {
  // Domain part contains an invalid character (underscore)
  Assert.IsFalse(Format.IsIdnEmail('test@domain_name.com'))
})

Test('Should IsIdnEmail 14', () => {
  // Domain part label starts with a hyphen
  Assert.IsFalse(Format.IsIdnEmail('test@-domain.com'))
})

Test('Should IsIdnEmail 15', () => {
  // Domain part label is too long (exceeds 63 characters)
  const tooLongLabel = 'a'.repeat(64)
  Assert.IsFalse(Format.IsIdnEmail(`test@${tooLongLabel}.com`))
})

Test('Should IsIdnEmail 16', () => {
  // IDN domain part ends with a hyphen (invalid for labels)
  Assert.IsFalse(Format.IsIdnEmail('user@bücher-.com'))
})
