import { PatternString, PatternBoolean, PatternNumber, TemplateLiteralParser, TemplateLiteralFinite } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/TemplateLiteralFinite', () => {
  // ---------------------------------------------------------------
  // Finite
  // ---------------------------------------------------------------
  it('Finite 1', () => {
    const E = TemplateLiteralParser.Parse(`A`)
    const R = TemplateLiteralFinite.Check(E)
    Assert.deepEqual(R, true)
  })
  it('Finite 2', () => {
    const E = TemplateLiteralParser.Parse(`A|B`)
    const R = TemplateLiteralFinite.Check(E)
    Assert.deepEqual(R, true)
  })
  it('Finite 3', () => {
    const E = TemplateLiteralParser.Parse(`A(B|C)`)
    const R = TemplateLiteralFinite.Check(E)
    Assert.deepEqual(R, true)
  })
  it('Finite 4', () => {
    const E = TemplateLiteralParser.Parse(`${PatternBoolean}`)
    const R = TemplateLiteralFinite.Check(E)
    Assert.deepEqual(R, true)
  })
  it('Finite 5', () => {
    const E = TemplateLiteralParser.Parse(`\\.\\*`)
    const R = TemplateLiteralFinite.Check(E)
    Assert.deepEqual(R, true)
  })
  // ---------------------------------------------------------------
  // Infinite
  // ---------------------------------------------------------------
  it('Infinite 1', () => {
    const E = TemplateLiteralParser.Parse(`${PatternString}`)
    const R = TemplateLiteralFinite.Check(E)
    Assert.deepEqual(R, false)
  })
  it('Infinite 2', () => {
    const E = TemplateLiteralParser.Parse(`${PatternNumber}`)
    const R = TemplateLiteralFinite.Check(E)
    Assert.deepEqual(R, false)
  })
  it('Infinite 3', () => {
    const E = TemplateLiteralParser.Parse(`A|${PatternString}`)
    const R = TemplateLiteralFinite.Check(E)
    Assert.deepEqual(R, false)
  })
  it('Infinite 4', () => {
    const E = TemplateLiteralParser.Parse(`A|${PatternNumber}`)
    const R = TemplateLiteralFinite.Check(E)
    Assert.deepEqual(R, false)
  })
  it('Infinite 5', () => {
    const E = TemplateLiteralParser.Parse(`A(${PatternString})`)
    const R = TemplateLiteralFinite.Check(E)
    Assert.deepEqual(R, false)
  })
  it('Infinite 6', () => {
    const E = TemplateLiteralParser.Parse(`A(${PatternNumber})`)
    const R = TemplateLiteralFinite.Check(E)
    Assert.deepEqual(R, false)
  })
  it('Infinite 7', () => {
    const E = TemplateLiteralParser.Parse(`${PatternString}_foo`)
    const R = TemplateLiteralFinite.Check(E)
    Assert.deepEqual(R, false)
  })
})
