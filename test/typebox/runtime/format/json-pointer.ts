import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsJsonPointer')

Test('Should JsonPointer 1', () => {
  Assert.IsFalse(Format.IsJsonPointer('not a pointer'))
})

Test('Should JsonPointer 2', () => {
  Assert.IsTrue(Format.IsJsonPointer('')) // empty string is valid
})

Test('Should JsonPointer 3', () => {
  Assert.IsTrue(Format.IsJsonPointer('/foo'))
})

Test('Should JsonPointer 4', () => {
  Assert.IsTrue(Format.IsJsonPointer('/foo/bar'))
})

Test('Should JsonPointer 5', () => {
  Assert.IsTrue(Format.IsJsonPointer('/foo~0bar'))
})

Test('Should JsonPointer 6', () => {
  Assert.IsTrue(Format.IsJsonPointer('/foo~1bar'))
})

Test('Should JsonPointer 7', () => {
  Assert.IsTrue(Format.IsJsonPointer('/a~1b~1c'))
})

Test('Should JsonPointer 8', () => {
  Assert.IsTrue(Format.IsJsonPointer('/0'))
})

Test('Should JsonPointer 9', () => {
  Assert.IsTrue(Format.IsJsonPointer('/foo/0'))
})

Test('Should JsonPointer 10', () => {
  Assert.IsTrue(Format.IsJsonPointer('/foo~1~0bar'))
})

Test('Should JsonPointer 11', () => {
  Assert.IsFalse(Format.IsJsonPointer('foo/bar')) // missing leading '/'
})

Test('Should JsonPointer 12', () => {
  Assert.IsFalse(Format.IsJsonPointer('/foo~2bar')) // invalid escape
})

Test('Should JsonPointer 13', () => {
  Assert.IsFalse(Format.IsJsonPointer('/foo~')) // incomplete escape
})
