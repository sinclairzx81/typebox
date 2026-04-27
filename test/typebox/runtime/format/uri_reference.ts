import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.UriReference')

Test('Should UriReference 1', () => {
  Assert.IsTrue(Format.IsUriReference('x')) // simple relative
})

Test('Should UriReference 2', () => {
  Assert.IsTrue(Format.IsUriReference('foo/bar'))
})

Test('Should UriReference 3', () => {
  Assert.IsTrue(Format.IsUriReference('../up'))
})

Test('Should UriReference 4', () => {
  Assert.IsTrue(Format.IsUriReference('?query=1'))
})

Test('Should UriReference 5', () => {
  Assert.IsTrue(Format.IsUriReference('#frag'))
})

Test('Should UriReference 6', () => {
  Assert.IsTrue(Format.IsUriReference('/absolute/path'))
})

Test('Should UriReference 7', () => {
  Assert.IsTrue(Format.IsUriReference('//authority/path'))
})

Test('Should UriReference 8', () => {
  Assert.IsTrue(Format.IsUriReference('http://example.com'))
})

Test('Should UriReference 9', () => {
  Assert.IsTrue(Format.IsUriReference('mailto:user@example.com'))
})

Test('Should UriReference 10', () => {
  Assert.IsTrue(Format.IsUriReference('urn:isbn:0451450523'))
})

Test('Should UriReference 11', () => {
  Assert.IsFalse(Format.IsUriReference('exa mple.com')) // space
})
