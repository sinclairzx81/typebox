import * as Fs from "node:fs"
import Format from 'typebox/format'
import * as Syntax from '../../src/format/syntax/index.ts'

type Candidate = { value: string; expected: boolean }

const LIMIT = Syntax.MAX_FORMAT_LENGTH
const Sizes = [4096, 8192, 16384, 32768, 65536, 131072, 262144]
const Iterations = [256, 180, 120, 70, 40, 15, 6]
const FormatValidators: Record<string, (value: string) => boolean> = {
  IsDate: Format.IsDate,
  IsDateTime: Format.IsDateTime,
  IsDuration: Format.IsDuration,
  IsEmail: Format.IsEmail,
  IsHostname: Format.IsHostname,
  IsIdnEmail: Format.IsIdnEmail,
  IsIdnHostname: Format.IsIdnHostname,
  IsIPv4: Format.IsIPv4,
  IsIPv6: Format.IsIPv6,
  IsIriReference: Format.IsIriReference,
  IsIri: Format.IsIri,
  IsJsonPointerUriFragment: Format.IsJsonPointerUriFragment,
  IsJsonPointer: Format.IsJsonPointer,
  IsRegex: Format.IsRegex,
  IsRelativeJsonPointer: Format.IsRelativeJsonPointer,
  IsTime: Format.IsTime,
  IsUriReference: Format.IsUriReference,
  IsUriTemplate: Format.IsUriTemplate,
  IsUri: Format.IsUri,
  IsUrl: Format.IsUrl,
  IsUuid: Format.IsUuid,
}
function Fit(prefix: string, suffix: string, length: number, character: string = 'a'): string {
  const count = length - prefix.length - suffix.length
  if (count < 0) throw new Error(`Cannot fit input into ${length} code units`)
  return `${prefix}${character.repeat(count)}${suffix}`
}
function Cases(name: string, length: number): Candidate[] {
  switch (name) {
    case 'IsDate':
      return [{ value: Fit('2020-12-12', '', length), expected: false }]
    case 'IsDateTime':
      return [
        { value: Fit('2000-01-01T00:00:00Z[x=', ']', length), expected: true },
        { value: Fit('2000-01-01T00:00:00Z[x=', ']x', length), expected: false },
      ]
    case 'IsDuration':
      return [
        { value: `P${'1'.repeat(length - 2)}D`, expected: true },
        { value: `P${'1'.repeat(length - 2)}X`, expected: false },
      ]
    case 'IsEmail':
      return [{ value: `a${'a'.repeat(length - 1)}`, expected: false }]
    case 'IsHostname':
      return [{ value: `a${'a'.repeat(length - 1)}`, expected: false }]
    case 'IsIdnEmail':
      return [
        { value: `${'a'.repeat(length - '@例子.测试'.length)}@例子.测试`, expected: true },
        { value: `${'a'.repeat(length - '@例子.测试'.length - 1)} @例子.测试`, expected: false },
        { value: `a@${'\u00ad'.repeat(length - 13)}example.com`, expected: true },
      ]
    case 'IsIdnHostname':
      return [
        { value: `${'\u00ad'.repeat(length - 11)}example.com`, expected: true },
        { value: `${'\u00ad'.repeat(length - 12)}example-.com`, expected: false },
        { value: '\uff41'.repeat(length), expected: false },
      ]
    case 'IsIPv4':
      return [{ value: `1${'1'.repeat(length - 1)}`, expected: false }]
    case 'IsIPv6':
      return [{ value: `1${'1'.repeat(length - 1)}`, expected: false }]
    case 'IsIriReference':
    case 'IsUriReference':
      return [
        { value: (name === 'IsIriReference' ? 'é' : 'a').repeat(length), expected: true },
        { value: `${(name === 'IsIriReference' ? 'é' : 'a').repeat(length - 1)}%`, expected: false },
        { value: ('a/'.repeat(Math.ceil(length / 2))).slice(0, length), expected: true },
        { value: `${'/'.repeat(length - 1)} `, expected: false },
      ]
    case 'IsIri':
      return [
        { value: Fit('http://example.com/', '', length, 'é'), expected: true },
        { value: Fit('http://example.com/', '%', length, 'é'), expected: false },
        { value: Fit('http://example.com/', '', length, '/'), expected: true },
        { value: Fit('http://example.com/', ' ', length, '/'), expected: false },
      ]
    case 'IsJsonPointerUriFragment':
      return [
        { value: `#/${'a'.repeat(length - 2)}`, expected: true },
        { value: `#/${'a'.repeat(length - 3)}~`, expected: false },
      ]
    case 'IsJsonPointer':
      return [
        { value: `/${'a'.repeat(length - 1)}`, expected: true },
        { value: `/${'a'.repeat(length - 2)}~`, expected: false },
      ]
    case 'IsRegex':
      return [
        { value: 'a'.repeat(length), expected: true },
        { value: `${'a'.repeat(length - 1)}(`, expected: false },
      ]
    case 'IsRelativeJsonPointer':
      return [
        { value: `0/${'a'.repeat(length - 2)}`, expected: true },
        { value: `0/${'a'.repeat(length - 3)}~`, expected: false },
      ]
    case 'IsTime':
      return [
        { value: `12:34:56.${'1'.repeat(length - 10)}Z`, expected: true },
        { value: `12:34:56.${'1'.repeat(length - 10)}X`, expected: false },
      ]
    case 'IsUriTemplate':
      return [
        { value: 'a'.repeat(length), expected: true },
        { value: `${'a'.repeat(length - 1)}{`, expected: false },
        { value: `{${'x,'.repeat(Math.ceil((length - 1) / 2))}`.slice(0, length), expected: false },
      ]
    case 'IsUri':
      return [
        { value: Fit('http://example.com/', '', length), expected: true },
        { value: Fit('http://example.com/', '%', length), expected: false },
        { value: Fit('http://example.com/', '', length, '/'), expected: true },
        { value: Fit('http://example.com/', ' ', length, '/'), expected: false },
      ]
    case 'IsUrl':
      return [
        { value: Fit('http://example.com/', '', length), expected: true },
        { value: 'a'.repeat(length), expected: false },
      ]
    case 'IsUuid':
      return [{ value: `00000000-0000-4000-8000-000000000000${'x'.repeat(length - 36)}`, expected: false }]
    default:
      throw new Error(`No benchmark cases configured for ${name}`)
  }
}
function IsIdnUnsupported(name: string, length: number): boolean {
  return length > LIMIT && (name === 'IsIdnEmail' || name === 'IsIdnHostname')
}
function IsSyntaxBounded(name: string): boolean {
  return name === 'IsHostname' || name === 'IsIPv4' || name === 'IsIPv6'
}
function CreateTable(results: Map<string, (number | null)[]>): string {
  const headings = ['Format', ...Sizes.map((size) => `${size / 1024}K`)]
  const lines = [`| ${headings.join(' | ')} |`, `| ${headings.map(() => '---').join(' | ')} |`]
  for (const [name, values] of results) {
    const cells = values.map((value) => {
      if (value === null) return '---'
      const suffix = IsSyntaxBounded(name) ? '*' : ''
      return `${value.toFixed(2)} µs${suffix}`
    })
    lines.push(`| ${name} | ${cells.join(' | ')} |`)
  }
  return lines.join('\n')
}
function Measure(name: string, value: string, expected: boolean, iterations: number): number {
  const validate = FormatValidators[name]
  if (validate(value) !== expected) throw new Error(`Unexpected validation result for ${name}`)
  for (let index = 0; index < 3; index++) validate(value)
  const start = process.hrtime.bigint()
  for (let index = 0; index < iterations; index++) validate(value)
  return Number(process.hrtime.bigint() - start) / iterations / 1000
}
export function Check(): void {
  const results = new Map<string, (number | null)[]>()
  for (const name of Object.keys(FormatValidators)) {
    const values = Sizes.map((size, index) => {
      if (IsIdnUnsupported(name, size)) return null
      let slowest = 0
      for (const candidate of Cases(name, size)) {
        if (candidate.value.length !== size) throw new Error(`${name} candidate has an unexpected length`)
        slowest = Math.max(slowest, Measure(name, candidate.value, candidate.expected, Iterations[index]))
      }
      return slowest
    })
    results.set(name, values)
  }
  const table = CreateTable(results)
  Fs.mkdirSync('target/linear', { recursive: true })
  Fs.writeFileSync('target/linear/results.md', table)
  console.log(table)
}
