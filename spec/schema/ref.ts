import {Static, TArray, TEnum, TObject, TRef, TString, TUnion, Type} from '@sinclair/typebox'
import { ajv, fail, ok } from "./validate";

describe('Ref', () => {
  it('Object', () => {
    const T = Type.Object({
      a: Type.Number(),
      b: Type.String(),
      c: Type.Boolean(),
      d: Type.Array(Type.Number()),
      e: Type.Object({
        x: Type.Number(),
        y: Type.Number()
      })
    }, {
      $id: 'referenced-object'
    })
    const R = Type.Ref(T)

    ajv.addSchema(T)

    ok(R, {
      a: 10,
      b: '',
      c: true,
      d: [1, 2, 3],
      e: {
        x: 10,
        y: 20
      }
    })

    fail(R, {})
    fail(R, [])
    fail(R, 'hello')
    fail(R, true)
    fail(R, 123)
    fail(R, null)
  })

  it('Tuple', () => {
    const T = Type.Tuple([
      Type.Number(), 
      Type.Number()
    ], { $id: 'Tuple' })
    
    ajv.addSchema(T)
    
    const R = Type.Ref(T)

    ok(R, [0, 0])
    fail(R, {})
    fail(R, [])
    fail(R, 'hello')
    fail(R, true)
    fail(R, 123)
    fail(R, null)
  })

  it('Node', () => {
    // explicit type annotation for recursive type
    type TNode = TObject<{
      name: TString,
      children: TArray<TRef<TNode>>
    }>

    type Node = Static<typeof Node>;
    const Node: TNode = Type.Object({
      name: Type.String(),
      children: Type.Array(Type.Ref(() => Node))
    }, {
      $id: 'node'
    })

    const node: Node = {
      name: 'root',
      children: [
        {name: 'first', children: []},
        {name: 'second', children: []},
      ]
    }
    ok(Node, node)
    fail(Node, {})
    fail(Node, [])
    fail(Node, 'hello')
    fail(Node, true)
    fail(Node, 123)
    fail(Node, null)
    fail(Node, {a: 1})
    fail(Node, {name: 'test'})
    fail(Node, {
      name: 'root',
      children: [
        {
          name: 'first',
          children: [],
          invalid: 1
        }
      ]
    })
  })

  it('Condition', () => {
    // explicit type annotation for recursive type
    type TCondition = TObject<{
      operator: TEnum<OperatorName>,
      operands: TArray<TUnion<[typeof Operand, TRef<TCondition>]>>
    }>

    enum OperatorName {
      And = 'and',
      Or = 'or',
    }
    enum OperandName {
      A = 'operandA',
      B = 'operandB',
      C = 'operandC',
    }
    const Operand = Type.Object({
      name: Type.Enum(OperandName)
    })
    type Condition = Static<typeof Condition>;
    const Condition: TCondition = Type.Object({
      operator: Type.Enum(OperatorName),
      operands: Type.Array(
        Type.Union([
          Operand,
          Type.Ref(() => Condition)
        ])
      )
    }, {
      $id: 'condition'
    })

    const condition: Condition = {
      operator: OperatorName.And,
      operands: [
        {
          name: OperandName.A,
        },
        {
          operator: OperatorName.Or,
          operands: [
            {
              name: OperandName.B,
            },
            {
              name: OperandName.C,
            },
          ],
        },
      ],
    }
    ok(Condition, condition)
    ok(Condition, {
      operator: 'and',
      operands: [
        {
          name: 'operandA',
        },
        {
          operator: 'or',
          operands: [
            {
              name: 'operandB',
            },
            {
              name: 'operandC',
            },
          ],
        },
      ],
    })
    fail(Condition, {})
    fail(Condition, [])
    fail(Condition, 'hello')
    fail(Condition, true)
    fail(Condition, 123)
    fail(Condition, null)
    fail(Condition, {a: 1})
    fail(Condition, {
      operator: 'and',
      operands: [
        {
          name: 'operandZ',
        },
      ],
    })
  })
})
