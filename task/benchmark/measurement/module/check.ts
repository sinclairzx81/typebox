import { Cases } from './cases'
import { Benchmark } from './benchmark'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { TSchema, TypeGuard } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

import Ajv from 'ajv'

const ajv = new Ajv() // ensure single instance

export namespace CheckBenchmark {
  function Measure<T extends TSchema>(type: string, schema: T) {
    console.log('CheckBenchmark.Measure(', type, ')')

    const iterations = 1_000_000
    const V = Value.Create(schema)

    const AC = ajv.compile(schema)
    const A = Benchmark.Measure(() => {
      if (!AC(V)) throw Error()
    }, iterations)

    const CC = TypeCompiler.Compile(schema)
    const T = Benchmark.Measure(() => {
      if (!CC.Check(V)) throw Error()
    }, iterations)

    const VC = Benchmark.Measure(() => {
      if (!Value.Check(schema, V)) throw Error()
    }, iterations)

    return { type, ajv: A, compiler: T, value: VC }
  }

  export function* Execute() {
    for (const [type, schema] of Object.entries(Cases)) {
      if (!TypeGuard.TSchema(schema)) throw Error('Invalid TypeBox schema')
      yield Measure(type, schema)
    }
  }
}
