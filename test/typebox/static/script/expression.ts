import { type Static, Type } from 'typebox'

// ------------------------------------------------------------------
// Deep Recursive Structure Test
// ------------------------------------------------------------------
const { Expression } = Type.Script(`
  type Expression = 
    | ConstDeclaration
    | BinaryExpression
    | ConstExpression

  interface ConstDeclaration {
    type: 'ConstDeclaration',
    name: string
    value: Expression
  }
  interface BinaryExpression {
    type: 'BinaryExpression'
    left: Expression
    right: Expression
  }
  interface ConstExpression {
    type: 'ConstExpression'
    const: unknown
  }
`)
function assert(expression: Static<typeof Expression>) {
  switch (expression.type) {
    case 'ConstExpression':
      return console.log(expression.const)
    case 'BinaryExpression':
      return console.log(expression.left, expression.right)
    case 'ConstDeclaration':
      return console.log(expression.name, expression.value)
  }
}
