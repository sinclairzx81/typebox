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

  const Tuple = Type.Tuple([Type.Number(), Type.Number(), Type.Number()])

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

  // ------------------------------------------------------------------
  // Measurements
  // ------------------------------------------------------------------

  export function Measure(execute: Function, iterations: number = 16_000_000) {
    const start = Date.now()
    for (let i = 0; i < iterations; i++) execute()
    return { iterations, completed: Date.now() - start }
  }

  export function TypeCheck<T extends TSchema>(type: string, schema: T, iterations: number = 16_000_000) {
    console.log('TypeCheck:', type)
    const V = Value.Create(schema)
    const C0 = ajv.compile(schema)
    const C1 = TypeCompiler.Compile(schema)
    const R0 = Benchmark.Measure(() => {
      if (!C0(V)) throw Error()
    }, iterations)
    const R1 = Benchmark.Measure(() => {
      if (!C1.Check(V)) throw Error()
    }, iterations)
    return { type, ajv: R0, typebox: R1 }
  }

  export function* Run() {
    TypeCheck('WarmUp', Type.Null(), 128)

    yield TypeCheck('Any', Type.Any())
    yield TypeCheck('Boolean', Type.Boolean())
    yield TypeCheck('Integer', Type.Integer())
    yield TypeCheck('Null', Type.Null())
    yield TypeCheck('Number', Type.Number())
    yield TypeCheck('String', Type.String())
    yield TypeCheck('Unknown', Type.Unknown())
    yield TypeCheck('RegEx', Type.RegEx(/foo/, { default: 'foo' }))
    yield TypeCheck('ObjectA', ObjectA)
    yield TypeCheck('ObjectB', ObjectB)
    yield TypeCheck('Tuple', Tuple)
    yield TypeCheck('Union', Union)
    yield TypeCheck('Recursive', Recursive)
    yield TypeCheck('Literal<String>', Type.Literal('foo'))
    yield TypeCheck('Literal<Number>', Type.Literal(1))
    yield TypeCheck('Literal<Boolean>', Type.Literal(true))
    yield TypeCheck('Array<Number>', Type.Array(Type.Number(), { minItems: 16 }))
    yield TypeCheck('Array<String>', Type.Array(Type.String(), { minItems: 16 }))
    yield TypeCheck('Array<Boolean>', Type.Array(Type.Boolean(), { minItems: 16 }))
    yield TypeCheck('Array<ObjectA>', Type.Array(ObjectA, { minItems: 16 }))
    yield TypeCheck('Array<ObjectB>', Type.Array(ObjectB, { minItems: 16 }))
    yield TypeCheck('Array<Tuple>', Type.Array(Tuple, { minItems: 16 }))
  }
}

// ------------------------------------------------------------------
// Reporting
// ------------------------------------------------------------------

const report: Record<string, any> = {}
for (const measurement of Benchmark.Run()) {
  const delta = measurement.ajv.completed / measurement.typebox.completed
  const percent = (delta - 1.0) * 100
  report[measurement.type] = {
    Iterations: measurement.typebox.iterations,
    'Ajv Completed': `${measurement.ajv.completed}ms`,
    'TypeBox Completed': `${measurement.typebox.completed}ms`,
    Performance: `${Math.floor(percent)}% faster`,
  }
}
console.table(report)
