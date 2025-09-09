import { TypeCompiler } from 'npm:@sinclair/typebox/compiler'
import { TSchema } from 'npm:@sinclair/typebox'
import { Compile } from 'typebox/compile'
import Ajv from 'npm:ajv'

import { Benchmark } from './benchmark/index.ts'
import { Cases } from './cases.ts'

const ajv = new Ajv.Ajv()
const benchmarks: Record<string, any> = {}
for(const key of Object.getOwnPropertyNames(Cases)) {
  const test = Cases[key as never] as () => TSchema
  benchmarks[test.name] = {
    'TypeBox': () => Compile(test()),
    'Ajv': () =>  ajv.compile(test())
  }
}
/** Runs Compile Benchmarks */
export function CompileTest() {
  const result = Benchmark.Run(1000, benchmarks)
  Benchmark.Print(result, {
    units: 'OperationsPerSecond',
    formatResults: true
  })
}

