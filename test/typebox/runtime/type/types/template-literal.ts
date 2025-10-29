import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.TemplateLiteral')

Test('Should TemplateLiteral 1', () => {
  const T: Type.TUnknown = Type.Unknown()
  Assert.IsFalse(Type.IsTemplateLiteral(T))
})
Test('Should TemplateLiteral 2', () => {
  const T: Type.TTemplateLiteral<'^hello(A|B)$'> = Type.TemplateLiteral([
    Type.Literal('hello'),
    Type.Union([
      Type.Literal('A'),
      Type.Literal('B')
    ])
  ])
  Assert.IsTrue(Type.IsTemplateLiteral(T))
})
Test('Should TemplateLiteral 3', () => {
  const T: Type.TTemplateLiteral<'^hello(A|B)$'> = Type.TemplateLiteral([
    Type.Literal('hello'),
    Type.Union([
      Type.Literal('A'),
      Type.Literal('B')
    ])
  ], {
    a: 1,
    b: 2
  })
  Assert.HasPropertyKey(T, 'a')
  Assert.HasPropertyKey(T, 'b')
  Assert.IsEqual(T.a, 1)
  Assert.IsEqual(T.b, 2)
})
// ------------------------------------------------------------------
// Invalid Template Literal Kinds Are Never
// ------------------------------------------------------------------
Test('Should TemplateLiteral 5', () => {
  const T: Type.TTemplateLiteral<'^(?!)$'> = Type.TemplateLiteral([
    Type.Symbol(),
    Type.Literal('A')
  ])
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^(?!)$')
})
Test('Should TemplateLiteral 6', () => {
  const T: Type.TTemplateLiteral<'^(?!)$'> = Type.TemplateLiteral([
    Type.Literal('A'),
    Type.Symbol()
  ])
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^(?!)$')
})
Test('Should TemplateLiteral 7', () => {
  const T: Type.TTemplateLiteral<'^(A|(?!))$'> = Type.TemplateLiteral([
    Type.Union([
      Type.Literal('A'),
      Type.Symbol()
    ])
  ])
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^(A|(?!))$')
})
// ------------------------------------------------------------------
// Deep Union
// ------------------------------------------------------------------
Test('Should TemplateLiteral 7', () => {
  const T: Type.TTemplateLiteral<'^(A|(A|(A|(A))))B$'> = Type.TemplateLiteral([
    Type.Union([
      Type.Literal('A'),
      Type.Union([
        Type.Literal('A'),
        Type.Union([
          Type.Literal('A'),
          Type.Union([
            Type.Literal('A')
          ])
        ])
      ])
    ]),
    Type.Literal('B')
  ])
  Assert.IsTrue(Type.IsTemplateLiteral(T))
  Assert.IsEqual(T.pattern, '^(A|(A|(A|(A))))B$')
})
