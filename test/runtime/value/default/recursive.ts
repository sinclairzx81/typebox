import { Value } from '@sinclair/typebox/value'
import { TSchema, Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

// prettier-ignore
describe('value/default/Recursive', () => {
  it('Should use default', () => {
    const T = Type.Recursive((This) => Type.Object({
      nodes: Type.Array(This)
    }, { default: 1 }))
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, 1)
  })
  it('Should use value', () => {
    const T = Type.Recursive((This) => Type.Object({
      nodes: Type.Array(This)
    }, { default: 1 }))
    const R = Value.Default(T, null)
    Assert.IsEqual(R, null)
  })
  // ----------------------------------------------------------------
  // Recursive
  // ----------------------------------------------------------------
  it('Should use default recursive values', () => {
    const T = Type.Recursive((This) => Type.Object({
      id: Type.String({ default: 1 }),
      nodes: Type.Array(This, { default: [] }) // need this
    }))
    const R = Value.Default(T, {
      nodes: [{
        nodes: [{
          nodes: [{ id: null }]
        }, {
          nodes: [{ id: null }]
        }]
      }]
    })
    Assert.IsEqual(R, {
      nodes: [{
        nodes: [{
          nodes: [{
            id: null,
            nodes: []
          }],
          id: 1
        }, {
          nodes: [{
            id: null,
            nodes: []
          }],
          id: 1
        }],
        id: 1
      }],
      id: 1
    })
  })
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/1010
  // ----------------------------------------------------------------
  it('Should default Recursive Union', () => {
    const Binary = <Node extends TSchema>(node: Node) => Type.Object({
      type: Type.Literal('Binary'),
      left: node,
      right: node
    })
    const Node = Type.Object({
      type: Type.Literal('Node'),
      value: Type.String({ default: 'X' })
    })
    const Expr = Type.Recursive(This => Type.Union([Binary(This), Node]))
    const R = Value.Default(Expr, {
      type: 'Binary',
      left: {
        type: 'Node'
      },
      right: {
        type: 'Node'
      }
    })
    Assert.IsEqual(R, {
      type: 'Binary',
      left: {
        type: 'Node',
        value: 'X'
      },
      right: {
        type: 'Node',
        value: 'X'
      }
    })
  })
})
