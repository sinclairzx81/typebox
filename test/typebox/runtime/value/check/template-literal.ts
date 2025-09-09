import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.TemplateLiteral')

// --------------------------------------------------------
// Finite
// --------------------------------------------------------
Test('Should validate finite pattern 1', () => {
  const T = Type.TemplateLiteral([])
  Ok(T, '')
  Fail(T, 'X')
})
Test('Should validate finite pattern 1', () => {
  const T = Type.TemplateLiteral([Type.Boolean()])
  Ok(T, 'true')
  Ok(T, 'false')
  Fail(T, 'X')
})
Test('Should validate finite pattern 2', () => {
  const T = Type.TemplateLiteral([
    Type.Literal('A')
  ])
  Ok(T, 'A')
  Fail(T, 'X')
})
Test('Should validate finite pattern 3', () => {
  const T = Type.TemplateLiteral([
    Type.Literal('A'),
    Type.Literal('B')
  ])
  Ok(T, 'AB')
  Fail(T, 'X')
})
Test('Should validate finite pattern 4', () => {
  const T = Type.TemplateLiteral([
    Type.Literal('A'),
    Type.Union([
      Type.Literal('B'),
      Type.Literal('C')
    ])
  ])
  Ok(T, 'AB')
  Ok(T, 'AC')
  Fail(T, 'X')
})
Test('Should validate finite pattern 5', () => {
  const T = Type.TemplateLiteral([
    Type.Literal('A'),
    Type.Union([
      Type.Literal('B'),
      Type.Literal('C')
    ]),
    Type.Literal('D')
  ])
  Ok(T, 'ABD')
  Ok(T, 'ACD')
  Fail(T, 'X')
})
Test('Should validate finite pattern 6', () => {
  const T = Type.TemplateLiteral([
    Type.Union([
      Type.Literal('0'),
      Type.Literal('1')
    ]),
    Type.Union([
      Type.Literal('0'),
      Type.Literal('1')
    ])
  ])
  Ok(T, '00')
  Ok(T, '01')
  Ok(T, '10')
  Ok(T, '11')
  Fail(T, 'X')
})
// --------------------------------------------------------
// BigInt
// --------------------------------------------------------
Test('Should validate bigint pattern 1', () => {
  const T = Type.TemplateLiteral([
    Type.BigInt()
  ])
  Ok(T, '1n')
  Ok(T, '22n')
  Ok(T, '333n')
  Ok(T, '4444n')
  Fail(T, 'X')
})
Test('Should validate bigint pattern 2', () => {
  const T = Type.TemplateLiteral([
    Type.Literal('A'),
    Type.BigInt()
  ])
  Ok(T, 'A1n')
  Ok(T, 'A22n')
  Ok(T, 'A333n')
  Ok(T, 'A4444n')
  Fail(T, 'X')
})
// --------------------------------------------------------
// Infinite
// --------------------------------------------------------
Test('Should validate infinite pattern 1', () => {
  const T = Type.TemplateLiteral([
    Type.Number()
  ])
  Ok(T, '1')
  Ok(T, '22')
  Ok(T, '333')
  Ok(T, '4444')
  Fail(T, 'X')
})
Test('Should validate infinite pattern 2', () => {
  const T = Type.TemplateLiteral([
    Type.Integer()
  ])
  Ok(T, '1')
  Ok(T, '22')
  Ok(T, '333')
  Ok(T, '4444')
  Fail(T, 'X')
})
Test('Should validate infinite pattern 3', () => {
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
Test('Should validate infinite pattern 4', () => {
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
Test('Should validate infinite pattern 5', () => {
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
Test('Should validate infinite pattern 6', () => {
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
Test('Should validate enum (implicit)', () => {
  enum E {
    A,
    B,
    C
  }
  const T = Type.TemplateLiteral([Type.Literal('hello'), Type.Enum(E)])
  Ok(T, 'hello0')
  Ok(T, 'hello1')
  Ok(T, 'hello2')
  Fail(T, 'hello3')
})
Test('Should validate enum (explicit)', () => {
  enum E {
    A,
    B = 'B',
    C = 'C'
  }
  const T = Type.TemplateLiteral([Type.Literal('hello'), Type.Enum(E)])
  Ok(T, 'hello0')
  Ok(T, 'helloB')
  Ok(T, 'helloC')
  Fail(T, 'helloD')
})
