import { createRequire } from 'node:module'
import type { FormatsPlugin } from 'ajv-formats'
import { Get as GetFormat } from 'typebox/format'

import * as Harness from './harness/index.ts'
import { FormatCases } from './cases.ts'

const FORMAT_ITERATIONS = 200_000
const Ajvf: FormatsPlugin = createRequire(import.meta.url)('ajv-formats')
const GetAjvfFormat = Ajvf.get

type Validator = (value: string) => boolean

function ToValidator(format: ReturnType<typeof GetAjvfFormat>): Validator {
  if (format instanceof RegExp) return (value) => format.test(value)
  // ajv-formats registers synchronous validators, but Ajv's type also allows async validators.
  if (typeof format === 'function') return format as Validator
  if (format === true) return () => true
  if (format === null || typeof format !== 'object') throw new Error('Unsupported AJVF format validator')
  const validator = format.validate
  if (validator instanceof RegExp) return (value) => validator.test(value)
  if (typeof validator === 'function') return validator as Validator
  throw new Error('Unsupported AJVF format validator')
}

const AJVF_FORMATS: Record<string, Validator | undefined> = {
  'date-time': ToValidator(GetAjvfFormat('date-time', 'full')),
  date: ToValidator(GetAjvfFormat('date', 'full')),
  duration: ToValidator(GetAjvfFormat('duration', 'full')),
  email: ToValidator(GetAjvfFormat('email', 'full')),
  hostname: ToValidator(GetAjvfFormat('hostname', 'full')),
  ipv4: ToValidator(GetAjvfFormat('ipv4', 'full')),
  ipv6: ToValidator(GetAjvfFormat('ipv6', 'full')),
  'json-pointer-uri-fragment': ToValidator(GetAjvfFormat('json-pointer-uri-fragment', 'full')),
  'json-pointer': ToValidator(GetAjvfFormat('json-pointer', 'full')),
  regex: ToValidator(GetAjvfFormat('regex', 'full')),
  'relative-json-pointer': ToValidator(GetAjvfFormat('relative-json-pointer', 'full')),
  time: ToValidator(GetAjvfFormat('time', 'full')),
  'uri-reference': ToValidator(GetAjvfFormat('uri-reference', 'full')),
  'uri-template': ToValidator(GetAjvfFormat('uri-template', 'full')),
  uri: ToValidator(GetAjvfFormat('uri', 'full')),
  url: ToValidator(GetAjvfFormat('url', 'full')),
  uuid: ToValidator(GetAjvfFormat('uuid', 'full')),
}

type FormatCase = (typeof FormatCases)[number]

function Benchmark(name: string, implementations: Record<string, () => void>) {
  return [name, implementations] as const
}

function TypeBoxBenchmark(test: FormatCase): () => void {
  const validate = GetFormat(test.format)
  if (validate === undefined) throw new Error(`TypeBox format is not registered: ${test.format}`)
  if (!validate(test.value)) throw new Error(`Invalid TypeBox benchmark case: ${test.format}`)
  return () => { validate(test.value) }
}

function AJVFBenchmark(test: FormatCase): Record<string, () => void> {
  const validate = AJVF_FORMATS[test.format]
  if (validate === undefined) return {}
  if (!validate(test.value)) throw new Error(`Invalid AJVF benchmark case: ${test.format}`)
  return { AJVF: () => { validate(test.value) } }
}

function FormatBenchmark(test: FormatCase) {
  return Benchmark(test.name, {
    TB1X: TypeBoxBenchmark(test),
    ...AJVFBenchmark(test),
  })
}

/** Runs direct format validator benchmarks */
export function FormatTest(): void {
  const benchmarks = Object.fromEntries(FormatCases.map(FormatBenchmark))
  const result = Harness.Run(FORMAT_ITERATIONS, benchmarks)
  Harness.Print(result, {
    units: 'OperationsPerSecond',
    formatResults: true,
    rowHeader: 'Format',
  })
}
