import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/TemplateLiteral', () => {
  // --------------------------------------------------------
  // Finite
  // --------------------------------------------------------
  it('Should validate finite pattern 1', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([])
    Ok(T, '')
    Fail(T, 'X')
  })
  it('Should validate finite pattern 1', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([Type.Boolean()])
    Ok(T, 'true')
    Ok(T, 'false')
    Fail(T, 'X')
  })
  it('Should validate finite pattern 2', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A')
    ])
    Ok(T, 'A')
    Fail(T, 'X')
  })
  it('Should validate finite pattern 3', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Literal('B')
    ])
    Ok(T, 'AB')
    Fail(T, 'X')
  })
  it('Should validate finite pattern 4', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Union([
        Type.Literal('B'),
        Type.Literal('C')
      ]),
    ])
    Ok(T, 'AB')
    Ok(T, 'AC')
    Fail(T, 'X')
  })
  it('Should validate finite pattern 5', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Union([
        Type.Literal('B'),
        Type.Literal('C')
      ]),
      Type.Literal('D'),
    ])
    Ok(T, 'ABD')
    Ok(T, 'ACD')
    Fail(T, 'X')
  })
  it('Should validate finite pattern 6', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Union([
        Type.Literal('0'),
        Type.Literal('1')
      ]),
      Type.Union([
        Type.Literal('0'),
        Type.Literal('1')
      ]),
    ])
    Ok(T, '00')
    Ok(T, '01')
    Ok(T, '10')
    Ok(T, '11')
    Fail(T, 'X')
  })
  // --------------------------------------------------------
  // Infinite
  // --------------------------------------------------------
  it('Should validate infinite pattern 1', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Number()
    ])
    Ok(T, '1')
    Ok(T, '22')
    Ok(T, '333')
    Ok(T, '4444')
    Fail(T, 'X')
  })
  it('Should validate infinite pattern 2', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Integer()
    ])
    Ok(T, '1')
    Ok(T, '22')
    Ok(T, '333')
    Ok(T, '4444')
    Fail(T, 'X')
  })
  it('Should validate infinite pattern 3', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.BigInt()
    ])
    Ok(T, '1')
    Ok(T, '22')
    Ok(T, '333')
    Ok(T, '4444')
    Fail(T, 'X')
  })
  it('Should validate infinite pattern 4', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.String()
    ])
    Ok(T, '1')
    Ok(T, '22')
    Ok(T, '333')
    Ok(T, '4444')
    Ok(T, 'a')
    Ok(T, 'bb')
    Ok(T, 'ccc')
    Ok(T, 'dddd')
  })
  it('Should validate infinite pattern 5', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Number()
    ])
    Ok(T, 'A1')
    Ok(T, 'A22')
    Ok(T, 'A333')
    Ok(T, 'A4444')
    Fail(T, 'X')
  })
  it('Should validate infinite pattern 6', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Integer()
    ])
    Ok(T, 'A1')
    Ok(T, 'A22')
    Ok(T, 'A333')
    Ok(T, 'A4444')
    Fail(T, 'X')
  })
  it('Should validate infinite pattern 7', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.BigInt()
    ])
    Ok(T, 'A1')
    Ok(T, 'A22')
    Ok(T, 'A333')
    Ok(T, 'A4444')
    Fail(T, 'X')
  })
  it('Should validate infinite pattern 8', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.String()
    ])
    Ok(T, 'A1')
    Ok(T, 'A22')
    Ok(T, 'A333')
    Ok(T, 'A4444')
    Ok(T, 'Aa')
    Ok(T, 'Abb')
    Ok(T, 'Accc')
    Ok(T, 'Adddd')
    Fail(T, 'X')
  })
})
