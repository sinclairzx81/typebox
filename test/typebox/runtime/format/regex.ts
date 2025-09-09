import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsRegex')

Test('Should RegEx 1', () => {
  Assert.IsTrue(Format.IsRegex('x'))
})

Test('Should RegEx 2', () => {
  Assert.IsTrue(Format.IsRegex('^abc$'))
})

Test('Should RegEx 3', () => {
  Assert.IsTrue(Format.IsRegex('[a-z]+'))
})

Test('Should RegEx 4', () => {
  Assert.IsTrue(Format.IsRegex('\\d{2,4}'))
})

Test('Should RegEx 5', () => {
  Assert.IsTrue(Format.IsRegex('(foo|bar)'))
})

Test('Should RegEx 6', () => {
  Assert.IsTrue(Format.IsRegex('a.*b?'))
})

Test('Should RegEx 7', () => {
  Assert.IsTrue(Format.IsRegex('\\w+@\\w+\\.com'))
})

Test('Should RegEx 8', () => {
  Assert.IsTrue(Format.IsRegex('^\\s*$'))
})

Test('Should RegEx 9', () => {
  Assert.IsTrue(Format.IsRegex('\\u{1F600}')) // unicode escape
})

Test('Should RegEx 10', () => {
  Assert.IsFalse(Format.IsRegex('[')) // unclosed character class
})

Test('Should RegEx 11', () => {
  Assert.IsFalse(Format.IsRegex('(')) // unclosed group
})

Test('Should RegEx 12', () => {
  Assert.IsFalse(Format.IsRegex('foo)')) // unmatched closing group
})

Test('Should RegEx 13', () => {
  Assert.IsFalse(Format.IsRegex('a{2,1}')) // invalid quantifier
})

Test('Should RegEx 14', () => {
  Assert.IsFalse(Format.IsRegex('*abc')) // lone quantifier
})

Test('Should RegEx 15', () => {
  Assert.IsFalse(Format.IsRegex('\\')) // lone escape
})

Test('Should RegEx 16', () => {
  Assert.IsFalse(Format.IsRegex('')) // empty string
})
