import { Type, TTemplateLiteral, PatternNumber, PatternString, PatternBoolean } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/template-literal/TemplateLiteralPattern', () => {
  const Equal = (template: TTemplateLiteral, expect: string) => {
    const pattern = template.pattern.slice(1, template.pattern.length - 1)
    Assert.IsEqual(pattern, expect)
  }
  // ---------------------------------------------------------------
  // Escape
  // ---------------------------------------------------------------
  it('Escape 1', () => {
    const T = Type.TemplateLiteral([Type.Literal('.*')])
    Assert.IsEqual(T.pattern, '^\\.\\*$')
  })
  it('Escape 2', () => {
    const T = Type.TemplateLiteral([Type.Literal('(')])
    Assert.IsEqual(T.pattern, '^\\($')
  })
  it('Escape 3', () => {
    const T = Type.TemplateLiteral([Type.Literal(')')])
    Assert.IsEqual(T.pattern, '^\\)$')
  })
  it('Escape 4', () => {
    const T = Type.TemplateLiteral([Type.Literal('|')])
    Assert.IsEqual(T.pattern, '^\\|$')
  })
  // ---------------------------------------------------------------
  // Pattern
  // ---------------------------------------------------------------
  it('Pattern 1', () => {
    const T = Type.TemplateLiteral([Type.Number()])
    Equal(T, `${PatternNumber}`)
  })
  it('Pattern 2', () => {
    const T = Type.TemplateLiteral([Type.String()])
    Equal(T, `${PatternString}`)
  })
  it('Pattern 3', () => {
    const T = Type.TemplateLiteral([Type.Boolean()])
    Equal(T, `${PatternBoolean}`)
  })
  it('Pattern 4', () => {
    const T = Type.TemplateLiteral([Type.Literal('A'), Type.Number()])
    Equal(T, `A${PatternNumber}`)
  })
  it('Pattern 5', () => {
    const T = Type.TemplateLiteral([Type.Literal('A'), Type.String()])
    Equal(T, `A${PatternString}`)
  })
  it('Pattern 6', () => {
    const T = Type.TemplateLiteral([Type.Literal('A'), Type.Boolean()])
    Equal(T, `A${PatternBoolean}`)
  })
  it('Pattern 7', () => {
    const T = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Number()])])
    Equal(T, `(A|${PatternNumber})`)
  })
  it('Pattern 8', () => {
    const T = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.String()])])
    Equal(T, `(A|${PatternString})`)
  })
  it('Pattern 9', () => {
    const T = Type.TemplateLiteral([Type.Union([Type.Literal('A'), Type.Boolean()])])
    Equal(T, `(A|${PatternBoolean})`)
  })
  // ---------------------------------------------------------------
  // Template
  // ---------------------------------------------------------------
  it('Template 1', () => {
    const T = Type.TemplateLiteral([])
    Equal(T, '')
  })
  it('Template 2', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A')
    ])
    Equal(T, 'A')
  })
  it('Template 3', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Literal('B'),
    ])
    Equal(T, 'AB')
  })
  it('Template 4', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Union([
        Type.Literal('B'),
      ])
    ])
    Equal(T, 'AB')
  })
  it('Template 5', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Union([
        Type.Literal('B'),
        Type.Literal('C'),
      ])
    ])
    Equal(T, 'A(B|C)')
  })
  it('Template 6', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Union([
        Type.Literal('B'),
        Type.Literal('C'),
      ]),
      Type.Union([
        Type.Literal('D'),
        Type.Literal('E'),
      ])
    ])
    Equal(T, 'A(B|C)(D|E)')
  })
  it('Template 7', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.TemplateLiteral([Type.Literal('A')]),
      Type.TemplateLiteral([Type.Literal('B')])
    ])
    Equal(T, 'AB')
  })
  it('Template 8', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Union([
        Type.TemplateLiteral([
          Type.Literal('B'),
          Type.Literal('C'),
        ]),
        Type.Literal('D')
      ]),
    ])
    Equal(T, 'A(BC|D)')
  })
  it('Template 9', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Union([
        Type.TemplateLiteral([
          Type.Literal('B'),
          Type.Literal('C'),
        ]),
        Type.Union([
          Type.Literal('D'),
          Type.Literal('E')
        ])
      ]),
    ])
    Equal(T, 'A(BC|(D|E))')
  })
})
