import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsUrl')

Test('Should Url 1', () => {
  Assert.IsFalse(Format.IsUrl('x'))
})

Test('Should Url 2', () => {
  Assert.IsTrue(Format.IsUrl('http://example.com'))
})

Test('Should Url 3', () => {
  Assert.IsTrue(Format.IsUrl('https://example.com/path'))
})

Test('Should Url 4', () => {
  Assert.IsTrue(Format.IsUrl('ftp://user:pass@example.com:21/resource'))
})

Test('Should Url 5', () => {
  Assert.IsTrue(Format.IsUrl('https://example.com:8080'))
})

Test('Should Url 6', () => {
  Assert.IsFalse(Format.IsUrl('example.com')) // missing scheme
})

Test('Should Url 7', () => {
  Assert.IsFalse(Format.IsUrl('http:///example.com')) // empty host
})

Test('Should Url 8', () => {
  Assert.IsFalse(Format.IsUrl('http://')) // empty host
})

Test('Should Url 9', () => {
  Assert.IsFalse(Format.IsUrl('http://exa mple.com')) // space in host
})

Test('Should Url 10', () => {
  Assert.IsFalse(Format.IsUrl('ftp://')) // empty host
})

Test('Should Url 11', () => {
  Assert.IsFalse(Format.IsUrl('://missing.scheme.com')) // missing scheme
})

Test('Should Url 12', () => {
  Assert.IsFalse(Format.IsUrl('')) // empty string
})

Test('Should Url 13', () => {
  Assert.IsFalse(Format.IsUrl('http://example.com:port')) // invalid port
})
