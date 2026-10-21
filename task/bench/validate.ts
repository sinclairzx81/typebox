import { Compile } from 'typebox/schema'
import Ajv from 'ajv'

import * as Harness from './harness/index.ts'
import { StructuralTests } from './cases.ts'

/** Runs Validate Benchmarks */
export function ValidateTest() {
  const ajv = new Ajv.Ajv()
  const benchmarks: Record<string, Record<string, () => void>> = {}
  for (const test of StructuralTests()) {
    const tb1x = Compile(test.type)
    const ajv8 = ajv.compile(test.type)
    benchmarks[test.name] = {
      TB1X: () => tb1x.Check(test.value),
      AJV8: () => ajv8(test.value),
    }
  }
  const result = Harness.Run(5_000_000, benchmarks)
  Harness.Print(result, {
    units: 'OperationsPerSecond',
    formatResults: true,
    rowHeader: 'Validate',
  })
}
