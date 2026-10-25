import Schema from 'typebox/schema'
import Module from 'typebox/module'
import Type from 'typebox'
import Ajv from 'ajv'

import { Benchmark } from './benchmark/index.ts'
import { Cases } from './cases.ts'

const ajv8 = new Ajv.Ajv()
const benchmarks: Record<string, any> = {}
for(const key of Object.getOwnPropertyNames(Cases)) {
  const test = Cases[key as never] as () => Type.TSchema
  benchmarks[test.name] = {
    'TB1X JIT': () => Schema.Compile(test()),
    'TB1X AOT': () => Module.Build(test()),
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
