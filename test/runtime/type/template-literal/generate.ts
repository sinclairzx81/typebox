import { TemplateLiteralParse, TemplateLiteralExpressionGenerate } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/template-literal/TemplateLiteralExpressionGenerate', () => {
  // ---------------------------------------------------------------
  // Exact (No Default Unwrap)
  // ---------------------------------------------------------------
  it('Exact 1', () => {
    const E = TemplateLiteralParse('^$')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['^$'])
  })
  it('Exact 2', () => {
    const E = TemplateLiteralParse('^A$')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['^A$'])
  })
  // ---------------------------------------------------------------
  // Patterns
  // ---------------------------------------------------------------
  it('Pattern 1', () => {
    const E = TemplateLiteralParse('(true|false)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['true', 'false'])
  })
  it('Pattern 2', () => {
    const E = TemplateLiteralParse('(0|[1-9][0-9]*)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['0', '[1-9][0-9]*'])
  })
  it('Pattern 3', () => {
    const E = TemplateLiteralParse('.*')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['.*'])
  })
  // ---------------------------------------------------------------
  // Expression
  // ---------------------------------------------------------------
  it('Expression 1', () => {
    const E = TemplateLiteralParse(')')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, [')'])
  })
  it('Expression 2', () => {
    const E = TemplateLiteralParse('\\)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, [')'])
  })
  it('Expression 3', () => {
    const E = TemplateLiteralParse('\\(')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['('])
  })
  it('Expression 4', () => {
    const E = TemplateLiteralParse('')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, [''])
  })
  it('Expression 5', () => {
    const E = TemplateLiteralParse('\\')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['\\'])
  })
  it('Expression 6', () => {
    const E = TemplateLiteralParse('()')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, [''])
  })
  it('Expression 7', () => {
    const E = TemplateLiteralParse('(a)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['a'])
  })
  it('Expression 8', () => {
    const E = TemplateLiteralParse('()))')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['))'])
  })
  it('Expression 9', () => {
    const E = TemplateLiteralParse('())')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, [')'])
  })
  it('Expression 10', () => {
    const E = TemplateLiteralParse('A|B')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['A', 'B'])
  })
  it('Expression 11', () => {
    const E = TemplateLiteralParse('A|(B)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['A', 'B'])
  })
  it('Expression 12', () => {
    const E = TemplateLiteralParse('A(B)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['AB'])
  })
  it('Expression 13', () => {
    const E = TemplateLiteralParse('(A)B')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['AB'])
  })
  it('Expression 14', () => {
    const E = TemplateLiteralParse('(A)|B')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['A', 'B'])
  })
  it('Expression 15', () => {
    const E = TemplateLiteralParse('|')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, [''])
  })
  it('Expression 16', () => {
    const E = TemplateLiteralParse('||')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, [''])
  })
  it('Expression 17', () => {
    const E = TemplateLiteralParse('||A')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['A'])
  })
  it('Expression 18', () => {
    const E = TemplateLiteralParse('A||')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['A'])
  })
  it('Expression 19', () => {
    const E = TemplateLiteralParse('A||B')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['A', 'B'])
  })
  it('Expression 20', () => {
    const E = TemplateLiteralParse('A|()|B')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['A', '', 'B'])
  })
  it('Expression 21', () => {
    const E = TemplateLiteralParse('A|(|)|B')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['A', '', 'B'])
  })
  it('Expression 22', () => {
    const E = TemplateLiteralParse('A|(||)|B')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['A', '', 'B'])
  })
  it('Expression 23', () => {
    const E = TemplateLiteralParse('|A(||)B|')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['AB'])
  })
  it('Expression 24', () => {
    const E = TemplateLiteralParse('A(B)(C)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['ABC'])
  })
  it('Expression 25', () => {
    const E = TemplateLiteralParse('A(B)|(C)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['AB', 'C'])
  })
  it('Expression 26', () => {
    const E = TemplateLiteralParse('A(B|C)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['AB', 'AC'])
  })
  it('Expression 27', () => {
    const E = TemplateLiteralParse('A|(B|C)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['A', 'B', 'C'])
  })
  it('Expression 28', () => {
    const E = TemplateLiteralParse('((A)B)C')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['ABC'])
  })
  it('Expression 29', () => {
    const E = TemplateLiteralParse('(0|1)(0|1)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['00', '01', '10', '11'])
  })
  it('Expression 30', () => {
    const E = TemplateLiteralParse('(0|1)|(0|1)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['0', '1', '0', '1'])
  })
  it('Expression 31', () => {
    const E = TemplateLiteralParse('(0|(1|0)|1)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['0', '1', '0', '1'])
  })
  it('Expression 32', () => {
    const E = TemplateLiteralParse('(0(1|0)1)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['011', '001'])
  })
  it('Expression 33', () => {
    const E = TemplateLiteralParse('\\$prop(1|2|3)')
    const R = [...TemplateLiteralExpressionGenerate(E)]
    Assert.IsEqual(R, ['$prop1', '$prop2', '$prop3'])
  })
})
