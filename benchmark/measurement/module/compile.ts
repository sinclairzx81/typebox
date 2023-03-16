import { Cases } from './cases'
import { Benchmark } from './benchmark'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { TSchema, TypeGuard } from '@sinclair/typebox'
import Ajv from 'ajv'

const ajv = new Ajv() // ensure single instance

export namespace CompileBenchmark {
  function Measure<T extends TSchema>(type: string, schema: T) {
    const iterations = 2000
    console.log('CompileBenchmark.Measure(', type, ')')
    // -------------------------------------------------------------------------------
    // Note: Ajv caches schemas by reference. To ensure we measure actual
    // compilation times, we must pass a new reference via { ...schema }
    // -------------------------------------------------------------------------------
    const AC = Benchmark.Measure(() => ajv.compile({ ...schema }), iterations)
    const CC = Benchmark.Measure(() => TypeCompiler.Compile({ ...schema }), iterations)
    return { type, ajv: AC, compiler: CC }
  }

  export function* Execute() {
    for (const [type, schema] of Object.entries(Cases)) {
      if (!TypeGuard.TSchema(schema)) throw Error('Invalid TypeBox schema')
      // -------------------------------------------------------------------------------
      // Note: it is not possible to benchmark recursive schemas as ajv will cache and
      // track duplicate $id (resulting in compile error). It is not possible to ammend
      // recursive $id's without potentially biasing results, so we omit on this case.
      // -------------------------------------------------------------------------------
      if (type === 'Recursive' || type === 'Array_Recursive') continue

      yield Measure(type, schema)
    }
  }
}
