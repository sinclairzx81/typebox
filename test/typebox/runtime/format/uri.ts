import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsUri')

Test('Should Uri 1', () => {
  Assert.IsFalse(Format.IsUri('x')) // not a URI
})

Test('Should Uri 2', () => {
  Assert.IsTrue(Format.IsUri('http://example.com'))
})

Test('Should Uri 3', () => {
  Assert.IsTrue(Format.IsUri('https://example.com/path?query=1#fragment'))
})

Test('Should Uri 4', () => {
  Assert.IsTrue(Format.IsUri('ftp://user:pass@example.com:21/resource'))
})

Test('Should Uri 5', () => {
  Assert.IsFalse(Format.IsUri('example.com')) // missing scheme
})

Test('Should Uri 6', () => {
  Assert.IsFalse(Format.IsUri('://missing.scheme.com')) // missing scheme
})

Test('Should Uri 7', () => {
  Assert.IsTrue(Format.IsUri('urn:isbn:0451450523'))
})

Test('Should Uri 8', () => {
  Assert.IsTrue(Format.IsUri('mailto:user@example.com'))
})

Test('Should Uri 9', () => {
  Assert.IsTrue(Format.IsUri('http://例子.测试')) // unicode host
})

Test('Should Uri 10', () => {
  Assert.IsFalse(Format.IsUri('')) // empty string
})

Test('Should Uri 11', () => {
  Assert.IsTrue(Format.IsUri('http://user:pass@host:8080/path;params?query#frag'))
})

Test('Should Uri 12', () => {
  Assert.IsTrue(Format.IsUri('ldap://[2001:db8::7]/c=GB?objectClass?one'))
})

Test('Should Uri 13', () => {
  Assert.IsFalse(Format.IsUri('http://exa mple.com')) // space in host
})

Test('Should Uri 14', () => {
  Assert.IsTrue(Format.IsUri('http://user:pass@host:8080/path;params?query#frag'))
})

Test('Should Uri 15', () => {
  Assert.IsTrue(Format.IsUri('ldap://[2001:db8::7]/c=GB?objectClass?one'))
})

Test('Should Uri 16', () => {
  Assert.IsFalse(Format.IsUri('http://exa mple.com')) // space in host
})
