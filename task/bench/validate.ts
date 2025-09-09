import { TypeCompiler } from 'npm:@sinclair/typebox/compiler'
import { Value } from 'npm:@sinclair/typebox/value'
import { Compile } from 'typebox/compile'
import { Check } from 'typebox/value'
import Ajv from 'npm:ajv'

import { Benchmark } from './benchmark/index.ts'
import { Tests } from './cases.ts'

const ajv = new Ajv.Ajv()
const benchmarks: Record<string, any> = {}
for(const test of Tests) {
  const typeboxV1 = TypeCompiler.Compile(test.type)
  const typeboxV2 = Compile(test.type)
  const ajvCompiled = ajv.compile(test.type)
  benchmarks[test.name] = {
    // 'TypeBox v1': () => typeboxV1.Check(test.value),
    // 'TypeBox v2': () => typeboxV2.Check(test.value),
    // 'Ajv': () => ajvCompiled(test.value),
    // 'Dynamic v1': () => Value.Check(test.type, test.value),
    // 'Dynamic v2': () => Check(test.type, test.value),
    'TypeBox': () => typeboxV2.Check(test.value),
    'Ajv': () => ajvCompiled(test.value),
    'Dynamic': () => Check(test.type, test.value),
  }
}
/** Runs Validate Benchmarks */
export function ValidateTest() {
  const result = Benchmark.Run(200_000, benchmarks)
  Benchmark.Print(result, {
    units: 'OperationsPerSecond',
    formatResults: true
  })
}

