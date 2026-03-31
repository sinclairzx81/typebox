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

Test('Should IsUri 17', () => {
  Assert.IsTrue(Format.IsUri('HTTP://example.com')) // uppercase scheme A-Z
})

Test('Should IsUri 18', () => {
  Assert.IsTrue(Format.IsUri('coap+tcp://example.com')) // '+' in scheme
})

Test('Should IsUri 19', () => {
  Assert.IsTrue(Format.IsUri('my-scheme://example.com')) // '-' in scheme
})

Test('Should IsUri 20', () => {
  Assert.IsTrue(Format.IsUri('my.scheme://example.com')) // '.' in scheme
})

Test('Should IsUri 21', () => {
  Assert.IsTrue(Format.IsUri('h2://example.com')) // digit in scheme
})

Test('Should IsUri 22', () => {
  Assert.IsTrue(Format.IsUri('hTtP://example.com')) // mixed case scheme a-z and A-Z
})

Test('Should IsUri 23', () => {
  Assert.IsFalse(Format.IsUri('http://example.com\t')) // tab
})

Test('Should IsUri 24', () => {
  Assert.IsFalse(Format.IsUri('http://example.com\n')) // newline
})

Test('Should IsUri 25', () => {
  Assert.IsFalse(Format.IsUri('http://example.com\r')) // carriage return
})

Test('Should IsUri 26', () => {
  Assert.IsFalse(Format.IsUri('1http://example.com')) // starts with digit
})

Test('Should IsUri 27', () => {
  Assert.IsFalse(Format.IsUri('ht!tp://example.com')) // invalid char in scheme
})

Test('Should IsUri 28', () => {
  Assert.IsFalse(Format.IsUri('noscheme')) // missing ':'
})
Test('Should IsUri 29', () => {
  Assert.IsTrue(Format.IsUri('ldap://[2001:db8::7]/c=GB')) // IP-literal host
})

Test('Should IsUri 30', () => {
  Assert.IsTrue(Format.IsUri('http://user:pass@host/path')) // userinfo with ':'
})

Test('Should IsUri 31', () => {
  Assert.IsTrue(Format.IsUri('http://example.com:8080/path')) // valid port
})

Test('Should IsUri 32', () => {
  Assert.IsFalse(Format.IsUri('http://example.com:abc/path')) // non-numeric port
})

Test('Should IsUri 33', () => {
  Assert.IsTrue(Format.IsUri('http://user%40name@example.com')) // valid percent-encoding in userinfo
})

Test('Should IsUri 34', () => {
  Assert.IsFalse(Format.IsUri('http://user%GGname@example.com')) // invalid percent-encoding in userinfo
})

Test('Should IsUri 35', () => {
  Assert.IsFalse(Format.IsUri('http://user%4@example.com')) // incomplete percent-encoding in userinfo
})

Test('Should IsUri 36', () => {
  Assert.IsFalse(Format.IsUri('http://user%@example.com')) // lone percent in userinfo
})

Test('Should IsUri 37', () => {
  Assert.IsFalse(Format.IsUri('http://user^name@example.com')) // invalid char in userinfo
})

Test('Should IsUri 38', () => {
  Assert.IsFalse(Format.IsUri('ldap://[2001:db8::7/c=GB')) // Missing ]
})
