import { TypeCompiler } from 'npm:@sinclair/typebox/compiler'
import { TSchema } from 'npm:@sinclair/typebox'
import { Compile } from 'typebox/compile'
import Ajv from 'npm:ajv'

import { Benchmark } from './benchmark/index.ts'
import { Cases } from './cases.ts'

const ajv8 = new Ajv.Ajv()
const benchmarks: Record<string, any> = {}
for(const key of Object.getOwnPropertyNames(Cases)) {
  const test = Cases[key as never] as () => TSchema
  benchmarks[test.name] = {
    'TB0x': () => TypeCompiler.Compile(test()),
    'TB1x': () => Compile(test()),
    'AJV8': () => ajv8.compile(test())
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

