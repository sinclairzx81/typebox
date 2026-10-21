import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsEmail')

Test('Should IsEmail 1', () => {
  Assert.IsTrue(Format.IsEmail('user@example.com'))
})
Test('Should IsEmail 2', () => {
  Assert.IsTrue(Format.IsEmail('firstname.lastname@example.com'))
})
Test('Should IsEmail 3', () => {
  Assert.IsTrue(Format.IsEmail('user123@sub.domain.co.uk'))
})
Test('Should IsEmail 4', () => {
  Assert.IsTrue(Format.IsEmail('user+alias@example.com'))
})
Test('Should IsEmail 5', () => {
  Assert.IsTrue(Format.IsEmail('user-name@example.com'))
})
Test('Should IsEmail 6', () => {
  Assert.IsTrue(Format.IsEmail('user@localhost'))
})
Test('Should IsEmail 7', () => {
  Assert.IsTrue(Format.IsEmail('12345@example.com'))
})
Test('Should IsEmail 8', () => {
  Assert.IsFalse(Format.IsEmail(''))
})
Test('Should IsEmail 9', () => {
  Assert.IsTrue(Format.IsEmail('user@com'))
})
Test('Should IsEmail 10', () => {
  Assert.IsFalse(Format.IsEmail('@example.com'))
})
Test('Should IsEmail 11', () => {
  Assert.IsTrue(Format.IsEmail('user@example'))
})
Test('Should IsEmail 12', () => {
  Assert.IsFalse(Format.IsEmail('user example.com'))
})
Test('Should IsEmail 13', () => {
  Assert.IsFalse(Format.IsEmail('user@example..com'))
})
Test('Should IsEmail 14', () => {
  Assert.IsTrue(Format.IsEmail('user@[127.0.0.1]'))
})
Test('Should IsEmail 15', () => {
  Assert.IsFalse(Format.IsEmail('user@[256.0.0.1]'))
})
Test('Should IsEmail 16', () => {
  Assert.IsTrue(Format.IsEmail('user@[IPv6:::1]'))
})
Test('Should IsEmail 17', () => {
  Assert.IsTrue(Format.IsEmail('user@[IPv6:::ffff:192.0.2.1]'))
})
Test('Should IsEmail 18', () => {
  Assert.IsFalse(Format.IsEmail('user@[IPv6::::1]'))
})
Test('Should IsEmail 19', () => {
  Assert.IsTrue(Format.IsEmail('"local@part"@example.com'))
})

Test('Should IsEmail 20', () => {
  const prefix = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.`
  const email = `${prefix}${'d'.repeat(254 - prefix.length)}`
  Assert.IsEqual(email.length, 254)
  Assert.IsTrue(Format.IsEmail(email))
})

Test('Should IsEmail 21', () => {
  const prefix = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.`
  const email = `${prefix}${'d'.repeat(255 - prefix.length)}`
  Assert.IsEqual(email.length, 255)
  Assert.IsTrue(Format.IsEmail(email))
})

Test('Should IsEmail 22', () => {
  Assert.IsFalse(Format.IsEmail('"a\r\nBcc: x"@example.com'))
})
