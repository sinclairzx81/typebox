import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Type, TSchema } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import Ajv from 'ajv'

export namespace Benchmark {
  const ajv = new Ajv()
  const ObjectA = Type.Object({
    p0: Type.String(),
    p1: Type.Number(),
    p2: Type.Number(),
    p3: Type.Array(Type.Number(), { minItems: 4 }),
    p4: Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    }),
    p5: Type.Object({
      a: Type.String(),
      b: Type.String(),
      c: Type.String(),
    }),
  })
  const ObjectB = Type.Object(ObjectA.properties, {
    additionalProperties: false,
  })
  const Tuple = Type.Tuple([Type.String(), Type.Number(), Type.Boolean()])
  const Union = Type.Union([Type.Object({ x: Type.Number(), y: Type.Number() }), Type.Object({ a: Type.String(), b: Type.String() })], { default: { a: 'a', b: 'b' } })
  const Recursive = Type.Recursive(
    (Recursive) =>
      Type.Object({
        id: Type.String(),
        nodes: Type.Array(Recursive),
      }),
    {
      default: {
        id: '',
        nodes: [
          {
            id: '',
            nodes: [
              { id: '', nodes: [] },
              { id: '', nodes: [] },
              { id: '', nodes: [] },
            ],
          },
          {
            id: '',
            nodes: [
              { id: '', nodes: [] },
              { id: '', nodes: [] },
              { id: '', nodes: [] },
            ],
          },
          {
            id: '',
            nodes: [
              { id: '', nodes: [] },
              { id: '', nodes: [] },
              { id: '', nodes: [] },
            ],
          },
        ],
      },
    },
  )
  const Vector4 = Type.Tuple([Type.Number(), Type.Number(), Type.Number(), Type.Number()])
  const Matrix4 = Type.Array(Type.Array(Type.Number()), {
    default: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
  })

  // ------------------------------------------------------------------
  // Measurements
  // ------------------------------------------------------------------

  export function Measure(execute: Function, iterations: number = 16_000_000) {
    const start = Date.now()
    for (let i = 0; i < iterations; i++) execute()
    return { iterations, completed: Date.now() - start }
  }

  export function MeasureType<T extends TSchema>(type: string, schema: T, iterations: number = 16_000_000) {
    console.log('MeasureType:', type)
    const V = Value.Create(schema)
    const AC = ajv.compile(schema)
    const TC = TypeCompiler.Compile(schema)
    const A = Benchmark.Measure(() => {
      if (!AC(V)) throw Error()
    }, iterations)
    const T = Benchmark.Measure(() => {
      if (!TC.Check(V)) throw Error()
    }, iterations)
    return { type, ajv: A, typebox: T }
  }

  export function* Execute() {
    MeasureType('WarmUp', Type.Null(), 128)
    yield MeasureType('RegEx', Type.RegEx(/foo/, { default: 'foo' }))
    yield MeasureType('ObjectA', ObjectA)
    yield MeasureType('ObjectB', ObjectB)
    yield MeasureType('Tuple', Tuple)
    yield MeasureType('Union', Union)
    yield MeasureType('Recursive', Recursive)
    yield MeasureType('Vector4', Vector4)
    yield MeasureType('Matrix4', Matrix4)
    yield MeasureType('Literal<String>', Type.Literal('foo'))
    yield MeasureType('Literal<Number>', Type.Literal(1))
    yield MeasureType('Literal<Boolean>', Type.Literal(true))
    yield MeasureType('Array<Number>', Type.Array(Type.Number(), { minItems: 16 }))
    yield MeasureType('Array<String>', Type.Array(Type.String(), { minItems: 16 }))
    yield MeasureType('Array<Boolean>', Type.Array(Type.Boolean(), { minItems: 16 }))
    yield MeasureType('Array<ObjectA>', Type.Array(ObjectA, { minItems: 16 }))
    yield MeasureType('Array<ObjectB>', Type.Array(ObjectB, { minItems: 16 }))
    yield MeasureType('Array<Tuple>', Type.Array(Tuple, { minItems: 16 }))
    yield MeasureType('Array<Vector4>', Type.Array(Vector4, { minItems: 16 }))
    yield MeasureType('Array<Matrix4>', Type.Array(Matrix4, { minItems: 16 }))
    yield MeasureType('Any', Type.Any())
    yield MeasureType('Boolean', Type.Boolean())
    yield MeasureType('Integer', Type.Integer())
    yield MeasureType('Null', Type.Null())
    yield MeasureType('Number', Type.Number())
    yield MeasureType('String', Type.String())
    yield MeasureType('Unknown', Type.Unknown())
  }
}

// ------------------------------------------------------------------
// Results
// ------------------------------------------------------------------

const results = [...Benchmark.Execute()].reduce((acc, result) => {
  const delta = result.ajv.completed / result.typebox.completed
  const percent = (delta - 1.0) * 100
  return {
    ...acc,
    [result.type]: {
      Iterations: result.typebox.iterations,
      Ajv: `${result.ajv.completed}ms`,
      TypeBox: `${result.typebox.completed}ms`,
      Performance: `+${Math.floor(percent)}%`,
    },
  }
}, {})

console.table(results)
