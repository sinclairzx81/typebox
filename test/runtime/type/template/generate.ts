import { TemplateLiteralParser, TemplateLiteralGenerator } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/TemplateLiteralGenerator', () => {
  // ---------------------------------------------------------------
  // Exact (No Default Unwrap)
  // ---------------------------------------------------------------
  it('Exact 1', () => {
    const E = TemplateLiteralParser.Parse('^$')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['^$'])
  })
  it('Exact 2', () => {
    const E = TemplateLiteralParser.Parse('^A$')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['^A$'])
  })
  // ---------------------------------------------------------------
  // Patterns
  // ---------------------------------------------------------------
  it('Pattern 1', () => {
    const E = TemplateLiteralParser.Parse('(true|false)')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['true', 'false'])
  })
  it('Pattern 2', () => {
    const E = TemplateLiteralParser.Parse('(0|[1-9][0-9]*)')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['0', '[1-9][0-9]*'])
  })
  it('Pattern 3', () => {
    const E = TemplateLiteralParser.Parse('.*')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['.*'])
  })
  // ---------------------------------------------------------------
  // Expression
  // ---------------------------------------------------------------
  it('Expression 1', () => {
    const E = TemplateLiteralParser.Parse(')')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, [')'])
  })
  it('Expression 2', () => {
    const E = TemplateLiteralParser.Parse('\\)')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['\\)'])
  })
  it('Expression 3', () => {
    const E = TemplateLiteralParser.Parse('\\(')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['\\('])
  })
  it('Expression 4', () => {
    const E = TemplateLiteralParser.Parse('')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, [''])
  })
  it('Expression 5', () => {
    const E = TemplateLiteralParser.Parse('\\')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['\\'])
  })
  it('Expression 6', () => {
    const E = TemplateLiteralParser.Parse('()')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, [''])
  })
  it('Expression 7', () => {
    const E = TemplateLiteralParser.Parse('(a)')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['a'])
  })
  it('Expression 8', () => {
    const E = TemplateLiteralParser.Parse('()))')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['))'])
  })
  it('Expression 9', () => {
    const E = TemplateLiteralParser.Parse('())')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, [')'])
  })
  it('Expression 10', () => {
    const E = TemplateLiteralParser.Parse('A|B')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['A', 'B'])
  })
  it('Expression 11', () => {
    const E = TemplateLiteralParser.Parse('A|(B)')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['A', 'B'])
  })
  it('Expression 12', () => {
    const E = TemplateLiteralParser.Parse('A(B)')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['AB'])
  })
  it('Expression 13', () => {
    const E = TemplateLiteralParser.Parse('(A)B')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['AB'])
  })
  it('Expression 14', () => {
    const E = TemplateLiteralParser.Parse('(A)|B')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['A', 'B'])
  })
  it('Expression 15', () => {
    const E = TemplateLiteralParser.Parse('|')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, [''])
  })
  it('Expression 16', () => {
    const E = TemplateLiteralParser.Parse('||')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, [''])
  })
  it('Expression 17', () => {
    const E = TemplateLiteralParser.Parse('||A')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['A'])
  })
  it('Expression 18', () => {
    const E = TemplateLiteralParser.Parse('A||')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['A'])
  })
  it('Expression 19', () => {
    const E = TemplateLiteralParser.Parse('A||B')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['A', 'B'])
  })
  it('Expression 20', () => {
    const E = TemplateLiteralParser.Parse('A|()|B')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['A', '', 'B'])
  })
  it('Expression 21', () => {
    const E = TemplateLiteralParser.Parse('A|(|)|B')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['A', '', 'B'])
  })
  it('Expression 22', () => {
    const E = TemplateLiteralParser.Parse('A|(||)|B')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['A', '', 'B'])
  })
  it('Expression 23', () => {
    const E = TemplateLiteralParser.Parse('|A(||)B|')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['AB'])
  })
  it('Expression 24', () => {
    const E = TemplateLiteralParser.Parse('A(B)(C)')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['ABC'])
  })
  it('Expression 25', () => {
    const E = TemplateLiteralParser.Parse('A(B)|(C)')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['AB', 'C'])
  })
  it('Expression 26', () => {
    const E = TemplateLiteralParser.Parse('A(B|C)')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['AB', 'AC'])
  })
  it('Expression 27', () => {
    const E = TemplateLiteralParser.Parse('A|(B|C)')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['A', 'B', 'C'])
  })
  it('Expression 28', () => {
    const E = TemplateLiteralParser.Parse('((A)B)C')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['ABC'])
  })
  it('Expression 29', () => {
    const E = TemplateLiteralParser.Parse('(0|1)(0|1)')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['00', '01', '10', '11'])
  })
  it('Expression 30', () => {
    const E = TemplateLiteralParser.Parse('(0|1)|(0|1)')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['0', '1', '0', '1'])
  })
  it('Expression 31', () => {
    const E = TemplateLiteralParser.Parse('(0|(1|0)|1)')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['0', '1', '0', '1'])
  })
  it('Expression 32', () => {
    const E = TemplateLiteralParser.Parse('(0(1|0)1)')
    const R = [...TemplateLiteralGenerator.Generate(E)]
    Assert.deepEqual(R, ['011', '001'])
  })
})
