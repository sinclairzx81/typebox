import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsJsonPointerUriFragment')

Test('Should JsonPointerFragment 1', () => {
  Assert.IsFalse(Format.IsJsonPointerUriFragment('not a fragment'))
})

Test('Should JsonPointerFragment 2', () => {
  Assert.IsTrue(Format.IsJsonPointerUriFragment('#'))
})

Test('Should JsonPointerFragment 3', () => {
  Assert.IsTrue(Format.IsJsonPointerUriFragment('#/foo'))
})

Test('Should JsonPointerFragment 4', () => {
  Assert.IsTrue(Format.IsJsonPointerUriFragment('#/foo/bar'))
})

Test('Should JsonPointerFragment 5', () => {
  Assert.IsTrue(Format.IsJsonPointerUriFragment('#/foo~0bar'))
})

Test('Should JsonPointerFragment 6', () => {
  Assert.IsTrue(Format.IsJsonPointerUriFragment('#/foo~1bar'))
})

Test('Should JsonPointerFragment 7', () => {
  Assert.IsTrue(Format.IsJsonPointerUriFragment('#/a~1b~1c'))
})

Test('Should JsonPointerFragment 8', () => {
  Assert.IsTrue(Format.IsJsonPointerUriFragment('#/0'))
})

Test('Should JsonPointerFragment 9', () => {
  Assert.IsTrue(Format.IsJsonPointerUriFragment('#/foo/0'))
})

Test('Should JsonPointerFragment 10', () => {
  Assert.IsTrue(Format.IsJsonPointerUriFragment('#/foo~1~0bar'))
})

Test('Should JsonPointerFragment 11', () => {
  Assert.IsFalse(Format.IsJsonPointerUriFragment('/foo/bar')) // missing '#'
})

Test('Should JsonPointerFragment 12', () => {
  Assert.IsFalse(Format.IsJsonPointerUriFragment('#foo/bar')) // missing leading '/'
})

Test('Should JsonPointerFragment 13', () => {
  Assert.IsFalse(Format.IsJsonPointerUriFragment('#/foo~2bar')) // invalid escape
})

Test('Should JsonPointerFragment 14', () => {
  Assert.IsFalse(Format.IsJsonPointerUriFragment('#/foo~')) // incomplete escape
})

Test('Should JsonPointerFragment 15', () => {
  Assert.IsFalse(Format.IsJsonPointerUriFragment('#/foo bar')) // space not allowed
})

Test('Should JsonPointerFragment 16', () => {
  Assert.IsFalse(Format.IsJsonPointerUriFragment('##/foo')) // double '#'
})
