import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/TemplateLiteral', () => {
  // --------------------------------------------------------
  // Finite
  // --------------------------------------------------------
  it('Should validate finite pattern 1', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([])
    Assert.IsEqual(Value.Check(T, ''), true)
    Assert.IsEqual(Value.Check(T, 'X'), false)
  })
  it('Should validate finite pattern 1', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([Type.Boolean()])
    Assert.IsEqual(Value.Check(T, 'true'), true)
    Assert.IsEqual(Value.Check(T, 'false'), true)
    Assert.IsEqual(Value.Check(T, 'X'), false)
  })
  it('Should validate finite pattern 2', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A')
    ])
    Assert.IsEqual(Value.Check(T, 'A'), true)
    Assert.IsEqual(Value.Check(T, 'X'), false)
  })
  it('Should validate finite pattern 3', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Literal('B')
    ])
    Assert.IsEqual(Value.Check(T, 'AB'), true)
    Assert.IsEqual(Value.Check(T, 'X'), false)
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
    Assert.IsEqual(Value.Check(T, 'AB'), true)
    Assert.IsEqual(Value.Check(T, 'AC'), true)
    Assert.IsEqual(Value.Check(T, 'X'), false)
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
    Assert.IsEqual(Value.Check(T, 'ABD'), true)
    Assert.IsEqual(Value.Check(T, 'ACD'), true)
    Assert.IsEqual(Value.Check(T, 'X'), false)
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
    Assert.IsEqual(Value.Check(T, '00'), true)
    Assert.IsEqual(Value.Check(T, '01'), true)
    Assert.IsEqual(Value.Check(T, '10'), true)
    Assert.IsEqual(Value.Check(T, '11'), true)
    Assert.IsEqual(Value.Check(T, 'X'), false)
  })
  // --------------------------------------------------------
  // Infinite
  // --------------------------------------------------------
  it('Should validate infinite pattern 1', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Number()
    ])
    Assert.IsEqual(Value.Check(T, '1'), true)
    Assert.IsEqual(Value.Check(T, '22'), true)
    Assert.IsEqual(Value.Check(T, '333'), true)
    Assert.IsEqual(Value.Check(T, '4444'), true)
    Assert.IsEqual(Value.Check(T, 'X'), false)
  })
  it('Should validate infinite pattern 2', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Integer()
    ])
    Assert.IsEqual(Value.Check(T, '1'), true)
    Assert.IsEqual(Value.Check(T, '22'), true)
    Assert.IsEqual(Value.Check(T, '333'), true)
    Assert.IsEqual(Value.Check(T, '4444'), true)
    Assert.IsEqual(Value.Check(T, 'X'), false)
  })
  it('Should validate infinite pattern 3', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.BigInt()
    ])
    Assert.IsEqual(Value.Check(T, '1'), true)
    Assert.IsEqual(Value.Check(T, '22'), true)
    Assert.IsEqual(Value.Check(T, '333'), true)
    Assert.IsEqual(Value.Check(T, '4444'), true)
    Assert.IsEqual(Value.Check(T, 'X'), false)
  })
  it('Should validate infinite pattern 4', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.String()
    ])
    Assert.IsEqual(Value.Check(T, '1'), true)
    Assert.IsEqual(Value.Check(T, '22'), true)
    Assert.IsEqual(Value.Check(T, '333'), true)
    Assert.IsEqual(Value.Check(T, '4444'), true)
    Assert.IsEqual(Value.Check(T, 'a'), true)
    Assert.IsEqual(Value.Check(T, 'bb'), true)
    Assert.IsEqual(Value.Check(T, 'ccc'), true)
    Assert.IsEqual(Value.Check(T, 'dddd'), true)
  })

  it('Should validate infinite pattern 5', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Number()
    ])
    Assert.IsEqual(Value.Check(T, 'A1'), true)
    Assert.IsEqual(Value.Check(T, 'A22'), true)
    Assert.IsEqual(Value.Check(T, 'A333'), true)
    Assert.IsEqual(Value.Check(T, 'A4444'), true)
    Assert.IsEqual(Value.Check(T, 'X'), false)
  })
  it('Should validate infinite pattern 6', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.Integer()
    ])
    Assert.IsEqual(Value.Check(T, 'A1'), true)
    Assert.IsEqual(Value.Check(T, 'A22'), true)
    Assert.IsEqual(Value.Check(T, 'A333'), true)
    Assert.IsEqual(Value.Check(T, 'A4444'), true)
    Assert.IsEqual(Value.Check(T, 'X'), false)
  })
  it('Should validate infinite pattern 7', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.BigInt()
    ])
    Assert.IsEqual(Value.Check(T, 'A1'), true)
    Assert.IsEqual(Value.Check(T, 'A22'), true)
    Assert.IsEqual(Value.Check(T, 'A333'), true)
    Assert.IsEqual(Value.Check(T, 'A4444'), true)
    Assert.IsEqual(Value.Check(T, 'X'), false)
  })
  it('Should validate infinite pattern 8', () => {
    // prettier-ignore
    const T = Type.TemplateLiteral([
      Type.Literal('A'),
      Type.String()
    ])
    Assert.IsEqual(Value.Check(T, 'A1'), true)
    Assert.IsEqual(Value.Check(T, 'A22'), true)
    Assert.IsEqual(Value.Check(T, 'A333'), true)
    Assert.IsEqual(Value.Check(T, 'A4444'), true)
    Assert.IsEqual(Value.Check(T, 'Aa'), true)
    Assert.IsEqual(Value.Check(T, 'Abb'), true)
    Assert.IsEqual(Value.Check(T, 'Accc'), true)
    Assert.IsEqual(Value.Check(T, 'Adddd'), true)
    Assert.IsEqual(Value.Check(T, 'X'), false)
  })
})
