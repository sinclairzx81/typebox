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
  Assert.IsFalse(Format.IsEmail('"DisplayName"@example.com'))
})

Test('Should IsEmail 9', () => {
  Assert.IsFalse(Format.IsEmail(''))
})

Test('Should IsEmail 10', () => {
  Assert.IsFalse(Format.IsEmail('user@.com'))
})

Test('Should IsEmail 11', () => {
  Assert.IsTrue(Format.IsEmail('user@com'))
})

Test('Should IsEmail 12', () => {
  Assert.IsFalse(Format.IsEmail('@example.com'))
})

Test('Should IsEmail 13', () => {
  Assert.IsTrue(Format.IsEmail('user@example'))
})

Test('Should IsEmail 14', () => {
  Assert.IsFalse(Format.IsEmail('user example.com'))
})

Test('Should IsEmail 15', () => {
  Assert.IsFalse(Format.IsEmail('user@example..com'))
})

Test('Should IsEmail 16', () => {
  Assert.IsFalse(Format.IsEmail('user@example_com'))
})
