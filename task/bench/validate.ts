import { TypeCompiler } from 'npm:@sinclair/typebox/compiler'
import { Compile } from 'typebox/compile'
import { Check } from 'typebox/value'
import Ajv from 'npm:ajv'
import { Benchmark } from './benchmark/index.ts'
import { Tests } from './cases.ts'

/** Runs Validate Benchmarks */
export function ValidateTest() {
  const ajv = new Ajv.Ajv()
  const benchmarks: Record<string, any> = {}
  for(const test of Tests()) {
    const tb0x = TypeCompiler.Compile(test.type)
    const tb1x = Compile(test.type)
    const ajv8 = ajv.compile(test.type)
    benchmarks[test.name] = {
      // 'TypeBox v1': () => typeboxV1.Check(test.value),
      // 'TypeBox v2': () => typeboxV2.Check(test.value),
      // 'Ajv': () => ajvCompiled(test.value),
      // 'Dynamic v1': () => Value.Check(test.type, test.value),
      // 'Dynamic v2': () => Check(test.type, test.value),
      'TB0x': () => tb0x.Check(test.value),
      'TB1x': () => tb1x.Check(test.value),
      'AJV8': () => ajv8(test.value),
      // 'Dynamic': () => Check(test.type, test.value),
    }
  }
  const result = Benchmark.Run(10_000_000, benchmarks)
  Benchmark.Print(result, {
    units: 'OperationsPerSecond',
    formatResults: true
  })
}

