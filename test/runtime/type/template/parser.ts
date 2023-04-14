import { TemplateLiteralParser } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/TemplateLiteralParser', () => {
  // ---------------------------------------------------------------
  // Throws
  // ---------------------------------------------------------------
  it('Throw 1', () => {
    Assert.throws(() => TemplateLiteralParser.Parse('('))
  })
  it('Throw 2', () => {
    Assert.throws(() => TemplateLiteralParser.Parse('('))
  })
  // ---------------------------------------------------------------
  // Exact (No Default Unwrap)
  // ---------------------------------------------------------------
  it('Exact 1', () => {
    const E = TemplateLiteralParser.Parse('^$')
    Assert.deepEqual(E, {
      type: 'const',
      const: '^$',
    })
  })
  it('Exact 2', () => {
    const E = TemplateLiteralParser.Parse('^A$')
    Assert.deepEqual(E, {
      type: 'const',
      const: '^A$',
    })
  })
  // ---------------------------------------------------------------
  // Patterns
  // ---------------------------------------------------------------
  it('Pattern 1', () => {
    const E = TemplateLiteralParser.Parse('(true|false)')
    Assert.deepEqual(E, {
      type: 'or',
      expr: [
        {
          type: 'const',
          const: 'true',
        },
        {
          type: 'const',
          const: 'false',
        },
      ],
    })
  })
  it('Pattern 2', () => {
    const E = TemplateLiteralParser.Parse('(0|[1-9][0-9]*)')
    Assert.deepEqual(E, {
      type: 'or',
      expr: [
        {
          type: 'const',
          const: '0',
        },
        {
          type: 'const',
          const: '[1-9][0-9]*',
        },
      ],
    })
  })
  it('Pattern 3', () => {
    const E = TemplateLiteralParser.Parse('.*')
    Assert.deepEqual(E, {
      type: 'const',
      const: '.*',
    })
  })
  // ---------------------------------------------------------------
  // Expression
  // ---------------------------------------------------------------
  it('Expression 1', () => {
    const E = TemplateLiteralParser.Parse(')')
    Assert.deepEqual(E, {
      type: 'const',
      const: ')',
    })
  })
  it('Expression 2', () => {
    const E = TemplateLiteralParser.Parse('\\)')
    Assert.deepEqual(E, {
      type: 'const',
      const: '\\)',
    })
  })
  it('Expression 3', () => {
    const E = TemplateLiteralParser.Parse('\\(')
    Assert.deepEqual(E, {
      type: 'const',
      const: '\\(',
    })
  })
  it('Expression 4', () => {
    const E = TemplateLiteralParser.Parse('')
    Assert.deepEqual(E, {
      type: 'const',
      const: '',
    })
  })
  it('Expression 5', () => {
    const E = TemplateLiteralParser.Parse('\\')
    Assert.deepEqual(E, {
      type: 'const',
      const: '\\',
    })
  })
  it('Expression 6', () => {
    const E = TemplateLiteralParser.Parse('()')
    Assert.deepEqual(E, {
      type: 'const',
      const: '',
    })
  })
  it('Expression 7', () => {
    const E = TemplateLiteralParser.Parse('(a)')
    Assert.deepEqual(E, {
      type: 'const',
      const: 'a',
    })
  })
  it('Expression 8', () => {
    const E = TemplateLiteralParser.Parse('()))')
    Assert.deepEqual(E, {
      type: 'and',
      expr: [
        {
          type: 'const',
          const: '',
        },
        {
          type: 'const',
          const: '))',
        },
      ],
    })
  })
  it('Expression 9', () => {
    const E = TemplateLiteralParser.Parse('())')
    Assert.deepEqual(E, {
      type: 'and',
      expr: [
        {
          type: 'const',
          const: '',
        },
        {
          type: 'const',
          const: ')',
        },
      ],
    })
  })
  it('Expression 10', () => {
    const E = TemplateLiteralParser.Parse('A|B')
    Assert.deepEqual(E, {
      type: 'or',
      expr: [
        {
          type: 'const',
          const: 'A',
        },
        {
          type: 'const',
          const: 'B',
        },
      ],
    })
  })
  it('Expression 11', () => {
    const E = TemplateLiteralParser.Parse('A|(B)')
    Assert.deepEqual(E, {
      type: 'or',
      expr: [
        {
          type: 'const',
          const: 'A',
        },
        {
          type: 'const',
          const: 'B',
        },
      ],
    })
  })
  it('Expression 12', () => {
    const E = TemplateLiteralParser.Parse('A(B)')
    Assert.deepEqual(E, {
      type: 'and',
      expr: [
        {
          type: 'const',
          const: 'A',
        },
        {
          type: 'const',
          const: 'B',
        },
      ],
    })
  })
  it('Expression 13', () => {
    const E = TemplateLiteralParser.Parse('(A)B')
    Assert.deepEqual(E, {
      type: 'and',
      expr: [
        {
          type: 'const',
          const: 'A',
        },
        {
          type: 'const',
          const: 'B',
        },
      ],
    })
  })
  it('Expression 14', () => {
    const E = TemplateLiteralParser.Parse('(A)|B')
    Assert.deepEqual(E, {
      type: 'or',
      expr: [
        {
          type: 'const',
          const: 'A',
        },
        {
          type: 'const',
          const: 'B',
        },
      ],
    })
  })
  it('Expression 15', () => {
    const E = TemplateLiteralParser.Parse('|')
    Assert.deepEqual(E, {
      type: 'const',
      const: '',
    })
  })
  it('Expression 16', () => {
    const E = TemplateLiteralParser.Parse('||')
    Assert.deepEqual(E, {
      type: 'const',
      const: '',
    })
  })
  it('Expression 17', () => {
    const E = TemplateLiteralParser.Parse('||A')
    Assert.deepEqual(E, {
      type: 'const',
      const: 'A',
    })
  })
  it('Expression 18', () => {
    const E = TemplateLiteralParser.Parse('A||')
    Assert.deepEqual(E, {
      type: 'const',
      const: 'A',
    })
  })
  it('Expression 19', () => {
    const E = TemplateLiteralParser.Parse('A||B')
    Assert.deepEqual(E, {
      type: 'or',
      expr: [
        {
          type: 'const',
          const: 'A',
        },
        {
          type: 'const',
          const: 'B',
        },
      ],
    })
  })
  it('Expression 20', () => {
    const E = TemplateLiteralParser.Parse('A|()|B')
    Assert.deepEqual(E, {
      type: 'or',
      expr: [
        {
          type: 'const',
          const: 'A',
        },
        {
          type: 'const',
          const: '',
        },
        {
          type: 'const',
          const: 'B',
        },
      ],
    })
  })
  it('Expression 21', () => {
    const E = TemplateLiteralParser.Parse('A|(|)|B')
    Assert.deepEqual(E, {
      type: 'or',
      expr: [
        {
          type: 'const',
          const: 'A',
        },
        {
          type: 'const',
          const: '',
        },
        {
          type: 'const',
          const: 'B',
        },
      ],
    })
  })
  it('Expression 22', () => {
    const E = TemplateLiteralParser.Parse('A|(||)|B')
    Assert.deepEqual(E, {
      type: 'or',
      expr: [
        {
          type: 'const',
          const: 'A',
        },
        {
          type: 'const',
          const: '',
        },
        {
          type: 'const',
          const: 'B',
        },
      ],
    })
  })
  it('Expression 23', () => {
    const E = TemplateLiteralParser.Parse('|A(||)B|')
    Assert.deepEqual(E, {
      type: 'and',
      expr: [
        {
          type: 'const',
          const: 'A',
        },
        {
          type: 'const',
          const: '',
        },
        {
          type: 'const',
          const: 'B',
        },
      ],
    })
  })
  it('Expression 24', () => {
    const E = TemplateLiteralParser.Parse('A(B)(C)')
    Assert.deepEqual(E, {
      type: 'and',
      expr: [
        {
          type: 'const',
          const: 'A',
        },
        {
          type: 'const',
          const: 'B',
        },
        {
          type: 'const',
          const: 'C',
        },
      ],
    })
  })
  it('Expression 25', () => {
    const E = TemplateLiteralParser.Parse('A(B)|(C)')
    Assert.deepEqual(E, {
      type: 'or',
      expr: [
        {
          type: 'and',
          expr: [
            {
              type: 'const',
              const: 'A',
            },
            {
              type: 'const',
              const: 'B',
            },
          ],
        },
        {
          type: 'const',
          const: 'C',
        },
      ],
    })
  })
  it('Expression 26', () => {
    const E = TemplateLiteralParser.Parse('A(B|C)')
    Assert.deepEqual(E, {
      type: 'and',
      expr: [
        {
          type: 'const',
          const: 'A',
        },
        {
          type: 'or',
          expr: [
            {
              type: 'const',
              const: 'B',
            },
            {
              type: 'const',
              const: 'C',
            },
          ],
        },
      ],
    })
  })
  it('Expression 27', () => {
    const E = TemplateLiteralParser.Parse('A|(B|C)')
    Assert.deepEqual(E, {
      type: 'or',
      expr: [
        {
          type: 'const',
          const: 'A',
        },
        {
          type: 'or',
          expr: [
            {
              type: 'const',
              const: 'B',
            },
            {
              type: 'const',
              const: 'C',
            },
          ],
        },
      ],
    })
  })
  it('Expression 28', () => {
    const E = TemplateLiteralParser.Parse('((A)B)C')
    Assert.deepEqual(E, {
      type: 'and',
      expr: [
        {
          type: 'and',
          expr: [
            {
              type: 'const',
              const: 'A',
            },
            {
              type: 'const',
              const: 'B',
            },
          ],
        },
        {
          type: 'const',
          const: 'C',
        },
      ],
    })
  })
  it('Expression 29', () => {
    const E = TemplateLiteralParser.Parse('(0|1)(0|1)')
    Assert.deepEqual(E, {
      type: 'and',
      expr: [
        {
          type: 'or',
          expr: [
            {
              type: 'const',
              const: '0',
            },
            {
              type: 'const',
              const: '1',
            },
          ],
        },
        {
          type: 'or',
          expr: [
            {
              type: 'const',
              const: '0',
            },
            {
              type: 'const',
              const: '1',
            },
          ],
        },
      ],
    })
  })
  it('Expression 30', () => {
    const E = TemplateLiteralParser.Parse('(0|1)|(0|1)')
    Assert.deepEqual(E, {
      type: 'or',
      expr: [
        {
          type: 'or',
          expr: [
            {
              type: 'const',
              const: '0',
            },
            {
              type: 'const',
              const: '1',
            },
          ],
        },
        {
          type: 'or',
          expr: [
            {
              type: 'const',
              const: '0',
            },
            {
              type: 'const',
              const: '1',
            },
          ],
        },
      ],
    })
  })
  it('Expression 31', () => {
    const E = TemplateLiteralParser.Parse('(0|(1|0)|1)')
    Assert.deepEqual(E, {
      type: 'or',
      expr: [
        {
          type: 'const',
          const: '0',
        },
        {
          type: 'or',
          expr: [
            {
              type: 'const',
              const: '1',
            },
            {
              type: 'const',
              const: '0',
            },
          ],
        },
        {
          type: 'const',
          const: '1',
        },
      ],
    })
  })
  it('Expression 32', () => {
    const E = TemplateLiteralParser.Parse('(0(1|0)1)')
    Assert.deepEqual(E, {
      type: 'and',
      expr: [
        {
          type: 'const',
          const: '0',
        },
        {
          type: 'or',
          expr: [
            {
              type: 'const',
              const: '1',
            },
            {
              type: 'const',
              const: '0',
            },
          ],
        },
        {
          type: 'const',
          const: '1',
        },
      ],
    })
  })
})
