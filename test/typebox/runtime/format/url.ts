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
  Assert.IsFalse(Format.IsUrl('******example.com:21/resource'))
})

Test('Should Url 5', () => {
  Assert.IsTrue(Format.IsUrl('https://example.com:8080'))
})

Test('Should Url 6', () => {
  Assert.IsFalse(Format.IsUrl('example.com'))
})

Test('Should Url 7', () => {
  Assert.IsFalse(Format.IsUrl('http:///example.com'))
})

Test('Should Url 8', () => {
  Assert.IsFalse(Format.IsUrl('http://'))
})

Test('Should Url 9', () => {
  Assert.IsFalse(Format.IsUrl('http://exa mple.com'))
})

Test('Should Url 10', () => {
  Assert.IsFalse(Format.IsUrl('ftp://'))
})

Test('Should Url 11', () => {
  Assert.IsFalse(Format.IsUrl('://missing.scheme.com'))
})

Test('Should Url 12', () => {
  Assert.IsFalse(Format.IsUrl(''))
})

Test('Should Url 13', () => {
  Assert.IsFalse(Format.IsUrl('http://example.com:port'))
})

Test('Should Url 14', () => {
  Assert.IsTrue(Format.IsUrl('http://8.8.8.8/'))
})

Test('Should Url 15', () => {
  Assert.IsFalse(Format.IsUrl('http://127.0.0.1/'))
})

Test('Should Url 16', () => {
  Assert.IsFalse(Format.IsUrl('http://localhost'))
})

Test('Should Url 17', () => {
  Assert.IsTrue(Format.IsUrl('http://example.com:80'))
})

Test('Should Url 18', () => {
  Assert.IsTrue(Format.IsUrl('ftp://example.com'))
})

Test('Should Url 19', () => {
  Assert.IsTrue(Format.IsUrl('http://example.com:65536'))
})

Test('Should Url 20', () => {
  Assert.IsFalse(Format.IsUrl('mailto:user@example.com'))
})

Test('Should Url 21', () => {
  Assert.IsFalse(Format.IsUrl('file:///etc/hosts'))
})

Test('Should Url 22', () => {
  Assert.IsTrue(Format.IsUrl('ws://example.com'))
})

Test('Should Url 23', () => {
  Assert.IsFalse(Format.IsUrl('http://10.0.0.1/'))
})

Test('Should Url 24', () => {
  Assert.IsFalse(Format.IsUrl('http://169.254.1.1/'))
})

Test('Should Url 25', () => {
  Assert.IsFalse(Format.IsUrl('http://192.168.0.1/'))
})

Test('Should Url 26', () => {
  Assert.IsFalse(Format.IsUrl('http://172.16.0.1/'))
})

Test('Should Url 27', () => {
  Assert.IsTrue(Format.IsUrl('http://bücher.example/'))
})

Test('Should Url 28', () => {
  Assert.IsTrue(Format.IsUrl('wss://example.com'))
})

Test('Should Url 29', () => {
  Assert.IsTrue(Format.IsUrl('ftps://example.com'))
})

Test('Should Url 30', () => {
  Assert.IsFalse(Format.IsUrl('https://127.0.0.1\\@example.com/'))
})

Test('Should Url 31', () => {
  Assert.IsFalse(Format.IsUrl('https://example.com/path\\file'))
})

Test('Should Url 32', () => {
  Assert.IsTrue(Format.IsUrl('https://user:pass@example.com/path'))
})
