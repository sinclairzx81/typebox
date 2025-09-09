import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsRelativeJsonPointer')

Test('Should RelativeJsonPointer 1', () => {
  Assert.IsFalse(Format.IsRelativeJsonPointer('x'))
})

Test('Should RelativeJsonPointer 2', () => {
  Assert.IsTrue(Format.IsRelativeJsonPointer('0')) // just zero
})

Test('Should RelativeJsonPointer 3', () => {
  Assert.IsTrue(Format.IsRelativeJsonPointer('1')) // just one
})

Test('Should RelativeJsonPointer 4', () => {
  Assert.IsTrue(Format.IsRelativeJsonPointer('0/foo'))
})

Test('Should RelativeJsonPointer 5', () => {
  Assert.IsTrue(Format.IsRelativeJsonPointer('2/bar/0'))
})

Test('Should RelativeJsonPointer 6', () => {
  Assert.IsTrue(Format.IsRelativeJsonPointer('0#')) // fragment
})

Test('Should RelativeJsonPointer 7', () => {
  Assert.IsTrue(Format.IsRelativeJsonPointer('1/foo#'))
})

Test('Should RelativeJsonPointer 8', () => {
  Assert.IsTrue(Format.IsRelativeJsonPointer('0/0/0'))
})

Test('Should RelativeJsonPointer 9', () => {
  Assert.IsTrue(Format.IsRelativeJsonPointer('3/bar~1baz'))
})

Test('Should RelativeJsonPointer 10', () => {
  Assert.IsTrue(Format.IsRelativeJsonPointer('0/foo~0bar'))
})

Test('Should RelativeJsonPointer 11', () => {
  Assert.IsTrue(Format.IsRelativeJsonPointer('0/foo~1bar'))
})

Test('Should RelativeJsonPointer 12', () => {
  Assert.IsFalse(Format.IsRelativeJsonPointer('-1/foo')) // negative number
})

Test('Should RelativeJsonPointer 13', () => {
  Assert.IsFalse(Format.IsRelativeJsonPointer('01/foo')) // leading zero
})

Test('Should RelativeJsonPointer 14', () => {
  Assert.IsFalse(Format.IsRelativeJsonPointer('0/foo~2bar')) // invalid escape
})

Test('Should RelativeJsonPointer 15', () => {
  Assert.IsFalse(Format.IsRelativeJsonPointer('0/foo~')) // incomplete escape
})
