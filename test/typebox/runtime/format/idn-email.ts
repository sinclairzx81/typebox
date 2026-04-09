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
// ------------------------------------------------------------------
// IdnEmail: Valid
//
// https://github.com/sinclairzx81/typebox/issues/1574
// ------------------------------------------------------------------
Test('Should IsIdnEmail 13', () => {
  Assert.IsTrue(Format.IsIdnEmail('test@example.com'))
})
Test('Should IsIdnEmail 14', () => {
  Assert.IsTrue(Format.IsIdnEmail('user.name+tag@domain.co.uk'))
})
Test('Should IsIdnEmail 15', () => {
  Assert.IsTrue(Format.IsIdnEmail('a@b.cd'))
})
Test('Should IsIdnEmail 16', () => {
  Assert.IsTrue(Format.IsIdnEmail('user@sub.domain.com'))
})
Test('Should IsIdnEmail 17', () => {
  Assert.IsTrue(Format.IsIdnEmail('first.last@example.org'))
})
Test('Should IsIdnEmail 18', () => {
  Assert.IsTrue(Format.IsIdnEmail('test@例子.测试'))
})
Test('Should IsIdnEmail 19', () => {
  Assert.IsTrue(Format.IsIdnEmail('user@müller.example.com'))
})
Test('Should IsIdnEmail 20', () => {
  Assert.IsTrue(Format.IsIdnEmail('test@스타벅스.코리아'))
})
Test('Should IsIdnEmail 21', () => {
  Assert.IsTrue(Format.IsIdnEmail('user@παράδειγμα.δοκιμή'))
})
Test('Should IsIdnEmail 22', () => {
  Assert.IsTrue(Format.IsIdnEmail('test@россия.рф'))
})
Test('Should IsIdnEmail 23', () => {
  Assert.IsTrue(Format.IsIdnEmail('user@東京.jp'))
})
Test('Should IsIdnEmail 24', () => {
  Assert.IsTrue(Format.IsIdnEmail('test@fußball.example.com'))
})
Test('Should IsIdnEmail 25', () => {
  Assert.IsTrue(Format.IsIdnEmail('user@café.fr'))
})
Test('Should IsIdnEmail 26', () => {
  Assert.IsTrue(Format.IsIdnEmail('test@bücher.example.com'))
})
Test('Should IsIdnEmail 27', () => {
  Assert.IsTrue(Format.IsIdnEmail('user@example.com'))
})
Test('Should IsIdnEmail 28', () => {
  Assert.IsTrue(Format.IsIdnEmail('user@例子.测试'))
})
// ------------------------------------------------------------------
// IdnEmail: Invalid
//
// https://github.com/sinclairzx81/typebox/issues/1574
// ------------------------------------------------------------------
Test('Should IsIdnEmail 29', () => {
  Assert.IsFalse(Format.IsIdnEmail('test@'))
})
Test('Should IsIdnEmail 30', () => {
  Assert.IsFalse(Format.IsIdnEmail('@domain.com'))
})
Test('Should IsIdnEmail 31', () => {
  Assert.IsFalse(Format.IsIdnEmail('user@domain..com'))
})
Test('Should IsIdnEmail 32', () => {
  Assert.IsFalse(Format.IsIdnEmail('@例子.测试'))
})
Test('Should IsIdnEmail 33', () => {
  Assert.IsFalse(Format.IsIdnEmail('user@..例子.测试'))
})
