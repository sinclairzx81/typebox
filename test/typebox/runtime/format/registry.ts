import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.Registry')

// ------------------------------------------------------------------
// IsStandardFormat
// ------------------------------------------------------------------
Test('Should IsStandardFormat 1', () => {
  Assert.IsTrue(Format.IsStandardFormat('email'))
})
Test('Should IsStandardFormat 2', () => {
  Assert.IsFalse(Format.IsStandardFormat('foo'))
})
Test('Should IsStandardFormat 3', () => {
  Format.Set('foo', () => true)
  Assert.IsFalse(Format.IsStandardFormat('foo'))
  Format.Reset()
})
// ------------------------------------------------------------------
// Entries
// ------------------------------------------------------------------
Test('Should Entries 1', () => {
  Assert.IsTrue(Format.Entries().length > 1)
})
Test('Should Entries 2', () => {
  Assert.IsTrue(Format.Entries().some((entry) => entry[0] === 'email'))
})
Test('Should Entries 3', () => {
  Format.Set('foo', () => true)
  Assert.IsTrue(Format.Entries().some((entry) => entry[0] === 'foo'))
  Format.Reset()
})
Test('Should Entries 4', () => {
  const lengthA = Format.Entries().length
  Format.Set('foo', () => true)
  const lengthB = Format.Entries().length
  Assert.NotEqual(lengthA, lengthB)
  Format.Reset()
})
// ------------------------------------------------------------------
// Get
// ------------------------------------------------------------------
Test('Should Get 1', () => {
  const R = Format.Get('email')
  Assert.IsTrue(typeof R === 'function')
})
Test('Should Get 2', () => {
  const F = () => true
  Format.Set('foo', F)
  Assert.IsTrue(F === Format.Get('foo'))
  Format.Reset()
})
// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
Test('Should Set 1', () => {
  const C = () => true
  Format.Set('foo', C)
  const R = Format.Get('foo')
  Assert.IsEqual(R, C)
  Format.Reset()
})
// Cannot set standard format
Test('Should Set 2', () => {
  Assert.Throws(() => Format.Set('email', (_) => true))
  Format.Reset()
})
// Cannot set existing format
Test('Should Set 3', () => {
  Format.Set('foo', (_) => true)
  Assert.Throws(() => Format.Set('foo', (_) => true))
  Format.Reset()
})
// ------------------------------------------------------------------
// Has
// ------------------------------------------------------------------
Test('Should Has 1', () => {
  const R = Format.Has('email')
  Assert.IsTrue(R)
  Format.Reset()
})
Test('Should Has 2', () => {
  Format.Set('foo', () => true)
  Assert.IsTrue(Format.Has('foo'))
  Format.Reset()
})
// ------------------------------------------------------------------
// Reset
// ------------------------------------------------------------------
// Reset shouldn't clear standard formats
Test('Should Reset 1', () => {
  Format.Reset()
  Assert.IsTrue(Format.Has('email'))
})
Test('Should Reset 2', () => {
  Format.Set('A', () => true)
  Assert.IsTrue(Format.Has('A'))
  Format.Reset()
  Assert.IsFalse(Format.Has('A'))
})
