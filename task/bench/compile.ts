import { Compile } from 'typebox/schema'
import Ajv from 'ajv'

import * as Harness from './harness/index.ts'
import { StructuralCases } from './cases.ts'

const ajv8 = new Ajv.Ajv()
const benchmarks: Record<string, Record<string, () => void>> = {}
for (const [name, makeSchema] of Object.entries(StructuralCases)) {
  benchmarks[name] = {
    TB1X: () => Compile(makeSchema()),
    AJV8: () => ajv8.compile(makeSchema()),
  }
}
/** Runs Compile Benchmarks */
export function CompileTest() {
  const result = Harness.Run(1000, benchmarks)
  Harness.Print(result, {
    units: 'OperationsPerSecond',
    formatResults: true,
    rowHeader: 'Compile',
  })
}
