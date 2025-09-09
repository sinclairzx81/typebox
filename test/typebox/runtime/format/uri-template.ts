import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsUriTemplate')

Test('Should UriTemplate 1', () => {
  Assert.IsTrue(Format.IsUriTemplate('x')) // literal
})

Test('Should UriTemplate 2', () => {
  Assert.IsTrue(Format.IsUriTemplate('{var}'))
})

Test('Should UriTemplate 3', () => {
  Assert.IsTrue(Format.IsUriTemplate('foo/{var}'))
})

Test('Should UriTemplate 4', () => {
  Assert.IsTrue(Format.IsUriTemplate('{+var}')) // reserved expansion
})

Test('Should UriTemplate 5', () => {
  Assert.IsTrue(Format.IsUriTemplate('{var1,var2}')) // multiple variables
})

Test('Should UriTemplate 6', () => {
  Assert.IsTrue(Format.IsUriTemplate('{var*}')) // explode modifier
})

Test('Should UriTemplate 7', () => {
  Assert.IsTrue(Format.IsUriTemplate('{var:3}')) // prefix modifier
})

Test('Should UriTemplate 8', () => {
  Assert.IsTrue(Format.IsUriTemplate('foo/{var}/bar'))
})

Test('Should UriTemplate 9', () => {
  Assert.IsTrue(Format.IsUriTemplate('foo{?x,y}')) // query expansion
})

Test('Should UriTemplate 10', () => {
  Assert.IsTrue(Format.IsUriTemplate('foo{#frag}')) // fragment expansion
})

Test('Should UriTemplate 11', () => {
  Assert.IsFalse(Format.IsUriTemplate('{')) // unclosed brace
})

Test('Should UriTemplate 12', () => {
  Assert.IsFalse(Format.IsUriTemplate('}')) // unopened brace
})

Test('Should UriTemplate 13', () => {
  Assert.IsFalse(Format.IsUriTemplate('{var')) // unclosed variable
})

Test('Should UriTemplate 14', () => {
  Assert.IsFalse(Format.IsUriTemplate('foo{{var}}')) // nested braces
})

Test('Should UriTemplate 15', () => {
  Assert.IsFalse(Format.IsUriTemplate('{}')) // empty variable
})

Test('Should UriTemplate 16', () => {
  Assert.IsFalse(Format.IsUriTemplate('{var!}')) // invalid modifier
})
