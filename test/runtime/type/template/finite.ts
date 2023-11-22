import { TemplateLiteralParse, IsTemplateLiteralFinite, PatternString, PatternBoolean, PatternNumber } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/templateliteral/IsTemplateLiteralFinite', () => {
  // ---------------------------------------------------------------
  // Finite
  // ---------------------------------------------------------------
  it('Finite 1', () => {
    const E = TemplateLiteralParse(`A`)
    const R = IsTemplateLiteralFinite(E)
    Assert.IsTrue(R)
  })
  it('Finite 2', () => {
    const E = TemplateLiteralParse(`A|B`)
    const R = IsTemplateLiteralFinite(E)
    Assert.IsTrue(R)
  })
  it('Finite 3', () => {
    const E = TemplateLiteralParse(`A(B|C)`)
    const R = IsTemplateLiteralFinite(E)
    Assert.IsTrue(R)
  })
  it('Finite 4', () => {
    const E = TemplateLiteralParse(`${PatternBoolean}`)
    const R = IsTemplateLiteralFinite(E)
    Assert.IsTrue(R)
  })
  it('Finite 5', () => {
    const E = TemplateLiteralParse(`\\.\\*`)
    const R = IsTemplateLiteralFinite(E)
    Assert.IsTrue(R)
  })
  // ---------------------------------------------------------------
  // Infinite
  // ---------------------------------------------------------------
  it('Infinite 1', () => {
    const E = TemplateLiteralParse(`${PatternString}`)
    const R = IsTemplateLiteralFinite(E)
    Assert.IsFalse(R)
  })
  it('Infinite 2', () => {
    const E = TemplateLiteralParse(`${PatternNumber}`)
    const R = IsTemplateLiteralFinite(E)
    Assert.IsFalse(R)
  })
  it('Infinite 3', () => {
    const E = TemplateLiteralParse(`A|${PatternString}`)
    const R = IsTemplateLiteralFinite(E)
    Assert.IsFalse(R)
  })
  it('Infinite 4', () => {
    const E = TemplateLiteralParse(`A|${PatternNumber}`)
    const R = IsTemplateLiteralFinite(E)
    Assert.IsFalse(R)
  })
  it('Infinite 5', () => {
    const E = TemplateLiteralParse(`A(${PatternString})`)
    const R = IsTemplateLiteralFinite(E)
    Assert.IsFalse(R)
  })
  it('Infinite 6', () => {
    const E = TemplateLiteralParse(`A(${PatternNumber})`)
    const R = IsTemplateLiteralFinite(E)
    Assert.IsFalse(R)
  })
  it('Infinite 7', () => {
    const E = TemplateLiteralParse(`${PatternString}_foo`)
    const R = IsTemplateLiteralFinite(E)
    Assert.IsFalse(R)
  })
})
