import { TemplateLiteralParse, IsTemplateLiteralExpressionFinite, PatternString, PatternBoolean, PatternNumber } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/template-literal/IsTemplateLiteralExpressionFinite', () => {
  // ---------------------------------------------------------------
  // Finite
  // ---------------------------------------------------------------
  it('Finite 1', () => {
    const E = TemplateLiteralParse(`A`)
    const R = IsTemplateLiteralExpressionFinite(E)
    Assert.IsTrue(R)
  })
  it('Finite 2', () => {
    const E = TemplateLiteralParse(`A|B`)
    const R = IsTemplateLiteralExpressionFinite(E)
    Assert.IsTrue(R)
  })
  it('Finite 3', () => {
    const E = TemplateLiteralParse(`A(B|C)`)
    const R = IsTemplateLiteralExpressionFinite(E)
    Assert.IsTrue(R)
  })
  it('Finite 4', () => {
    const E = TemplateLiteralParse(`${PatternBoolean}`)
    const R = IsTemplateLiteralExpressionFinite(E)
    Assert.IsTrue(R)
  })
  it('Finite 5', () => {
    const E = TemplateLiteralParse(`\\.\\*`)
    const R = IsTemplateLiteralExpressionFinite(E)
    Assert.IsTrue(R)
  })
  // ---------------------------------------------------------------
  // Infinite
  // ---------------------------------------------------------------
  it('Infinite 1', () => {
    const E = TemplateLiteralParse(`${PatternString}`)
    const R = IsTemplateLiteralExpressionFinite(E)
    Assert.IsFalse(R)
  })
  it('Infinite 2', () => {
    const E = TemplateLiteralParse(`${PatternNumber}`)
    const R = IsTemplateLiteralExpressionFinite(E)
    Assert.IsFalse(R)
  })
  it('Infinite 3', () => {
    const E = TemplateLiteralParse(`A|${PatternString}`)
    const R = IsTemplateLiteralExpressionFinite(E)
    Assert.IsFalse(R)
  })
  it('Infinite 4', () => {
    const E = TemplateLiteralParse(`A|${PatternNumber}`)
    const R = IsTemplateLiteralExpressionFinite(E)
    Assert.IsFalse(R)
  })
  it('Infinite 5', () => {
    const E = TemplateLiteralParse(`A(${PatternString})`)
    const R = IsTemplateLiteralExpressionFinite(E)
    Assert.IsFalse(R)
  })
  it('Infinite 6', () => {
    const E = TemplateLiteralParse(`A(${PatternNumber})`)
    const R = IsTemplateLiteralExpressionFinite(E)
    Assert.IsFalse(R)
  })
  it('Infinite 7', () => {
    const E = TemplateLiteralParse(`${PatternString}_foo`)
    const R = IsTemplateLiteralExpressionFinite(E)
    Assert.IsFalse(R)
  })
})
