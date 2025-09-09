import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsIri')

Test('Should IsIri 1', () => {
  Assert.IsFalse(Format.IsIri('not a iri'))
})

Test('Should IsIri 2', () => {
  Assert.IsTrue(Format.IsIri('http://example.com'))
})

Test('Should IsIri 3', () => {
  Assert.IsTrue(Format.IsIri('https://example.com/path?query=1#fragment'))
})

Test('Should IsIri 4', () => {
  Assert.IsTrue(Format.IsIri('ftp://user:pass@example.com:21/resource'))
})

Test('Should IsIri 5', () => {
  Assert.IsFalse(Format.IsIri('example.com'))
})

Test('Should IsIri 6', () => {
  Assert.IsFalse(Format.IsIri('://missing.scheme.com'))
})

Test('Should IsIri 7', () => {
  Assert.IsTrue(Format.IsIri('urn:isbn:0451450523'))
})

Test('Should IsIri 8', () => {
  Assert.IsTrue(Format.IsIri('mailto:user@example.com'))
})

Test('Should IsIri 9', () => {
  Assert.IsTrue(Format.IsIri('http://例子.测试'))
})

Test('Should IsIri 10', () => {
  Assert.IsFalse(Format.IsIri(''))
})

Test('Should IsIri 11', () => {
  Assert.IsFalse(Format.IsIri('http://'))
})

Test('Should IsIri 12', () => {
  Assert.IsTrue(Format.IsIri('http://user:pass@host:8080/path;params?query#frag'))
})

Test('Should IsIri 13', () => {
  Assert.IsTrue(Format.IsIri('ldap://[2001:db8::7]/c=GB?objectClass?one'))
})

Test('Should IsIri 14', () => {
  Assert.IsFalse(Format.IsIri('http://exa mple.com'))
})
