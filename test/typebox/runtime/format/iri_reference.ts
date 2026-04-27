import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsIriReference')

Test('Should IsIriReference 1', () => {
  // Absolute IRI with Unicode characters in the path
  Assert.IsTrue(Format.IsIriReference('http://example.com/páth/to/rèsource'))
})

Test('Should IsIriReference 2', () => {
  // Relative IRI with Unicode in the query string
  Assert.IsTrue(Format.IsIriReference('/search?qüery=tëst'))
})

Test('Should IsIriReference 3', () => {
  // Absolute IRI with percent-encoded Unicode (e.g., %C3%A9 for 'é')
  Assert.IsTrue(Format.IsIriReference('https://example.org/document/%C3%A9tude.pdf'))
})

Test('Should IsIriReference 4', () => {
  // Empty string is a valid relative IRI reference (refers to the current document)
  Assert.IsTrue(Format.IsIriReference(''))
})

// 2. Invalid IRI References (4 cases)

Test('Should IsIriReference 5', () => {
  // Contains an unencoded space (spaces must be percent-encoded)
  Assert.IsFalse(Format.IsIriReference('http://example.com/file name.txt'))
})

Test('Should IsIriReference 6', () => {
  // Malformed scheme (missing colon after scheme name)
  Assert.IsFalse(Format.IsIriReference('httpx//example.com/path'))
})

Test('Should IsIriReference 7', () => {
  // Invalid percent-encoding (percent sign followed by less than two hex digits)
  Assert.IsFalse(Format.IsIriReference('http://example.com/data%Z'))
})

Test('Should IsIriReference 8', () => {
  // Contains a control character (e.g., NULL byte \u0000) directly
  Assert.IsFalse(Format.IsIriReference('http://example.com/path\u0000segment'))
})

// Forbidden character: backslash
Test('Should IsIriReference 9', () => {
  Assert.IsFalse(Format.IsIriReference('http://example.com/path\\segment'))
})

// Forbidden character: DEL control character
Test('Should IsIriReference 11', () => {
  Assert.IsFalse(Format.IsIriReference('http://example.com/path\x7Fsegment'))
})

// Malformed scheme/authority (looks like scheme but missing colon)
Test('Should IsIriReference 12', () => {
  Assert.IsFalse(Format.IsIriReference('abc//example.com'))
})

// Valid absolute IRI with a valid scheme prefix
Test('Should IsIriReference 13', () => {
  Assert.IsTrue(Format.IsIriReference('ftp://example.com/resource'))
})

// Relative IRI with valid path (triggers relative fallback)
Test('Should IsIriReference 14', () => {
  Assert.IsTrue(Format.IsIriReference('folder/file.txt'))
})

// Relative IRI with query only (triggers relative fallback)
Test('Should IsIriReference 15', () => {
  Assert.IsTrue(Format.IsIriReference('?foo=bar'))
})

// Relative IRI with fragment only (triggers relative fallback)
Test('Should IsIriReference 16', () => {
  Assert.IsTrue(Format.IsIriReference('#section'))
})

Test('Should IsIriReference 17', () => {
  // Looks like malformed scheme/authority, but colon is present
  Assert.IsTrue(Format.IsIriReference('abc://example.com'))
})
